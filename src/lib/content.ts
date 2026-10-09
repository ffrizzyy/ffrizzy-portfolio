import { z } from "zod";

import {
  awardSchema,
  certIssuerSchema,
  educationSchema,
  eventSchema,
  growthSlideSchema,
  projectSchema,
  skillSchema,
  statSchema,
  timelineEntrySchema,
  toolSchema,
  writingItemSchema,
  type Award,
  type CertIssuer,
  type Education,
  type PortfolioEvent,
  type Project,
  type ProjectType,
  type Skill,
  type Stat,
  type TimelineEntry,
  type Tool,
  type WritingItem,
} from "@/content/schema";
import { FEATURED_ORDER, projects, WORK_FILTERS, type WorkFilter } from "@/content/projects";
import {
  awards as rawAwards,
  certifications as rawCerts,
  deepSkills as rawSkills,
  education as rawEducation,
  events as rawEvents,
  extraSkillUsage,
  growthSlides as rawGrowth,
  languages as rawLanguages,
  stats as rawStats,
  timeline as rawTimeline,
  tools as rawTools,
  writing as rawWriting,
} from "@/content/site";

/* ------------------------------------------------------------------ *
 * Validation. Spec 5.5: an invalid record must fail the build with a  *
 * field-level error rather than render an empty box.                  *
 * ------------------------------------------------------------------ */

export const projectList: Project[] = z.array(projectSchema).parse(projects);
export const timelineList: TimelineEntry[] = z.array(timelineEntrySchema).parse(rawTimeline);
export const eventList: PortfolioEvent[] = z.array(eventSchema).parse(rawEvents);
export const awardList: Award[] = z.array(awardSchema).parse(rawAwards);
export const educationList: Education[] = z.array(educationSchema).parse(rawEducation);
export const certList: CertIssuer[] = z.array(certIssuerSchema).parse(rawCerts);
export const languages = rawLanguages;
export const growthList = z.array(growthSlideSchema).parse(rawGrowth);
export const writingList: WritingItem[] = z.array(writingItemSchema).parse(rawWriting);
export const skillList: Skill[] = z.array(skillSchema).parse(rawSkills);
export const toolList: Tool[] = z.array(toolSchema).parse(rawTools);

/** Slug uniqueness, so two records cannot quietly shadow each other. */
const slugs = projectList.map((p) => p.slug);
const duplicateSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
if (duplicateSlugs.length > 0) {
  throw new Error(`Duplicate project slugs: ${[...new Set(duplicateSlugs)].join(", ")}`);
}

/* ------------------------------------------------------------------ *
 * Computed stats. Spec 4.2: the events and projects numbers are       *
 * computed, never typed.                                              *
 * ------------------------------------------------------------------ */

export const statsResolved: Stat[] = z.array(statSchema).parse(
  rawStats.map((stat) => {
    if (stat.computedFrom === "events") return { ...stat, value: eventList.length };
    if (stat.computedFrom === "projects") return { ...stat, value: projectList.length };
    return stat;
  }),
);

/** Drives the stacked-bar illustration and the "Build 4" style labels. */
export const projectTypeBreakdown: Record<ProjectType, number> = projectList.reduce(
  (acc, project) => {
    acc[project.type] = (acc[project.type] ?? 0) + 1;
    return acc;
  },
  { build: 0, data: 0, research: 0, design: 0, content: 0 } as Record<ProjectType, number>,
);

/* ------------------------------------------------------------------ *
 * Featured bento cells. Spec 4.3: exactly five, in a fixed order.     *
 * ------------------------------------------------------------------ */

export const featuredProjects: Project[] = FEATURED_ORDER.map((slug) => {
  const match = projectList.find((project) => project.slug === slug);
  if (!match) throw new Error(`Featured order references a missing project: ${slug}`);
  return match;
});

if (featuredProjects.length !== 5) {
  throw new Error(`Spec 4.3 requires exactly 5 bento cells, found ${featuredProjects.length}`);
}

