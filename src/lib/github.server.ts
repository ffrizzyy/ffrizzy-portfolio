import { cache } from "react";
import { z } from "zod";

import { applyRepoOverrides, repoFallback } from "@/content/repos";
import { repoSchema, type Repo } from "@/content/schema";
import { SITE } from "@/lib/constants";

/**
 * The live GitHub layer.
 *
 * The site used to treat `content/repos.ts` as the whole list, which meant a new
 * repository stayed invisible until somebody edited a file. This module asks the
 * GitHub API for every public repository on the account, merges the curated copy
 * from `content/repos.ts` over the answer, and keeps the committed snapshot as
 * the fallback.
 *
 * Why a fallback rather than a hard failure: the GitHub API is unauthenticated
 * by default and limited to 60 requests an hour per address, and a build or a
 * cold request must not turn a rate limit into an empty section. With no token,
 * no network, or a non-200 answer, the snapshot renders instead. Set
 * `GITHUB_TOKEN` to raise the limit to 5,000 an hour.
 *
 * Cache policy: `revalidate: 86400`, the optional metadata pull the build spec
 * already described. The tag is exported so a future webhook can revalidate it
 * without a redeploy.
 */
export const GITHUB_REPOS_TAG = "github-repos";

/** The account named by the site's own GitHub link, so the two cannot drift. */
const GITHUB_USERNAME =
  process.env.GITHUB_USERNAME?.trim() ||
  SITE.github.replace(/^https?:\/\/github\.com\//i, "").replace(/\/+$/, "");

const githubRepoSchema = z.object({
  name: z.string(),
  html_url: z.string().url(),
  description: z.string().nullable(),
  language: z.string().nullable(),
  homepage: z.string().nullable(),
  stargazers_count: z.number(),
  forks_count: z.number(),
  open_issues_count: z.number(),
  topics: z.array(z.string()).default([]),
  archived: z.boolean(),
  fork: z.boolean(),
  created_at: z.string(),
  pushed_at: z.string(),
  license: z
    .object({
      spdx_id: z.string().nullable(),
    })
    .nullable()
    .optional(),
});

type GitHubRepo = z.infer<typeof githubRepoSchema>;

/**
 * GitHub descriptions are plain prose, not site copy: they carry trailing
 * periods, HTML entities, and occasionally an em-dash. The source check in
 * scripts/check-copy.mjs scans this file, so normalise before it can fail.
 */
function cleanDescription(value: string | null): string {
  if (!value) return "A public repository on GitHub";

  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/[\u2014\u2013]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\.$/, "");
}

function cleanUrl(value: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : undefined;
}

function toRepo(item: GitHubRepo): Repo {
  return applyRepoOverrides({
    name: item.name,
    description: cleanDescription(item.description),
    url: item.html_url,
    language: item.language ?? undefined,
    homepage: cleanUrl(item.homepage),
    stars: item.stargazers_count,
    forks: item.forks_count,
    openIssues: item.open_issues_count,
    topics: item.topics,
    pushedAt: item.pushed_at,
    createdAt: item.created_at,
    archived: item.archived,
    fork: item.fork,
    license: item.license?.spdx_id ?? undefined,
  });
}

function byLatestPush(a: Repo, b: Repo): number {
  return (b.pushedAt ?? "").localeCompare(a.pushedAt ?? "");
}

async function fetchGitHubRepos(): Promise<Repo[]> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "ffrizzy-portfolio",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(GITHUB_USERNAME)}/repos?per_page=100&sort=updated`,
      {
        headers,
        next: { revalidate: 86400, tags: [GITHUB_REPOS_TAG] },
      },
    );

    if (!response.ok) {
      console.warn(
        `[github] API answered ${response.status}; using the committed repository snapshot.`,
      );
      return [];
    }

    const payload = await response.json();
    return z.array(githubRepoSchema).parse(payload).map(toRepo);
  } catch (error) {
    console.warn(
      `[github] Could not read the public repository list; using the committed snapshot. ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return [];
  }
}

/**
 * A curated repository that GitHub did not return is kept rather than dropped,
 * because a case study may still link to it. A new repository that exists only
 * on GitHub is added by the fetch, which is the point of the layer.
 */
function mergeWithFallback(live: Repo[]): Repo[] {
  if (live.length === 0) return [...repoFallback].sort(byLatestPush);

  const seen = new Set(live.map((repo) => repo.name));
  const curatedMissing = repoFallback.filter((repo) => !seen.has(repo.name));
  return [...live, ...curatedMissing].sort(byLatestPush);
}

/**
 * Every public repository, newest push first.
 *
 * `cache` dedupes the call inside one render: the Home page and the CV page can
 * both ask for the list and the API is contacted once. The `fetch` cache is what
 * holds the answer across requests for a day.
 */
export const getRepos = cache(async (): Promise<Repo[]> => {
  const live = await fetchGitHubRepos();
  return z.array(repoSchema).parse(mergeWithFallback(live));
});

export type RepoLanguage = {
  name: string;
  count: number;
};

export type RepoStats = {
  total: number;
  languages: RepoLanguage[];
  stars: number;
  forks: number;
  openIssues: number;
  latestPush?: string;
  newest?: Repo;
};

/** Aggregates the repository list for the Open source header and the stat grid. */
export function summarizeRepos(repos: Repo[]): RepoStats {
  const languageCounts = new Map<string, number>();

  for (const repo of repos) {
    if (!repo.language) continue;
    languageCounts.set(repo.language, (languageCounts.get(repo.language) ?? 0) + 1);
  }

  const languages = [...languageCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  const latestPush = repos
    .map((repo) => repo.pushedAt)
    .filter((value): value is string => Boolean(value))
    .sort((a, b) => b.localeCompare(a))[0];

  return {
    total: repos.length,
    languages,
    stars: repos.reduce((sum, repo) => sum + repo.stars, 0),
    forks: repos.reduce((sum, repo) => sum + repo.forks, 0),
    openIssues: repos.reduce((sum, repo) => sum + repo.openIssues, 0),
    latestPush,
    newest: repos[0],
  };
}
