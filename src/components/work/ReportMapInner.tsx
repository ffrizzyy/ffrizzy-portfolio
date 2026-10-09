"use client";

import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";

import { cn } from "@/lib/utils";

/**
 * The KITO report map, running on sample data.
 *
 * Two deliberate choices:
 *
 * 1. It uses CircleMarker rather than Leaflet's default Marker. The default
 *    marker pulls in PNG icon assets whose URLs break under a bundler, which is
 *    the usual reason a Leaflet map renders as an empty grey box in Next.js.
 *    A circle needs no assets.
 * 2. The points are invented, and the interface says so in three places, because
 *    spec 5.1 requires mock data to be labelled rather than passed off as real
 *    reports.
 *
 * Colours come from the design tokens, so the map follows the theme switch.
 */

const CATEGORIES = ["Infrastructure", "Sanitation", "Traffic", "Public Service"] as const;
type Category = (typeof CATEGORIES)[number];

const CATEGORY_FILL: Record<Category, string> = {
  Infrastructure: "var(--signal)",
  Sanitation: "var(--ink)",
  Traffic: "var(--ink-muted)",
  "Public Service": "var(--paper-sunken)",
};

type SampleReport = {
  code: string;
  category: Category;
  status: "New" | "In review" | "Resolved";
  area: string;
  position: [number, number];
};

/** Invented points around Palembang, shaped like the real report schema. */
const SAMPLE_REPORTS: SampleReport[] = [
  { code: "PLM-0001", category: "Traffic", status: "New", area: "Pasar 16 Ilir", position: [-2.988, 104.768] },
  { code: "PLM-0002", category: "Infrastructure", status: "Resolved", area: "Jalan Merdeka", position: [-2.9885, 104.756] },
  { code: "PLM-0003", category: "Sanitation", status: "In review", area: "Kambang Iwak", position: [-2.977, 104.742] },
  { code: "PLM-0004", category: "Public Service", status: "In review", area: "Ilir Barat", position: [-2.98, 104.735] },
  { code: "PLM-0005", category: "Infrastructure", status: "Resolved", area: "Jakabaring", position: [-3.015, 104.79] },
  { code: "PLM-0006", category: "Sanitation", status: "New", area: "Bukit Besar", position: [-2.97, 104.73] },
  { code: "PLM-0007", category: "Traffic", status: "In review", area: "Sekip", position: [-2.965, 104.755] },
  { code: "PLM-0008", category: "Public Service", status: "Resolved", area: "Plaju", position: [-3.005, 104.82] },
  { code: "PLM-0009", category: "Infrastructure", status: "New", area: "Talang Semut", position: [-2.995, 104.745] },
  { code: "PLM-0010", category: "Sanitation", status: "In review", area: "Gandus", position: [-3.01, 104.7] },
];

const TILE_URL =
  process.env.NEXT_PUBLIC_MAP_TILE_URL ?? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  process.env.NEXT_PUBLIC_MAP_ATTRIBUTION ?? "&copy; OpenStreetMap contributors";

export function ReportMapInner() {
  const [active, setActive] = useState<Category | "All">("All");

  const visible = active === "All" ? SAMPLE_REPORTS : SAMPLE_REPORTS.filter((r) => r.category === active);

  return (
    <div className="mt-6 flex flex-col gap-4 border-2 border-ink bg-paper-raised p-5 md:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-display text-lg font-extrabold tracking-tight">Report map</h3>
        <p className="num text-xs uppercase tracking-[0.14em] text-ink-muted">Sample data</p>
      </div>

      <p className="max-w-[68ch] text-sm text-ink-muted">
        Ten invented reports, shaped like the real ones, to show how the portal plots a complaint and
        lets a resident filter by category. Nothing here is a real report and no live API is
        connected, so the pins do not reflect any actual situation on the ground.
      </p>

      <div role="group" aria-label="Filter sample reports by category" className="flex flex-wrap gap-2">
        {(["All", ...CATEGORIES] as const).map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActive(category)}
            aria-pressed={active === category}
            className={cn(
              "rounded-pill border px-3.5 py-1.5 text-sm transition-colors duration-200 ease-zine",
              active === category
                ? "border-ink bg-signal text-on-signal"
                : "border-line text-ink-muted hover:border-ink hover:text-ink",
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="h-[420px] w-full border border-line">
        <MapContainer
          center={[-2.988, 104.756]}
          zoom={12}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
          {visible.map((report) => (
            <CircleMarker
              key={report.code}
              center={report.position}
              radius={9}
              pathOptions={{
                color: "var(--ink)",
                weight: 2,
                fillColor: CATEGORY_FILL[report.category],
                fillOpacity: 1,
              }}
            >
              <Popup>
                <span className="num text-xs">{report.code}</span>
                <br />
                <strong>{report.category}</strong>
                <br />
                {report.area}
                <br />
                Status: {report.status}
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Spec 2.11: the map needs a text equivalent, since a canvas of pins is
          not readable by assistive tech. */}
      <details className="border-t border-line pt-4">
        <summary className="cursor-pointer text-sm font-medium text-ink underline decoration-signal decoration-2 underline-offset-4">
          List the {visible.length} sample reports
        </summary>
        <ul className="mt-4 flex flex-col gap-2">
          {visible.map((report) => (
            <li key={report.code} className="flex flex-wrap items-baseline gap-x-3 text-sm">
              <span className="num text-xs text-ink-muted">{report.code}</span>
              <span className="text-ink">{report.area}</span>
              <span className="text-ink-muted">{report.category}</span>
              <span className="num text-xs text-ink-muted">{report.status}</span>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
