import type { Project, Repo } from "@/content/schema";
import { formatMonthYear } from "@/lib/utils";

/**
 * Repository-derived work records.
 *
 * The site already reads every public repository from GitHub, but a repository
 * without a hand-written entry in `content/projects.ts` used to stop at the Open
 * source card. This module turns that remainder into a full `Project`, so a new
 * repository reaches the work index, the project count, the CV, and a case study
 * route on its own.
 *
 * The generated record is deliberately modest. GitHub knows the description,
 * language, topics, dates, and counts; it does not know why the thing was built
 * or what was learned. So the case study states what the metadata supports and
 * says plainly that the deeper sections arrive when somebody writes them. The
 * generated route is replaced the moment a curated record or a `projectSlug`
 * override names the same repository.
 *
 * Nothing here performs I/O. The caller supplies the repository list that
 * `lib/github.server.ts` already fetched and cached.
 */

/** A repository name as a route slug: lower case, hyphens, no edges. */
export function repoProjectSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** "ayo-sudoku" becomes "Ayo Sudoku"; short acronyms keep their case. */
function titleFromRepoName(name: string): string {
  return name
    .replace(/[._-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const isAcronym = word === word.toUpperCase() && word.length <= 4 && /[A-Z]/.test(word);
      return isAcronym ? word : word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function unique(values: (string | undefined)[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const trimmed = value?.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(trimmed);
  }

  return result;
}

/**
 * A fork is somebody else's work with a new remote, and this page attributes
 * what it lists. Forked repositories stay in the Open source card list, where
 * GitHub reports them as forks, but they do not become case studies.
 */
export function isRepoEligible(repo: Repo): boolean {
  return !repo.fork && repoProjectSlug(repo.name).length > 0;
}

/**
 * Builds the fallback `Project` for one repository. It is a complete record, so
 * the work index, the CV, and the case study template all render it without a
 * special case; `generated` is the one flag the page uses to say where the copy
 * came from.
 */
export function repoToProject(repo: Repo): Project {
  const created = formatMonthYear(repo.createdAt);
  const pushed = formatMonthYear(repo.pushedAt);
  const topics = repo.topics.slice(0, 6);
  const stack = unique([repo.language, ...topics]).slice(0, 6);

  if (stack.length === 0) stack.push("Code");

  const activity = [created ? `created ${created}` : "", pushed ? `last push ${pushed}` : ""]
    .filter(Boolean)
    .join(", ");

  const links: Project["links"] = [{ label: "GitHub", href: repo.url }];
  if (repo.homepage) links.push({ label: "Live", href: repo.homepage });

  return {
    slug: repoProjectSlug(repo.name),
    title: titleFromRepoName(repo.name),
    type: "build",
    featured: false,
    generated: true,
    role: "Public repository on GitHub",
    period: created || pushed || "Public on GitHub",
    outcome: repo.description,
    stack,
    tags: [],
    links,
    caseStudy: {
      summary: `${repo.description}. This write-up is generated from the repository metadata on GitHub, and a hand-written case study replaces it once one exists.`,
      approach: `The repository is primarily ${repo.language ?? "unlabelled by language"}${
        topics.length > 0 ? `, with topics for ${topics.join(", ")}` : ""
      }. GitHub reports ${repo.stars} stars, ${repo.forks} forks, and ${repo.openIssues} open issues.`,
      outcome: activity ? `Public on GitHub, ${activity}.` : "Public on GitHub.",
      limitations:
        "This page is generated from the repository metadata, so it describes what the repository is and how it is maintained rather than a written problem statement or a set of design decisions. Add a curated record in content/projects.ts, or a projectSlug override in content/repos.ts, to replace it.",
      bullets: [
        { label: "Stack", text: stack.join(", ") },
        ...(topics.length > 0 ? [{ label: "Topics", text: topics.join(", ") }] : []),
        {
          label: "Repository",
          text: `${repo.archived ? "Archived" : "Active"} on GitHub${
            repo.license ? `, licensed ${repo.license}` : ""
          }.`,
        },
      ],
    },
  };
}

/**
 * The generated projects, in the order the caller supplies the repositories
 * (newest push first). `existingSlugs` is the set already claimed by curated
 * projects, so a repository that points at a written case study is skipped
 * rather than duplicated.
 */
export function buildRepoProjects(
  repos: Repo[],
  existingSlugs: Iterable<string>,
): Project[] {
  const taken = new Set(existingSlugs);
  const generated: Project[] = [];

  for (const repo of repos) {
    // The override is the editorial layer saying this repository already has a
    // case study. The build validates that the slug exists in content.ts.
    if (repo.projectSlug) continue;
    if (!isRepoEligible(repo)) continue;

    const slug = repoProjectSlug(repo.name);
    if (taken.has(slug)) continue;

    taken.add(slug);
    generated.push(repoToProject(repo));
  }

  return generated;
}
