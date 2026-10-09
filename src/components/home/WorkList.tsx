"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { SectionHeading } from "@/components/shared/decor";
import { Chip } from "@/components/ui/Chip";
import { WORK_FILTERS, type WorkFilter } from "@/content/projects";
import { filterWorkRows, isWorkFilter } from "@/lib/content";
import { LAYOUT } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Spec 4.7 everything I have built. Filter chips as a radio group, eleven
 * hairline-divided rows, and an empty state with a working reset.
 *
 * Filter state lives in the URL as ?type=research so a view is shareable. It is
 * written with history.replaceState rather than the Next router, which keeps
 * this component out of a useSearchParams Suspense boundary and avoids a
 * static-render bailout for a filter that never needs a server round trip.
 *
 * Row reordering uses Motion layout plus AnimatePresence, which spec 2.8 asks
 * for, and collapses to an instant swap under prefers-reduced-motion.
 */
const FILTER_LABELS: Record<WorkFilter, string> = {
  all: "All",
  build: "Build",
  data: "Data",
  research: "Research",
  design: "Design",
  content: "Content",
};

export function WorkList() {
  const [filter, setFilter] = useState<WorkFilter>("all");
  const reduceMotion = useReducedMotion();

  // Read the deep link on mount so /?type=research works on first load.
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("type");
    if (value && isWorkFilter(value)) setFilter(value);
  }, []);

  const select = (next: WorkFilter) => {
    setFilter(next);

    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete("type");
    else url.searchParams.set("type", next);
    window.history.replaceState(null, "", url);
  };

  const rows = filterWorkRows(filter);

  return (
    <section id="all" className={`${LAYOUT.section} border-t border-line`}>
      <div className={LAYOUT.container}>
        <SectionHeading>Everything I have built.</SectionHeading>

        <div
          role="radiogroup"
          aria-label="Filter projects by type"
          className="mt-10 flex flex-wrap gap-2.5"
        >
          {WORK_FILTERS.map((value) => (
            <Chip
              key={value}
              role="radio"
              selected={filter === value}
              aria-label={FILTER_LABELS[value]}
              onClick={() => select(value)}
            >
              {FILTER_LABELS[value]}
            </Chip>
          ))}
        </div>

        {rows.length === 0 ? (
          <div className="mt-12 flex flex-col items-start gap-4 border-t border-line pt-10">
            {/* Spec 2.13: the empty state is a paper-cut folder shape. */}
            <svg width="64" height="52" viewBox="0 0 64 52" aria-hidden>
              <path
                d="M2 8 h22 l6 6 h32 v34 H2 Z"
                fill="var(--paper-sunken)"
                stroke="var(--ink)"
                strokeWidth="2"
              />
              <line x1="2" y1="22" x2="62" y2="22" stroke="var(--ink)" strokeWidth="2" />
              <rect x="16" y="30" width="20" height="3" fill="var(--signal)" />
            </svg>
            <p className="text-base text-ink-muted">No projects here yet.</p>
            <button
              type="button"
              onClick={() => select("all")}
              className="text-base font-medium text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4"
            >
              Reset filters
            </button>
          </div>
        ) : null}

        <ul className="mt-12 border-t border-line">
          <AnimatePresence initial={false}>
            {rows.map((row) => (
              <motion.li
                key={row.id}
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.25 }}
                className="border-b border-line"
              >
                <a
                  href={row.href}
                  className="group grid grid-cols-1 gap-2 py-5 transition-transform duration-200 ease-zine hover:translate-x-3 md:grid-cols-[230px_1fr_90px] md:items-baseline md:gap-6"
                >
                  <span className="text-base font-medium text-ink">{row.title}</span>
                  <span className="text-sm text-ink-muted">{row.outcome}</span>
                  <span
                    className={cn(
                      "num text-xs uppercase tracking-[0.14em] text-ink-muted",
                      "md:text-right",
                    )}
                  >
                    {FILTER_LABELS[row.type]}
                  </span>
                </a>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </section>
  );
}
