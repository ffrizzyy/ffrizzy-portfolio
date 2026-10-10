"use client";

import dynamic from "next/dynamic";

/**
 * Defers the Recharts panel the same way ReportMap defers Leaflet.
 *
 * Why it needs a wrapper at all: `CaseStudyLayout` is a Server Component, and
 * `next/dynamic` with `ssr: false` is only allowed inside a Client Component, so
 * the layout cannot defer the panel itself. Rendering `EvDciPanel` directly put
 * its chunk, about 389 KB uncompressed, in the synchronous chunk list of every
 * work route. Only sdc-2024 declares `interactive: "sdc-ev-dci"`, so the other
 * case studies were paying for charts they never drew.
 *
 * The fallback reserves the panel's footprint with the panel's own geometry
 * rather than a guessed height: the same outer box (`mt-6 flex flex-col gap-8
 * border-2 border-ink bg-paper-raised p-5 md:p-7`), the same header row, the
 * same `max-w-[68ch]` paragraph at `text-sm` carrying the identical string, and
 * the same two chart figures with their real captions and the real `h-[240px]`
 * plot height. The captions are single-line at every breakpoint, so the only
 * differences between reserved and loaded are the plot contents and the
 * trailing line, which is close enough in height not to move the page.
 *
 * The fallback is hidden from assistive tech: it carries no information, and a
 * screen reader should hear the panel once, when the real one arrives.
 */
function EvDciPanelFallback() {
  return (
    <div
      aria-hidden
      className="mt-6 flex flex-col gap-8 border-2 border-ink bg-paper-raised p-5 md:p-7"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-display text-lg font-extrabold tracking-tight">
          South Sumatra in the Digital Competitiveness Index
        </h3>
        <p className="num text-xs uppercase tracking-[0.14em] text-ink-muted">Sample of the index</p>
      </div>

      {/* The same string at the same size and measure as the paragraph it
          stands in for, so it wraps to the same number of lines. */}
      <p className="max-w-[68ch] text-sm">
        The index scores each province on 50 indicators grouped into three sub-indices: input, which
        covers human resources, ICT use, and ICT spending; output, which asks how far digitalisation
        reaches the economy and productivity; and support, which covers infrastructure, finance, and
        local policy. South Sumatra scored 36.4 in 2024, down from 37.6, and fell two places to 22nd.
      </p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {[
          "Rank, 2021 to 2024. Higher on this chart is better.",
          "Score in 2023 against 2024, neighbouring provinces",
        ].map((caption) => (
          <figure key={caption} className="flex flex-col gap-3">
            <figcaption className="num text-xs uppercase tracking-[0.14em] text-ink-muted">
              {caption}
            </figcaption>
            <div className="h-[240px] w-full animate-pulse border border-line bg-paper-sunken" />
          </figure>
        ))}
      </div>

      <p className="text-sm">
        Loading the interactive charts. The figures are also in the table below, and the written
        case study above does not depend on them.
      </p>
    </div>
  );
}

const EvDciPanelInner = dynamic(
  () => import("./EvDciPanel").then((module) => module.EvDciPanel),
  { ssr: false, loading: () => <EvDciPanelFallback /> },
);

export function EvDciPanelDeferred() {
  return <EvDciPanelInner />;
}
