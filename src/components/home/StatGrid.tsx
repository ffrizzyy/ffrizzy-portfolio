import Link from "next/link";

import { CountedPopover } from "@/components/shared/CountedPopover";
import { CountUp } from "@/components/shared/CountUp";
import { IconTile } from "@/components/shared/decor";
import { Icon } from "@/components/shared/Icon";
import { Reveal } from "@/components/shared/Reveal";
import { StatViz } from "@/components/shared/StatViz";
import { resolveStats } from "@/lib/content";
import { getRepos } from "@/lib/github.server";
import { LAYOUT } from "@/lib/constants";
import { cn, formatStat } from "@/lib/utils";

/**
 * Spec 4.2 stat grid. Hairline-divided, no cards, no fills, no shadows.
 *
 * Layout: a 6-column grid where each stat spans two columns, so six fill two
 * rows of three with no leftover gap. Everything collapses to two columns on
 * small screens and one column on the narrowest phones.
 *
 * This stays a Server Component and delegates the two interactive pieces
 * (count-up and the method popover) to client leaves, which is the pattern spec
 * 1.3 asks for. It is async because the repository count comes from the GitHub
 * layer; the fetch is cached for a day and falls back to the committed snapshot.
 */

// Spec 4.2: projects and followers count up. The repository count joins them
// because it is a computed number that moves when the account does. GPA, events,
// and views show immediately and their illustrations carry the motion.
const ANIMATED = new Set(["projects", "repos", "followers"]);

export async function StatGrid() {
  const repos = await getRepos();
  const statsResolved = resolveStats(repos.length);

  return (
    <section id="stats" className={`${LAYOUT.section} border-t border-line`}>
      <div className={LAYOUT.container}>
        <h2 className="sr-only">By the numbers</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6">
          {statsResolved.map((stat, index) => {
            const animates = ANIMATED.has(stat.id);

            return (
              <Reveal
                as="article"
                key={stat.id}
                delay={index * 0.06}
                className={cn(
                  "group flex flex-col justify-between gap-6 border-t border-line py-8 pr-6 md:col-span-2",
                  index === 0 && "border-t-0 sm:border-t",
                )}
              >
                <div className="flex items-start justify-between gap-6">
                  <IconTile className="transition-shadow duration-200 ease-zine group-hover:shadow-hard">
                    <Icon name={stat.icon} size={20} />
                  </IconTile>

                  <div className="transition-transform duration-200 ease-zine group-hover:scale-[1.08]">
                    <StatViz viz={stat.viz} value={stat.value} />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="num flex items-baseline gap-2 text-4xl leading-none text-ink md:text-6xl">
                    <span className="whitespace-nowrap">
                      {animates ? (
                        <CountUp
                          value={stat.value}
                          decimals={stat.decimals ?? 0}
                          suffix={stat.suffix ?? ""}
                          lowerBound={stat.kind === "lower-bound"}
                        />
                      ) : (
                        formatStat(stat.value, {
                          decimals: stat.decimals ?? 0,
                          suffix: stat.suffix ?? "",
                          lowerBound: stat.kind === "lower-bound",
                        })
                      )}
                    </span>
                    {/* The qualifier sits outside the counted number so the
                        digits never wrap away from their unit. */}
                    {stat.qualifier ? (
                      <span className="text-xl text-ink-muted md:text-3xl">{stat.qualifier}</span>
                    ) : null}
                  </p>

                  {/* The label is a link to the section or route that carries
                      the detail. GPA points at /cv now, so it renders as a
                      router link rather than a full page load. */}
                  {stat.href.startsWith("/") ? (
                    <Link
                      href={stat.href}
                      className="touch-target w-fit text-base font-medium text-ink underline decoration-line decoration-2 underline-offset-4 transition-[text-decoration-color,text-decoration-thickness] hover:decoration-signal group-hover:decoration-4 group-hover:decoration-signal"
                    >
                      {stat.label}
                    </Link>
                  ) : (
                    <a
                      href={stat.href}
                      className="touch-target w-fit text-base font-medium text-ink underline decoration-line decoration-2 underline-offset-4 transition-[text-decoration-color,text-decoration-thickness] hover:decoration-signal group-hover:decoration-4 group-hover:decoration-signal"
                    >
                      {stat.label}
                    </a>
                  )}

                  <p className="text-sm text-ink-muted">{stat.detail}</p>

                  <div className="mt-1">
                    <CountedPopover method={stat.method} asOf={stat.asOf} />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
