import { z } from "zod";

/**
 * Content schemas. Spec 5.5: records are typed modules validated by Zod, so an
 * invalid record fails `pnpm build` with a field-level error instead of
 * rendering an empty box.
 */

export const PROJECT_TYPES = ["build", "data", "research", "design", "content"] as const;

export const projectTypeSchema = z.enum(PROJECT_TYPES);
export type ProjectType = z.infer<typeof projectTypeSchema>;

export const linkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

export const caseStudySchema = z.object({
  /** 2 to 3 sentences. Spec 5.1 step 2. */
  summary: z.string().optional(),
  problem: z.string().optional(),
  approach: z.string().optional(),
  outcome: z.string().optional(),
  limitations: z.string().optional(),
  /** Extra detail blocks, rendered as a definition-style list. */
  bullets: z.array(z.object({ label: z.string(), text: z.string() })).optional(),
  /**
   * Names the interactive piece this case study renders. The components are
   * client leaves loaded lazily, so the heavy libraries reach only the case
   * study that needs them and never the Home page.
   */
  interactive: z.enum(["kito-report-map", "sdc-ev-dci"]).optional(),
});

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  type: projectTypeSchema,
  featured: z.boolean(),
  role: z.string().min(1),
  period: z.string().min(1),
  /** One line, real numbers only, 25 words or fewer. Spec 10.2. */
  outcome: z.string().min(1),
  /** Chips. Only the first 3 are shown on cards. */
  stack: z.array(z.string()).min(1),
  /** Skills. Drives the "Used in" lists in the skills map. Spec 4.4. */
  tags: z.array(z.string()),
  links: z.array(linkSchema),
  cover: z.string().startsWith("/"),
  caseStudy: caseStudySchema.optional(),
});

export type Project = z.infer<typeof projectSchema>;

/** Spec 4.2. */
export const statSchema = z.object({
  id: z.enum(["gpa", "events", "projects", "followers", "views"]),
  /** Ignored for computed stats, which derive their value from other content. */
  value: z.number(),
  computedFrom: z.enum(["events", "projects"]).optional(),
  kind: z.enum(["exact", "lower-bound"]),
  decimals: z.number().int().min(0).max(2).optional(),
  /** A magnitude suffix, kept tight against the number: "K", "M". */
  suffix: z.string().optional(),
  /**
   * A trailing qualifier rendered smaller and muted, such as the "/ 4.00" that
   * belongs to a GPA. Separate from `suffix` so it can be styled down instead of
   * being glued to the digits, which made "3.97 / 4.00" wrap onto two lines.
   */
  qualifier: z.string().optional(),
  label: z.string(),
  detail: z.string(),
  method: z.string(),
  asOf: z.string(),
  icon: z.enum(["GraduationCap", "CalendarCheck", "Stack", "UserPlus", "Eye"]),
  viz: z.enum(["ring", "ticks", "stack", "platforms", "phone"]),
  href: z.string().startsWith("#"),
});

export type Stat = z.infer<typeof statSchema>;

export const timelineEntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  org: z.string(),
  /** City, or "Remote", straight from the CV header for each role. */
  location: z.string().optional(),
  kind: z.enum(["work", "leadership", "award"]),
  start: z.string().regex(/^\d{4}-\d{2}$/),
  end: z.union([z.string().regex(/^\d{4}-\d{2}$/), z.literal("present")]),
  display: z.string(),
  summary: z.string().optional(),
  /** CV bullet points, verbatim in substance. */
  bullets: z.array(z.string()).default([]),
});

export type TimelineEntry = z.infer<typeof timelineEntrySchema>;

export const eventSchema = z.object({
  id: z.string(),
  name: z.string(),
  year: z.number().int(),
  role: z.enum(["organizer", "coverage"]),
});

export type PortfolioEvent = z.infer<typeof eventSchema>;

export const awardSchema = z.object({
  id: z.string(),
  title: z.string(),
  org: z.string(),
  year: z.number().int(),
});

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string(),
  /** A one-line qualifier, such as the GPA. Optional: not every school states one. */
  detail: z.string().optional(),
  display: z.string(),
  location: z.string().optional(),
  bullets: z.array(z.string()).default([]),
});

export const certIssuerSchema = z.object({
  issuer: z.string(),
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      year: z.number().int(),
      /** Month and year, as the certificate states it. */
      date: z.string().optional(),
      credentialUrl: z.string().optional(),
    }),
  ),
});

/**
 * The CV's own skill taxonomy, used on the CV page. Distinct from the Home
 * skills map, which is built around which projects a skill appears in.
 */
export const skillCategorySchema = z.object({
  id: z.string(),
  label: z.string(),
  items: z.array(z.string()),
});

export const growthSlideSchema = z.object({
  id: z.string(),
  org: z.string(),
  role: z.string(),
  peak: z.number(),
  peakLabel: z.string(),
  start: z.number(),
  startLabel: z.string(),
  subLine: z.string(),
  sentence: z.string(),
  posts: z.number().int(),
});

export const writingItemSchema = z.object({
  id: z.string(),
  platform: z.enum(["linkedin", "instagram"]),
  title: z.string(),
  description: z.string(),
  /** Absent means the slide renders without an outbound link. Spec 4.8. */
  url: z.string().url().optional(),
  date: z.string().optional(),
  cover: z.string().startsWith("/"),
  language: z.enum(["id", "en"]).optional(),
  featured: z.boolean().optional(),
});

/**
 * A public GitHub repository. Spec 5.5 pattern: the strip of repositories is a
 * typed content module rather than a runtime fetch, so the section renders with
 * no network request and its copy is reviewable in a diff. GitHub metadata
 * fetching stays optional and unwired, as the README records.
 */
export const repoSchema = z.object({
  /** Repository name, as GitHub spells it. */
  name: z.string().min(1),
  /** One sentence, no trailing period. */
  description: z.string().min(1),
  /** The repository URL. */
  url: z.string().url(),
  /** Primary language GitHub reports, shown as a mono label. */
  language: z.string().optional(),
  /** A separate live deployment, when there is one. */
  homepage: z.string().url().optional(),
  /** Slug of a matching case study on this site, when one exists. */
  projectSlug: z.string().optional(),
});

export const skillSchema = z.object({
  id: z.string(),
  name: z.string(),
  /** Rendered inside the Deep accordion. */
  blurb: z.string(),
});

export const toolSchema = z.object({
  /** Slug in simple-icons. A slug missing from the set is dropped. Spec 1.1. */
  slug: z.string(),
  name: z.string(),
});

/* Inferred types for every schema above. */
export type Award = z.infer<typeof awardSchema>;
export type Education = z.infer<typeof educationSchema>;
export type CertIssuer = z.infer<typeof certIssuerSchema>;
export type CertItem = z.infer<typeof certIssuerSchema>["items"][number];
export type Repo = z.infer<typeof repoSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type SkillCategory = z.infer<typeof skillCategorySchema>;
export type Tool = z.infer<typeof toolSchema>;
export type WritingItem = z.infer<typeof writingItemSchema>;
export type GrowthSlide = z.infer<typeof growthSlideSchema>;
export type CaseStudy = z.infer<typeof caseStudySchema>;
export type ProjectLink = z.infer<typeof linkSchema>;
