/**
 * The filter vocabulary for the section 4.7 list.
 *
 * Deliberately its own module with no project data in it. WorkList is a Client
 * Component, and importing these from `content/projects` pulled the entire
 * project catalogue, case study prose and all, into the client bundle for every
 * visitor on every page.
 */
export const WORK_FILTERS = ["all", "build", "data", "research", "design", "content"] as const;

export type WorkFilter = (typeof WORK_FILTERS)[number];

export const FILTER_LABELS: Record<WorkFilter, string> = {
  all: "All",
  build: "Build",
  data: "Data",
  research: "Research",
  design: "Design",
  content: "Content",
};

export function isWorkFilter(value: string): value is WorkFilter {
  return (WORK_FILTERS as readonly string[]).includes(value);
}
