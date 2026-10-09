"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

import { Icon, type IconName } from "@/components/shared/Icon";
import { IconTile, SectionHeading } from "@/components/shared/decor";
import { Chip } from "@/components/ui/Chip";
import type { WorkRow } from "@/lib/content";
import type { ProjectType } from "@/content/schema";
import { LAYOUT } from "@/lib/constants";
import { FILTER_LABELS, isWorkFilter, WORK_FILTERS, type WorkFilter } from "@/lib/work-filters";
import { cn } from "@/lib/utils";

/**
 * Spec 4.7 everything I have built.
 *
 * Redesigned from a plain three-column list into an index: each row now carries
 * its position, a type icon, the outcome, and the type and period together, with
 * a hover state that lifts the row, fills the icon tile with signal, and slides
 * an arrow in. The point is that twelve rows of text gave a reader nothing to
 * scan; the icons and the counts give the eye something to travel along.
 *
 * The icon set is the one spec 2.13 already assigns to work types, so this uses
 * the design system rather than adding to it.
 *
 * Rows arrive as a prop from the Server Component rather than being imported.
 * Importing them from the content layer dragged every project and its case study
 * prose into the client bundle, so each visitor downloaded all eleven write-ups
 * to render a list of titles. Only the filter vocabulary and the WorkRow type are
 * imported, and the type is erased at build time.
 *
 * Filter state lives in the URL as ?type=research so a view is shareable. It is
 * written with history.replaceState rather than the Next router, which keeps this
 * component out of a useSearchParams Suspense boundary.
 */
const TYPE_ICON: Record<ProjectType, IconName> = {
  build: "Code",
  data: "ChartBar",
  research: "Flask",
  design: "PenNib",
  content: "PencilSimpleLine",
};

export function WorkList({ rows: allRows }: { rows: WorkRow[] }) {
  const [filter, setFilter] = useState<WorkFilter>("all");
  const reduceMotion = useReducedMotion();

  // Read the deep link on mount so /?type=research works on first load.
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("type");
    if (value && isWorkFilter(value)) setFilter(value);
  }, []);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: allRows.length };
    for (const row of allRows) map[row.type] = (map[row.type] ?? 0) + 1;
    return map;
  }, [allRows]);

  const typeCount = useMemo(
    () => new Set(allRows.map((row) => row.type)).size,
    [allRows],
  );

  const select = (next: WorkFilter) => {
    setFilter(next);

    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete("type");
    else url.searchParams.set("type", next);
    window.history.replaceState(null, "", url);
  };

  const rows = useMemo(
    () => (filter === "all" ? allRows : allRows.filter((row) => row.type === filter)),
    [allRows, filter],
  );

  return (
    <section id="all" className={`${LAYOUT.section} border-t border-line`}>
      <div className={LAYOUT.container}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading>Everything I have built.</SectionHeading>
          <p className="num text-xs uppercase tracking-[0.16em] text-ink-muted">
            {allRows.length} projects / {typeCount} types
          </p>
        </div>

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
              aria-label={`${FILTER_LABELS[value]}, ${counts[value] ?? 0} projects`}
              onClick={() => select(value)}
            >
              {FILTER_LABELS[value]}
              <span
                className={cn(
                  "num ml-2 text-[0.7rem]",
                  filter === value ? "text-on-signal" : "text-ink-muted",
                )}
              >
                {counts[value] ?? 0}
              </span>
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
            {rows.map((row, index) => (
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
                  className={cn(
                    "group grid items-center gap-x-4 gap-y-3 px-3 py-5 md:gap-x-6",
                    "grid-cols-[2rem_2.5rem_1fr] md:grid-cols-[2.5rem_2.5rem_1fr_10rem_1.5rem]",
                    "transition-[background-color,transform] duration-200 ease-zine",
                    "hover:translate-x-1 hover:bg-paper-raised",
                  )}
                >
                  <span className="num text-xs text-ink-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <IconTile className="size-9 transition-colors duration-200 ease-zine group-hover:bg-signal group-hover:text-on-signal">
                    <Icon name={TYPE_ICON[row.type]} size={18} />
                  </IconTile>

                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="text-base font-medium text-ink underline decoration-transparent decoration-2 underline-offset-4 transition-colors duration-200 ease-zine group-hover:decoration-signal">
                      {row.title}
                    </span>
                    <span className="text-sm text-ink-muted">{row.outcome}</span>
                  </span>

                  <span className="col-start-3 flex flex-wrap items-center gap-3 md:col-start-auto md:justify-end">
                    <span className="num text-[0.7rem] uppercase tracking-[0.14em] text-ink-muted">
                      {FILTER_LABELS[row.type]}
                    </span>
                    {row.period ? (
                      <span className="num text-[0.7rem] text-ink-muted/70">{row.period}</span>
                    ) : null}
                  </span>

                  <span
                    aria-hidden
                    className="hidden justify-self-end text-ink opacity-0 transition-[opacity,transform] duration-200 ease-zine group-hover:opacity-100 md:block md:-translate-x-2 md:group-hover:translate-x-0"
                  >
                    <Icon name="CaretRight" size={18} />
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
