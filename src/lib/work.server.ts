import { cache } from "react";

import type { Project, Repo } from "@/content/schema";
import {
  buildWorkRows,
  projectList,
  type WorkRow,
} from "@/lib/content";
import { getRepos } from "@/lib/github.server";
import { buildRepoProjects, isRepoEligible, repoProjectSlug } from "@/lib/repo-projects";

/**
 * The merged work layer.
 *
 * `lib/content.ts` owns the curated catalogue and stays free of network code.
 * This module joins that catalogue to the public repository list, so every page
 * that lists work sees the same answer: the curated projects in their editorial
 * order, then one generated record for each repository without a written entry.
 *
 * All of it sits behind `cache`, so the Home page can ask for the projects, the
 * rows, and the repository cards in the same render and the GitHub layer is still
 * contacted once.
 */

const curatedSlugs = projectList.map((project) => project.slug);

/** Curated projects plus repository-derived projects, curated first. */
export const getWorkProjects = cache(async (): Promise<Project[]> => {
  const repos = await getRepos();
  return [...projectList, ...buildRepoProjects(repos, curatedSlugs)];
});

/** The rows for the work index on the Home page. */
export const getWorkRows = cache(async (): Promise<WorkRow[]> => {
  return buildWorkRows(await getWorkProjects());
});

/**
 * The repository cards, with a case-study slug on every repository that has a
 * written or generated one.
 *
 * `getRepos()` is the source of truth for the Open source list; the only change
 * here is that a generated project fills in `projectSlug`, so the card's "Case
 * study" link appears without a manual override.
 */
export const getRepoCards = cache(async (): Promise<Repo[]> => {
  const [repos, projects] = await Promise.all([getRepos(), getWorkProjects()]);
  const generated = new Set(projects.filter((project) => project.generated).map((project) => project.slug));

  return repos.map((repo) => {
    if (repo.projectSlug) return repo;
    if (!isRepoEligible(repo)) return repo;

    const slug = repoProjectSlug(repo.name);
    return generated.has(slug) ? { ...repo, projectSlug: slug } : repo;
  });
});

export async function getWorkProject(slug: string): Promise<Project | undefined> {
  const projects = await getWorkProjects();
  return projects.find((project) => project.slug === slug);
}

export async function getNextWorkProject(slug: string): Promise<Project> {
  const projects = await getWorkProjects();
  const index = projects.findIndex((project) => project.slug === slug);
  const next = index === -1 ? undefined : projects[(index + 1) % projects.length];
  // getWorkProjects always includes the curated catalogue, which is non-empty.
  return next ?? (projects[0] as Project);
}

/** For sitemap and static parameter generation. */
export async function getWorkProjectSlugs(): Promise<string[]> {
  const projects = await getWorkProjects();
  return projects.map((project) => project.slug);
}
