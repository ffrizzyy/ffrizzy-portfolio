import { Icon } from "@/components/shared/Icon";
import { SectionHeading } from "@/components/shared/decor";
import { Reveal } from "@/components/shared/Reveal";
import { TrackedLink } from "@/components/shared/TrackedLink";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { LAYOUT, SITE } from "@/lib/constants";
import { repoList } from "@/lib/content";

/**
 * Open source. Every public repository on the GitHub account, in one grid.
 *
 * The list is a content module (content/repos.ts), not a runtime fetch, so the
 * section builds offline and a new repository is a one-line edit. A repository
 * that also has a case study links across to it; one that does not still gets a
 * card, because the promise here is completeness rather than curation.
 *
 * Values arrive by import because this is a Server Component: repoList never
 * reaches the client bundle, and only the card links, which are the shared
 * tracked-link client leaf, cross the boundary.
 */
export function ReposSection() {
  return (
    <section id="repos" className={`${LAYOUT.section} border-t border-line`}>
      <div className={LAYOUT.container}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading>Open source.</SectionHeading>
          <p className="num text-xs uppercase tracking-[0.16em] text-ink-muted">
            {repoList.length} public repositories
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {repoList.map((repo, index) => (
            <Reveal as="li" key={repo.name} delay={index * 0.05} className="flex">
              <article className="flex h-full w-full flex-col border-2 border-ink bg-paper-raised p-5 transition-[transform,box-shadow] duration-200 ease-zine hover:-translate-y-0.5 hover:shadow-hard">
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

                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4 text-xs">
                  {repo.language ? (
                    <span className="num uppercase tracking-[0.14em] text-ink-muted">
                      {repo.language}
                    </span>
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
            </Reveal>
          ))}
        </ul>

        <div className="mt-10">
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
        </div>
      </div>
    </section>
  );
}
