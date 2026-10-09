import { CountedPopover } from "@/components/shared/CountedPopover";
import { CountUp } from "@/components/shared/CountUp";
import { IconTile } from "@/components/shared/decor";
import { Icon } from "@/components/shared/Icon";
import { StatViz } from "@/components/shared/StatViz";
import { statsResolved } from "@/lib/content";
import { LAYOUT } from "@/lib/constants";
import { cn, formatStat } from "@/lib/utils";

/**
 * Spec 4.2 stat grid. Hairline-divided, no cards, no fills, no shadows.
 *
 * Layout: a 6-column grid where row 1 holds three stats and row 2 holds two, so
 * the five fill both rows with no leftover gap. Everything collapses to one
 * column on small phones.
 *
 * This stays a Server Component and delegates the two interactive pieces
 * (count-up and the method popover) to client leaves, which is the pattern spec
 * 1.3 asks for.
 */

// Spec 4.2: only projects and followers count up. GPA, events, and views show
// immediately and their illustrations carry the motion.
const ANIMATED = new Set(["projects", "followers"]);

export function StatGrid() {
  return (
    <section id="stats" className={`${LAYOUT.section} border-t border-line`}>
      <div className={LAYOUT.container}>
        <h2 className="sr-only">By the numbers</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6">
          {statsResolved.map((stat, index) => {
            const isWide = index >= 3;
            const animates = ANIMATED.has(stat.id);

            return (
              <article
                key={stat.id}
                className={cn(
                  "group flex flex-col justify-between gap-6 border-t border-line py-8 pr-6",
                  isWide ? "sm:col-span-2 md:col-span-3" : "md:col-span-2",
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

                  <a
                    href={stat.href}
                    className="w-fit text-base font-medium text-ink underline decoration-line decoration-2 underline-offset-4 transition-[text-decoration-color,text-decoration-thickness] hover:decoration-signal group-hover:decoration-4 group-hover:decoration-signal"
                  >
                    {stat.label}
                  </a>

                  <p className="text-sm text-ink-muted">{stat.detail}</p>

                  <div className="mt-1">
                    <CountedPopover method={stat.method} asOf={stat.asOf} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
