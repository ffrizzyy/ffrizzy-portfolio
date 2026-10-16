"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

import { Icon, type IconName } from "@/components/shared/Icon";
import { IconTile, SectionHeading } from "@/components/shared/decor";
import { Chip } from "@/components/ui/Chip";
import type { WorkRow } from "@/lib/content";
import type { ProjectType } from "@/content/schema";
import { LAYOUT } from "@/lib/constants";
import { hiddenUntilExpanded, moreLabel } from "@/lib/mobile-collapse";
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
 *
 * Mobile: twelve rows are the tallest thing on the page at 390px, so below md
 * the list shows VISIBLE_ROWS of them and a control reveals the rest. A hidden
 * row is never unmounted, only `display: none`, so the index stays in the
 * document for a crawler, and from md up every row renders exactly as before.
 * Changing the filter resets the reveal, and a filtered list is short enough
 * that it is never shortened at all: a reader who asks for one type sees every
 * row of it.
 */
const TYPE_ICON: Record<ProjectType, IconName> = {
  build: "Code",
  data: "ChartBar",
  research: "Flask",
  design: "PenNib",
  content: "PencilSimpleLine",
};

/**
 * Rows the index shows before the reader opens it, below md only. A row is
 * roughly 120px at 390px, so the other nine are about 1080px, which is more
 * than a screen of scroll on their own.
 */
const VISIBLE_ROWS = 3;

/** The list the reveal control points at. One section, so one fixed id. */
const LIST_ID = "all-list";

/** Binds the collapsed state to the shared responsive hiding rule. */
const disclosureRange = (collapsed: boolean) => ({ visible: VISIBLE_ROWS, collapsed });

/**
 * The responsive flag CSS cannot supply to JavaScript.
 *
 * Hiding is decided entirely in CSS, so this is used for one thing only: whether
 * Motion may animate row layout. It starts false so the server HTML and the
 * hydrated HTML agree, and it uses the same 767.98px boundary the md: prefix
 * compiles to.
 */
function useIsCollapsedBreakpoint() {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767.98px)");
    const sync = () => setMatches(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return matches;
}

export function WorkList({ rows: allRows }: { rows: WorkRow[] }) {
  const [filter, setFilter] = useState<WorkFilter>("all");
  const [expanded, setExpanded] = useState(false);
  const reduceMotion = useReducedMotion();
  const isCollapsedBreakpoint = useIsCollapsedBreakpoint();

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
    // A different filter is a different list, so it opens at the compact
    // length rather than staying open from the previous one.
    setExpanded(false);

    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete("type");
    else url.searchParams.set("type", next);
    window.history.replaceState(null, "", url);
  };

  const rows = useMemo(
    () => (filter === "all" ? allRows : allRows.filter((row) => row.type === filter)),
    [allRows, filter],
  );

  // The reveal is only offered when it would actually reveal something. It is
  // also why a filtered list is never shortened: every filtered view here is
  // short enough to fit, and hiding part of a subset the reader just asked for
  // would be the confusing case.
  const canReveal = rows.length > VISIBLE_ROWS;
  const collapsed = canReveal && !expanded;
  const hiddenCount = Math.max(rows.length - VISIBLE_ROWS, 0);

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

        <ul id={LIST_ID} className="mt-12 border-t border-line">
          <AnimatePresence initial={false}>
            {rows.map((row, index) => (
              <motion.li
                key={row.id}
                /* Projection is off where a row can be display:none: a hidden
                   row measures as nothing, so animating its neighbours would
                   animate from a wrong reading, and there is nothing to slide
                   anyway because every row on this breakpoint is one height. */
                layout={!reduceMotion && !isCollapsedBreakpoint}
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.25 }}
                className={cn(
                  "border-b border-line",
                  hiddenUntilExpanded(index, disclosureRange(collapsed)),
                )}
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

        {/* Mobile only: below md this wrapper is display:flex, and from md up it
            is display:none because every row it would reveal is already visible,
            so the desktop render is the same twelve rows it has always been. The
            control is a pill, which is the one shape the system rounds, drawn as
            a paper tab: ink border, hard offset shadow, mono label. The 4rem
            above it is deliberate, so the control reads as a standfirst for the
            rows it opens rather than as the thirteenth row of the list. */}
        {canReveal ? (
          <div className="flex md:hidden">
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={LIST_ID}
              onClick={() => setExpanded((value) => !value)}
              className={cn(
                "group mt-16 inline-flex min-h-11 items-center gap-3 rounded-pill border-2 border-ink bg-paper px-5 py-2.5",
                "num text-xs uppercase tracking-[0.16em] text-ink shadow-hard",
                "transition-[background-color,transform,box-shadow] duration-200 ease-zine",
                "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-paper-raised hover:shadow-[8px_8px_0_0_var(--shadow-color)]",
                "active:translate-x-0 active:translate-y-0 active:shadow-none",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "grid size-5 shrink-0 place-items-center transition-transform duration-300 ease-zine",
                  expanded && "rotate-45",
                )}
              >
                <Icon name="Plus" size={16} />
              </span>
              {expanded ? "Show fewer" : moreLabel(hiddenCount, "project")}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
