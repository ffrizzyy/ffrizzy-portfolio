"use client";

import dynamic from "next/dynamic";

/**
 * Leaflet touches `window` the moment it loads, so it cannot be server
 * rendered. This wrapper exists because `next/dynamic` with `ssr: false` is only
 * allowed inside a Client Component in the App Router, and the case study layout
 * that renders this is a Server Component.
 *
 * The skeleton matches the map's footprint so the page does not jump when the
 * chunk arrives.
 */
const ReportMapInner = dynamic(() => import("./ReportMapInner").then((m) => m.ReportMapInner), {
  ssr: false,
  loading: () => (
    <div className="mt-6 flex flex-col gap-4 border-2 border-ink bg-paper-raised p-5 md:p-7">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg font-extrabold tracking-tight">Report map</h3>
        <p className="num text-xs uppercase tracking-[0.14em] text-ink-muted">Loading</p>
      </div>
      <div className="h-[420px] w-full animate-pulse border border-line bg-paper-sunken" />
      <p className="text-sm text-ink-muted">
        Loading the interactive map. The written case study above does not depend on it.
      </p>
    </div>
  ),
});

export function ReportMap() {
  return <ReportMapInner />;
}
