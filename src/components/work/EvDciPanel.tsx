"use client";

import { useReducedMotion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * The Sriwijaya Digital Conference charts, drawn from the figures in the
 * conference deck rather than invented ones.
 *
 * Rank is inverted on the trend chart on purpose: rank 1 is the best result, so
 * plotting the raw number on a normal axis would make an improvement look like a
 * fall. The axis is reversed and labelled so the line reading upward means the
 * province climbing.
 *
 * Spec 2.11 requires a text equivalent for a chart, so both are followed by a
 * data table behind a disclosure, and a short summary sits above them.
 */

const RANK_TREND = [
  { year: "2021", rank: 21 },
  { year: "2022", rank: 23 },
  { year: "2023", rank: 19 },
  { year: "2024", rank: 22 },
];

/** The neighbouring provinces the index placed around South Sumatra in 2024. */
const PEERS = [
  { province: "Gorontalo", rank: 20, score2023: 35.1, score2024: 38.1, change: 10 },
  { province: "Southeast Sulawesi", rank: 21, score2023: 35.2, score2024: 37.8, change: 8 },
  { province: "South Sumatera", rank: 22, score2023: 37.6, score2024: 36.4, change: -2 },
  { province: "Aceh", rank: 23, score2023: 37.4, score2024: 36.3, change: -1 },
  { province: "Maluku", rank: 24, score2023: 38.1, score2024: 36.1, change: -6 },
  { province: "West Nusa Tenggara", rank: 25, score2023: 37.1, score2024: 35.5, change: -1 },
  { province: "Central Kalimantan", rank: 26, score2023: 35.5, score2024: 35.5, change: 2 },
];

const HIGHLIGHT = "South Sumatera";

const axisTick = {
  fill: "var(--ink-muted)",
  fontSize: 12,
  fontFamily: "var(--font-geist-mono)",
};

const tooltipStyle = {
  backgroundColor: "var(--paper-raised)",
  border: "2px solid var(--ink)",
  borderRadius: 0,
  fontFamily: "var(--font-geist-mono)",
  fontSize: 12,
  color: "var(--ink)",
};

export function EvDciPanel() {
  /**
   * Recharts animates its marks with requestAnimationFrame and does not consult
   * prefers-reduced-motion on its own, so every chart here has to opt out
   * explicitly. Without this the draw-in animation runs for a reader who asked
   * for no motion, which is a spec 2.8 violation and not a small one: the bars
   * and the line are the substance of the chart, so it is exactly the motion
   * that carries meaning.
   */
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;

  return (
    <div className="mt-6 flex flex-col gap-8 border-2 border-ink bg-paper-raised p-5 md:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-display text-lg font-extrabold tracking-tight">
          South Sumatra in the Digital Competitiveness Index
        </h3>
        <p className="num text-xs uppercase tracking-[0.14em] text-ink-muted">Sample of the index</p>
      </div>

      <p className="max-w-[68ch] text-sm text-ink-muted">
        The index scores each province on 50 indicators grouped into three sub-indices: input, which
        covers human resources, ICT use, and ICT spending; output, which asks how far digitalisation
        reaches the economy and productivity; and support, which covers infrastructure, finance, and
        local policy. South Sumatra scored 36.4 in 2024, down from 37.6, and fell two places to 22nd.
      </p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <figure className="flex flex-col gap-3">
          <figcaption className="num text-xs uppercase tracking-[0.14em] text-ink-muted">
            Rank, 2021 to 2024. Higher on this chart is better.
          </figcaption>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={RANK_TREND} margin={{ top: 12, right: 18, bottom: 4, left: -18 }}>
                <CartesianGrid stroke="var(--line)" strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="year" tick={axisTick} axisLine={{ stroke: "var(--ink)" }} tickLine={false} />
                <YAxis
                  reversed
                  domain={[18, 24]}
                  ticks={[19, 21, 23]}
                  tick={axisTick}
                  axisLine={false}
                  tickLine={false}
                  width={44}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [`rank ${String(value)}`, "South Sumatra"]}
                />
                <Line
                  type="monotone"
                  dataKey="rank"
                  stroke="var(--signal)"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "var(--signal)", stroke: "var(--signal)" }}
                  activeDot={{ r: 6 }}
                  isAnimationActive={animate}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </figure>

        <figure className="flex flex-col gap-3">
          <figcaption className="num text-xs uppercase tracking-[0.14em] text-ink-muted">
            Score in 2023 against 2024, neighbouring provinces
          </figcaption>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PEERS} margin={{ top: 12, right: 8, bottom: 34, left: -18 }}>
                <CartesianGrid stroke="var(--line)" strokeDasharray="2 4" vertical={false} />
                <XAxis
                  dataKey="province"
                  tick={{ ...axisTick, fontSize: 10 }}
                  axisLine={{ stroke: "var(--ink)" }}
                  tickLine={false}
                  interval={0}
                  angle={-28}
                  textAnchor="end"
                  height={56}
                />
                <YAxis domain={[32, 40]} tick={axisTick} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--paper-sunken)" }} />
                <Legend
                  wrapperStyle={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 11,
                    color: "var(--ink-muted)",
                  }}
                />
                <Bar dataKey="score2023" name="2023" fill="var(--line)" isAnimationActive={animate} />
                <Bar dataKey="score2024" name="2024" isAnimationActive={animate}>
                  {PEERS.map((row) => (
                    <Cell
                      key={row.province}
                      fill={row.province === HIGHLIGHT ? "var(--signal)" : "var(--ink)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </figure>
      </div>

      {/* Spec 2.11: a chart needs a text equivalent, not only a picture. */}
      <details className="border-t border-line pt-4">
        <summary className="cursor-pointer text-sm font-medium text-ink underline decoration-signal decoration-2 underline-offset-4">
          View the data
        </summary>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">
              South Sumatra rank from 2021 to 2024, and 2023 against 2024 scores for neighbouring
              provinces
            </caption>
            <thead>
              <tr className="border-b-2 border-ink">
                <th scope="col" className="py-2 pr-4 font-mono text-xs uppercase tracking-[0.14em]">
                  Province
                </th>
                <th scope="col" className="py-2 pr-4 font-mono text-xs uppercase tracking-[0.14em]">
                  Rank 2024
                </th>
                <th scope="col" className="py-2 pr-4 font-mono text-xs uppercase tracking-[0.14em]">
                  Score 2023
                </th>
                <th scope="col" className="py-2 pr-4 font-mono text-xs uppercase tracking-[0.14em]">
                  Score 2024
                </th>
                <th scope="col" className="py-2 font-mono text-xs uppercase tracking-[0.14em]">
                  Places moved
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-line">
                <td className="py-2 pr-4 text-ink">South Sumatra, 2021</td>
                <td className="py-2 pr-4 num">21</td>
                <td className="py-2 pr-4 num">-</td>
                <td className="py-2 pr-4 num">-</td>
                <td className="py-2 num">-</td>
              </tr>
              <tr className="border-b border-line">
                <td className="py-2 pr-4 text-ink">South Sumatra, 2022</td>
                <td className="py-2 pr-4 num">23</td>
                <td className="py-2 pr-4 num">-</td>
                <td className="py-2 pr-4 num">-</td>
                <td className="py-2 num">-</td>
              </tr>
              <tr className="border-b border-line">
                <td className="py-2 pr-4 text-ink">South Sumatra, 2023</td>
                <td className="py-2 pr-4 num">19</td>
                <td className="py-2 pr-4 num">-</td>
                <td className="py-2 pr-4 num">-</td>
                <td className="py-2 num">-</td>
              </tr>
              {PEERS.map((row) => (
                <tr key={row.province} className="border-b border-line">
                  <td className="py-2 pr-4 text-ink">
                    {row.province}
                    {row.province === HIGHLIGHT ? " (2024)" : ""}
                  </td>
                  <td className="py-2 pr-4 num">{row.rank}</td>
                  <td className="py-2 pr-4 num">{row.score2023.toFixed(1)}</td>
                  <td className="py-2 pr-4 num">{row.score2024.toFixed(1)}</td>
                  <td className="py-2 num">
                    {row.change > 0 ? `+${row.change}` : row.change}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
