import { Icon } from "@/components/shared/Icon";
import { Reveal } from "@/components/shared/Reveal";
import { TagChip } from "@/components/ui/Chip";
import { projects } from "@/content/projects";
import { kitoBotStatus, kitoFlow, kitoSafeguards, kitoStack, kitoStats } from "@/content/site";
import { LAYOUT } from "@/lib/constants";
import { cn, groupNumber } from "@/lib/utils";

/**
 * Spec 4.6 KITO case study section. Two stats, a four-box flow diagram joined
 * by connectors that grow from the left, the safeguards list, and an honest
 * status line for a bot that is not currently running.
 *
 * Ownership is stated plainly: the public portal is the part that was built
 * here; the bot, agent, and dashboard are team work.
 */
export function KitoSection() {
  // Read the article link off the project record rather than writing the URL out
  // a second time, so the case study and this section can never disagree.
  const article = projects
    .find((project) => project.slug === "portal-publik")
    ?.links.find((link) => link.label === "LinkedIn article");

  return (
    <section id="kito" className={`${LAYOUT.section} border-t border-line`}>
      <div className={LAYOUT.container}>
        <Reveal className="max-w-3xl">
          <h2 className="text-3xl md:text-5xl">KITO: report once, track everything.</h2>
          <p className="mt-4 text-base text-ink-muted">
            Case study. My part: the public portal. The Telegram bot, AI agent, and officer
            dashboard are team work.
          </p>
        </Reveal>

        {/* Two mono stats. */}
        <Reveal delay={0.1} className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {kitoStats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-2 border-t-2 border-ink pt-5">
              <p className="num text-4xl leading-none text-ink md:text-5xl">
                {groupNumber(stat.value)}
                {"suffix" in stat && stat.suffix ? stat.suffix : ""}
              </p>
              <p className="text-sm text-ink-muted">{stat.label}</p>
            </div>
          ))}
        </Reveal>

        {/* Flow diagram: four boxes joined by connectors that grow from left. */}
        <Reveal delay={0.16} className="mt-14">
          <ol className="flex flex-col gap-4 md:flex-row md:items-stretch md:gap-0">
            {kitoFlow.map((step, index) => (
              <li key={step.id} className="flex flex-col md:flex-1 md:flex-row md:items-center">
                <div
                  className={cn(
                    "flex h-full flex-col gap-2 border-2 border-ink p-5",
                    step.owned ? "bg-signal text-on-signal shadow-hard" : "bg-paper-raised text-ink",
                  )}
                >
                  <p className="font-display text-lg font-extrabold tracking-tight">{step.title}</p>
                  <p className={cn("text-sm", step.owned ? "text-on-signal" : "text-ink-muted")}>
                    {step.text}
                  </p>
                  {step.owned ? (
                    <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.14em]">
                      My part
                    </p>
                  ) : null}
                </div>

                {/* Connector. Hidden on mobile, where the boxes stack. */}
                {index < kitoFlow.length - 1 ? (
                  <span
                    aria-hidden
                    className="mx-5 hidden h-0.5 w-5 shrink-0 origin-left bg-ink animate-[bar-grow-x_600ms_var(--ease-out-zine)_both] md:block"
                    style={{ animationDelay: `${0.3 + index * 0.12}s` }}
                  />
                ) : null}
              </li>
            ))}
          </ol>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-2">
          <Reveal className="flex flex-col gap-4">
            <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
              Safeguards
            </h3>
            <ul className="flex flex-col gap-3">
              {kitoSafeguards.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-ink-muted">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 bg-signal" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">Stack</h3>
              <ul className="flex flex-wrap gap-2">
                {kitoStack.map((item) => (
                  <li key={item}>
                    <TagChip>{item}</TagChip>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <p className="num text-xs text-ink-muted">
                Telegram bot {kitoBotStatus.handle}: {kitoBotStatus.status}.
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="/work/portal-publik"
                  className="group inline-flex w-fit items-center gap-1.5 text-base font-medium text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4"
                >
                  Read the full case study
                  <Icon name="ArrowUpRight" size={18} className="nudge" />
                </a>
                {article ? (
                  <a
                    href={article.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex w-fit items-center gap-1.5 text-base font-medium text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4"
                  >
                    Read the article
                    <Icon name="ArrowUpRight" size={18} className="nudge" />
                  </a>
                ) : null}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
