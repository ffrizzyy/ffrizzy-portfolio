"use client";

import { useState } from "react";

import { Icon } from "@/components/shared/Icon";
import { moreLabel } from "@/lib/mobile-collapse";
import { cn } from "@/lib/utils";

/**
 * The rail's ids. The first list keeps the id the reveal control points at,
 * because that is the list the control acts on; the opened entries get their own
 * id so the page never carries two elements claiming the same one.
 */
const TIMELINE_ID = "about-timeline";
const TIMELINE_REST_ID = "about-timeline-rest";

/**
 * The #about experience rail: a client leaf that owns the mobile reveal state
 * and nothing else.
 *
 * It is deliberately not the whole AboutSection. That section is a Server
 * Component, and it stays one, so the timeline data is not pulled into the
 * client bundle. The entries arrive here already rendered, which is the same
 * pattern WorkList uses for its rows and the Carousel uses for its slides: one
 * small client boundary, no data crossing it.
 *
 * One entry is an icon, a role, an organisation and location, a period, and a
 * first bullet line, so eight of them are the second tallest thing on the page
 * at 390px. Below md `visibleCount` entries render and the control reveals the
 * rest. Nothing is unmounted: a hidden entry sits in the document behind
 * `display: none`, so it is still there for a crawler. From md up, every class
 * that differs between the breakpoints resolves to the visible case, so the
 * desktop render is the same eight entries the section has always had.
 *
 * The rail is split into two lists rather than one list with a hidden tail
 * because the rail itself is an absolutely positioned child of the list: in a
 * single list it would be drawn down the full height, past the last visible
 * entry, over blank page. The two lists carry the same border, padding, and
 * gap, and the wrapper continues that gap between them, so above md the pair
 * reads as the one continuous rail it was before.
 */
export function ExperienceTimeline({
  entries,
  visibleCount,
}: {
  /** Pre-rendered entries, in the order they should read. */
  entries: React.ReactNode[];
  /** Entries shown below md before the reveal is used. */
  visibleCount: number;
}) {
  const [expanded, setExpanded] = useState(false);

  const hiddenCount = Math.max(entries.length - visibleCount, 0);
  const canReveal = hiddenCount > 0;
  const collapsed = canReveal && !expanded;

  return (
    <>
      {/* `md:gap-8` continues the rail's own 2rem gap between the two lists, so
          above md the pair reads as the single continuous rail this section has
          always had. Below md the second list is display:none while the reveal
          is closed, so the collapsed rail ends cleanly under its last entry. */}
      <div className="flex flex-col md:gap-8">
        <ol
          id={TIMELINE_ID}
          className="relative flex flex-col gap-8 border-l-2 border-line pl-6"
        >
          {/* The signal line fills as the reader scrolls. */}
          <span
            aria-hidden
            className="rail-progress absolute -left-0.5 top-0 h-full w-0.5 bg-signal"
          />

          {entries.slice(0, visibleCount)}
        </ol>

        {canReveal ? (
          <ol
            id={TIMELINE_REST_ID}
            className={cn(
              "relative flex flex-col gap-8 border-l-2 border-line pl-6",
              collapsed && "max-md:hidden",
            )}
          >
            {entries.slice(visibleCount)}
          </ol>
        ) : null}
      </div>

      {/* Mobile only. Below md this wrapper is display:flex; from md up it is
          display:none, and every entry it would reveal is already in the rail
          above. The control is a pill, the one rounded shape in the system,
          drawn as a paper tab: ink border, hard offset shadow, mono label. */}
      {canReveal ? (
        <div className="mt-4 flex md:hidden">
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={TIMELINE_ID}
            onClick={() => setExpanded((value) => !value)}
            className={cn(
              "group inline-flex min-h-11 items-center gap-3 rounded-pill border-2 border-ink bg-paper px-5 py-2.5",
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
            {expanded ? "Show fewer" : moreLabel(hiddenCount, "role")}
          </button>
        </div>
      ) : null}
    </>
  );
}
