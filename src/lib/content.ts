import { z } from "zod";

import {
  awardSchema,
  certIssuerSchema,
  educationSchema,
  eventSchema,
  growthSlideSchema,
  projectSchema,
  repoSchema,
  skillCategorySchema,
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
  type Repo,
  type Skill,
  type SkillCategory,
  type Stat,
  type TimelineEntry,
  type Tool,
  type WritingItem,
} from "@/content/schema";
import { FEATURED_ORDER, projects } from "@/content/projects";
import { repoFallback } from "@/content/repos";
import { isWorkFilter, WORK_FILTERS, type WorkFilter } from "@/lib/work-filters";
import {
  awards as rawAwards,
  certifications as rawCerts,
  deepSkills as rawSkills,
  education as rawEducation,
  eventTotals,
  events as rawEvents,
  experience as rawExperience,
  extraSkillUsage,
  growthSlides as rawGrowth,
  languages as rawLanguages,
  leadership as rawLeadership,
  skillCategories as rawSkillCategories,
  stats as rawStats,
  summary as rawSummary,
  tools as rawTools,
  writing as rawWriting,
} from "@/content/site";

/* ------------------------------------------------------------------ *
 * Validation. Spec 5.5: an invalid record must fail the build with a  *
 * field-level error rather than render an empty box.                  *
 * ------------------------------------------------------------------ */

export const projectList: Project[] = z.array(projectSchema).parse(projects);
export const experienceList: TimelineEntry[] = z.array(timelineEntrySchema).parse(rawExperience);
export const leadershipList: TimelineEntry[] = z.array(timelineEntrySchema).parse(rawLeadership);
export const summary: string = rawSummary;
export const skillCategoryList: SkillCategory[] = z
  .array(skillCategorySchema)
  .parse(rawSkillCategories);
export const eventList: PortfolioEvent[] = z.array(eventSchema).parse(rawEvents);
export const awardList: Award[] = z.array(awardSchema).parse(rawAwards);
export const educationList: Education[] = z.array(educationSchema).parse(rawEducation);
export const certList: CertIssuer[] = z.array(certIssuerSchema).parse(rawCerts);
export const languages = rawLanguages;
export const growthList = z.array(growthSlideSchema).parse(rawGrowth);
export const writingList: WritingItem[] = z.array(writingItemSchema).parse(rawWriting);
export const skillList: Skill[] = z.array(skillSchema).parse(rawSkills);
export const toolList: Tool[] = z.array(toolSchema).parse(rawTools);
export const repoList: Repo[] = z.array(repoSchema).parse(repoFallback);

/** Slug uniqueness, so two records cannot quietly shadow each other. */
const slugs = projectList.map((p) => p.slug);
const duplicateSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
if (duplicateSlugs.length > 0) {
  throw new Error(`Duplicate project slugs: ${[...new Set(duplicateSlugs)].join(", ")}`);
}

/**
 * A repository card that names a case study must name one that exists, so a
 * rename in projects.ts cannot leave a dead "Case study" link behind.
 */
const missingRepoCaseStudies = repoList
  .map((repo) => repo.projectSlug)
  .filter((slug): slug is string => Boolean(slug))
  .filter((slug) => !projectList.some((project) => project.slug === slug));
if (missingRepoCaseStudies.length > 0) {
  throw new Error(
    `Repository cards reference missing case studies: ${[
      ...new Set(missingRepoCaseStudies),
    ].join(", ")}. Fix the projectSlug in content/repos.ts.`,
  );
}

/**
 * The owner's stated total: 2 flagship festivals, 1 national conference, and 20
 * or more webinars, seminars, and sharing sessions. The last figure is a floor,
 * so the sum is a floor too, which is why the stat keeps its lower-bound plus.
 */
export const eventsValue =
  eventTotals.festivals + eventTotals.conferences + eventTotals.smallerEvents;

// A named event cannot outnumber the stated total, which would mean one of the
// two numbers is stale.
if (eventList.length > eventsValue) {
  throw new Error(
    `More named events (${eventList.length}) than the stated total (${eventsValue}). ` +
      "Update eventTotals in content/site.ts.",
  );
}

