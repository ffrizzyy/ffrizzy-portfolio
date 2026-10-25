import { Icon } from "@/components/shared/Icon";
import { SectionHeading } from "@/components/shared/decor";
import { Spotlight } from "@/components/shared/Spotlight";
import { TrackedLink } from "@/components/shared/TrackedLink";
import { TagChip } from "@/components/ui/Chip";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { LAYOUT, SITE } from "@/lib/constants";
import { getRepos, summarizeRepos } from "@/lib/github.server";
import { cn, formatMonthYear } from "@/lib/utils";

import { RepoOrbit } from "./RepoOrbit";

/**
 * Open source. Every public repository on the GitHub account, in a bento.
 *
 * The list comes from `lib/github.server.ts`, which asks the GitHub API for the
 * account's repositories, applies the curated copy in `content/repos.ts`, and
 * falls back to the committed snapshot when the API is unavailable. That is why
 * the section can say "every repository" and keep saying it after a new push.
 *
 * The layout is a bento rather than a plain grid: two wider cells lead, followed
 * by three equal thirds and a final row of quarters. A repository with a case
 * study links across to it. One without a write-up still gets a card, because
 * the promise here is completeness rather than curation.
 *
 * Values arrive by await because this is a Server Component: the list never
 * reaches the client bundle, and only the card links, which are the shared
 * tracked-link client leaf, cross the boundary.
 */

const CELL_LAYOUT = [
  "md:col-span-7",
  "md:col-span-5",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-3",
  "md:col-span-3",
  "md:col-span-3",
  "md:col-span-3",
] as const;

function cellSpan(index: number) {
  return CELL_LAYOUT[index] ?? "md:col-span-3";
}

export async function ReposSection() {
  const repos = await getRepos();
  const stats = summarizeRepos(repos);
  const languageCount = stats.languages.length;

  return (
    <section id="repos" className={`${LAYOUT.section} border-t border-line`}>
      <div className={LAYOUT.container}>
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading>Open source.</SectionHeading>
              <p className="num text-xs uppercase tracking-[0.16em] text-ink-muted">
                {stats.total} public repositories / {languageCount}{" "}
                {languageCount === 1 ? "language" : "languages"}
              </p>
            </div>

            <p className="mt-4 max-w-[65ch] text-sm text-ink-muted">
              Public repositories from GitHub, newest push first. Each card names the primary language
              and the last push, and links to the case study where one exists.
            </p>
          </div>

          {/* The ring is decoration over a list that is already complete below,
              so it is hidden from assistive tech. It turns once every 64s and
              holds still on hover. */}
          <RepoOrbit repos={repos} className="mx-auto md:mx-0" />
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
          {repos.map((repo, index) => {
            const pushed = formatMonthYear(repo.pushedAt);

            return (
              <Spotlight
                as="li"
                key={repo.name}
                delay={index * 0.05}
                className={cn("flex", cellSpan(index))}
              >
                <article className="spot-card flex h-full w-full flex-col border-2 border-ink bg-paper-raised p-5 transition-[transform,box-shadow] duration-200 ease-zine hover:-translate-y-0.5 hover:shadow-hard">
                  <TrackedLink
                    href={repo.url}
                    event={ANALYTICS_EVENTS.projectOutbound}
                    eventProps={{ target: "github-repo" }}
                    external
                    ariaLabel={`${repo.name} on GitHub`}
                    className="group flex items-start justify-between gap-4"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <Icon name="GithubLogo" size={20} className="shrink-0" />
                      <span className="truncate font-display text-xl font-extrabold tracking-tight text-ink underline decoration-transparent decoration-2 underline-offset-4 transition-colors group-hover:decoration-signal">
                        {repo.name}
                      </span>
                    </span>
                    <Icon name="ArrowUpRight" size={18} className="nudge shrink-0" />
                  </TrackedLink>

                  <p className="mt-3 flex-1 text-sm text-ink-muted">{repo.description}</p>

                  {repo.topics.length > 0 ? (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {repo.topics.slice(0, 3).map((topic) => (
                        <li key={topic}>
                          <TagChip>{topic}</TagChip>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4 text-xs">
                    {repo.language ? (
                      <span className="num uppercase tracking-[0.14em] text-ink-muted">
                        {repo.language}
                      </span>
                    ) : null}

                    {repo.stars > 0 ? (
                      <span className="num text-ink-muted">
                        {repo.stars} {repo.stars === 1 ? "star" : "stars"}
                      </span>
                    ) : null}

                    {repo.forks > 0 ? (
                      <span className="num text-ink-muted">
                        {repo.forks} {repo.forks === 1 ? "fork" : "forks"}
                      </span>
                    ) : null}

                    {pushed ? (
                      <span className="num text-ink-muted">Updated {pushed}</span>
                    ) : null}

                    {repo.homepage ? (
                      <TrackedLink
                        href={repo.homepage}
                        event={ANALYTICS_EVENTS.projectOutbound}
                        eventProps={{ target: "github-repo-live" }}
                        external
                        className="inline-flex items-center gap-1.5 font-medium text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4"
                      >
                        <Icon name="Globe" size={16} />
                        Live
                      </TrackedLink>
                    ) : null}

                    {repo.projectSlug ? (
                      <a
                        href={`/work/${repo.projectSlug}`}
                        className="inline-flex items-center gap-1.5 font-medium text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4"
                      >
                        Case study
                      </a>
                    ) : null}
                  </div>
                </article>
              </Spotlight>
            );
          })}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
          <TrackedLink
            href={SITE.github}
            event={ANALYTICS_EVENTS.projectOutbound}
            eventProps={{ target: "github-profile" }}
            external
            className="touch-target group inline-flex items-center gap-1.5 text-base font-medium text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4"
          >
            All repositories on GitHub
            <Icon name="ArrowUpRight" size={18} className="nudge" />
          </TrackedLink>

          <p className="num text-xs uppercase tracking-[0.14em] text-ink-muted">
            Synced from GitHub / cached daily
            {stats.latestPush ? ` / latest push ${formatMonthYear(stats.latestPush)}` : ""}
          </p>
        </div>
      </div>
    </section>
  );
}