/* ------------------------------------------------------------------ *
 * Skills map. Spec 4.4: "Used in" lists are computed from project     *
 * tags, so adding a project updates them.                             *
 * ------------------------------------------------------------------ */

export type SkillUsage = {
  skill: Skill;
  usedIn: { label: string; href: string; external: boolean }[];
};

export const skillsMap: SkillUsage[] = skillList.map((skill) => {
  // Spec 4.4: project links jump to the #all section.
  const fromProjects = projectList
    .filter((project) => project.tags.includes(skill.name))
    .map((project) => ({ label: project.title, href: "#all", external: false }));

  const extra = (extraSkillUsage[skill.id] ?? []).map((entry) => ({
    label: entry.label,
    href: entry.href,
    external: false,
  }));

  return { skill, usedIn: [...fromProjects, ...extra] };
});

/**
 * Invariant 1 from spec 7.1: a skill that resolves to nothing is an orphan and
 * fails the build, because it means a rename broke the mapping silently.
 */
const orphanSkills = skillsMap.filter((entry) => entry.usedIn.length === 0);
if (orphanSkills.length > 0) {
  throw new Error(
    `Skills map has orphan skills with no project and no content entry: ${orphanSkills
      .map((entry) => entry.skill.name)
      .join(", ")}. Fix the project tags or the skill name.`,
  );
}

/* ------------------------------------------------------------------ *
 * The #all list. Spec 4.7: 11 rows, but only 10 are project files.    *
 * ------------------------------------------------------------------ */

export type WorkRow = {
  id: string;
  title: string;
  outcome: string;
  type: ProjectType;
  /** A content row points at a section anchor rather than a case study. */
  href: string;
};

/** Explicit order so the grouping reads Build, Data, Research, Design. */
const WORK_ROW_ORDER = [
  "azzifa",
  "portal-publik",
  "watsonx-genai-app",
  "redesign-challenge",
  "aid-dashboard",
  "imdb-sentiment-bilstm",
  "rice-clustering",
  "topsis-smart",
  "cobit-audit",
  "sat-set",
];

const projectRows: WorkRow[] = WORK_ROW_ORDER.map((slug) => {
  const match = projectList.find((project) => project.slug === slug);
  if (!match) throw new Error(`Work row order references a missing project: ${slug}`);
  return {
    id: match.slug,
    title: match.title,
    outcome: match.outcome,
    type: match.type,
    href: `/work/${match.slug}`,
  };
});

/** The eleventh row: content work, which has no case study route. */
const contentRow: WorkRow = {
  id: "audience-growth-stories",
  title: "Audience growth stories",
  outcome: "Publication strategy and content that grew 10+ accounts to 100K+ combined followers.",
  type: "content",
  href: "#content",
};

export const workRows: WorkRow[] = [...projectRows, contentRow];

export function filterWorkRows(filter: WorkFilter): WorkRow[] {
  if (filter === "all") return workRows;
  return workRows.filter((row) => row.type === filter);
}

export function isWorkFilter(value: string): value is WorkFilter {
  return (WORK_FILTERS as readonly string[]).includes(value);
}

/* ------------------------------------------------------------------ *
 * Lookups                                                             *
 * ------------------------------------------------------------------ */

export function getProject(slug: string): Project | undefined {
  return projectList.find((project) => project.slug === slug);
}

export function getNextProject(slug: string): Project {
  const index = projectList.findIndex((project) => project.slug === slug);
  const next = index === -1 ? undefined : projectList[(index + 1) % projectList.length];
  // projectList is non-empty, so this cannot be undefined in practice.
  return next ?? (projectList[0] as Project);
}

export function getFeaturedWriting(): WritingItem | undefined {
  return writingList.find((item) => item.featured);
}

export function getInstagramSeries(): WritingItem[] {
  return writingList.filter((item) => item.platform === "instagram");
}

/** The events axis for the tick illustration: 2022 to 2026, spec 4.2. */
export const EVENTS_AXIS = { from: 2022, to: 2026 } as const;