/**
 * Computed stats. Spec 4.2: the events and projects numbers are
 * computed, never typed. The repository count joins them because the Open
 * source section reads the same GitHub list.
 *
 * This takes the live counts as arguments rather than reading a module-level
 * constant, so a failed fetch cannot leave a stale number in the grid. The
 * project count defaults to the curated list so a caller without the GitHub
 * layer still gets a valid stat.
 */

export function resolveStats(repoCount: number, projectCount: number = projectList.length): Stat[] {
  return z.array(statSchema).parse(
    rawStats.map((stat) => {
      if (stat.computedFrom === "events") return { ...stat, value: eventsValue };
      if (stat.computedFrom === "projects") return { ...stat, value: projectCount };
      if (stat.computedFrom === "repos") return { ...stat, value: repoCount };
      return stat;
    }),
  );
}

/** Drives the stacked-bar illustration and the "Build 4" style labels. */
export function resolveProjectTypeBreakdown(
  projects: Project[] = projectList,
): Record<ProjectType, number> {
  return projects.reduce(
    (acc, project) => {
      acc[project.type] = (acc[project.type] ?? 0) + 1;
      return acc;
    },
    { build: 0, data: 0, research: 0, design: 0, content: 0 } as Record<ProjectType, number>,
  );
}

/** The curated breakdown, for callers that do not have the repository list. */
export const projectTypeBreakdown: Record<ProjectType, number> =
  resolveProjectTypeBreakdown(projectList);

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
 * The #all list. Spec 4.7 called for 11 rows. It is now the curated    *
 * project files plus one row per public repository that has no written *
 * case study, plus the content row.                                    *
 * ------------------------------------------------------------------ */

export type WorkRow = {
  id: string;
  title: string;
  outcome: string;
  type: ProjectType;
  /** A content row points at a section anchor rather than a case study. */
  href: string;
  /** Shown as a mono detail on the row. Absent for the content row. */
  period?: string;
};

/** Explicit order so the grouping reads Build, Data, Research, Design. */
const WORK_ROW_ORDER = [
  "prepo",
  "joevix",
  "kerinci-lang",
  "djournl",
  "portal-publik",
  "watsonx-genai-app",
  "redesign-challenge",
  "frizzy-store-system",
  "she-aint-allat",
  "loopnote",
  "aid-dashboard",
  "imdb-sentiment-bilstm",
  "rice-clustering",
  "topsis-smart",
  "cobit-audit",
  "sat-set",
  "sdc-2024",
];

function toWorkRow(project: Project): WorkRow {
  return {
    id: project.slug,
    title: project.title,
    outcome: project.outcome,
    type: project.type,
    href: `/work/${project.slug}`,
    period: project.period,
  };
}

/** The last row: content work, which has no case study route. */
const contentRow: WorkRow = {
  id: "audience-growth-stories",
  title: "Audience growth stories",
  outcome: "Publication strategy and content that grew 10+ accounts to 100K+ combined followers.",
  type: "content",
  href: "#content",
};

/**
 * Curated rows in their explicit order, then any repository-derived records,
 * then the content row.
 *
 * The repository records arrive in the order the caller supplies them, which is
 * newest push first, so a repository that was just created or pushed appears at
 * the head of the generated group without an edit to this file. `projects` must
 * contain every slug in WORK_ROW_ORDER; the build fails rather than dropping a
 * row when a curated slug is renamed.
 */
export function buildWorkRows(projects: Project[]): WorkRow[] {
  const rows: WorkRow[] = [];
  const seen = new Set<string>();

  for (const slug of WORK_ROW_ORDER) {
    const match = projects.find((project) => project.slug === slug);
    if (!match) throw new Error(`Work row order references a missing project: ${slug}`);
    rows.push(toWorkRow(match));
    seen.add(slug);
  }

  for (const project of projects) {
    if (seen.has(project.slug)) continue;
    rows.push(toWorkRow(project));
    seen.add(project.slug);
  }

  return [...rows, contentRow];
}

/**
 * The curated list on its own. Server callers that can reach GitHub use
 * `getWorkRows()` from `lib/work.server.ts`, which adds the repository records.
 */
export const workRows: WorkRow[] = buildWorkRows(projectList);

// Re-exported so server callers keep a single import for this list. Client
// Components must import it from work-filters instead, which is why that module
// exists.
export { isWorkFilter, WORK_FILTERS, type WorkFilter };

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
