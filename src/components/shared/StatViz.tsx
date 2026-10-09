import { siInstagram, siTiktok, siX } from "simple-icons";

import type { ProjectType, Stat } from "@/content/schema";
import { projectTypeBreakdown, eventList, EVENTS_AXIS } from "@/lib/content";

/**
 * The five stat illustrations. Spec 2.13: an illustration must show a real
 * number or a real thing, generated in code from the content modules, so it
 * updates when the data does. Nothing here is hand-drawn decoration.
 *
 * Everything except the brand marks is 2px ink strokes, paper-raised or
 * paper-sunken fills, and at most one signal element per illustration.
 */

const STACK_FILL: Record<ProjectType, string> = {
  build: "var(--signal)",
  data: "var(--ink)",
  research: "var(--ink-muted)",
  design: "var(--line)",
  content: "var(--line)",
};

const STACK_LABEL: Record<ProjectType, string> = {
  build: "Build",
  data: "Data",
  research: "Research",
  design: "Design",
  content: "Content",
};

/** GPA ring gauge, filled to value/total. Spec 4.2 row 1. */
function RingGauge({ value, total }: { value: number; total: number }) {
  const size = 76;
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, value / total));
  const offset = circumference * (1 - progress);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--line)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--signal)"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="ring-draw"
        style={
          {
            "--ring-full": `${circumference}`,
            "--ring-offset": `${offset}`,
          } as React.CSSProperties
        }
      />
    </svg>
  );
}

/** One tick per event on a 2022 to 2026 axis. Spec 4.2 row 2. */
function TickAxis() {
  const years = [EVENTS_AXIS.from, 2023, 2024, 2025, EVENTS_AXIS.to];
  const width = 156;
  const height = 60;
  const pad = 10;
  const first = years[0] ?? EVENTS_AXIS.from;
  const span = (years[years.length - 1] ?? EVENTS_AXIS.to) - first;
  const step = span === 0 ? 0 : (width - pad * 2) / span;
  const x = (year: number) => pad + (year - first) * step;
  const baseline = height - 14;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <line x1={pad} y1={baseline} x2={width - pad} y2={baseline} stroke="var(--ink)" strokeWidth={2} />

      {years.map((year) => (
        <g key={year}>
          <line
            x1={x(year)}
            y1={baseline - 4}
            x2={x(year)}
            y2={baseline + 4}
            stroke="var(--line)"
            strokeWidth={1}
          />
          <text
            x={x(year)}
            y={height - 2}
            textAnchor="middle"
            fontSize="8"
            fill="var(--ink-muted)"
            fontFamily="var(--font-geist-mono), monospace"
          >
            {year}
          </text>
        </g>
      ))}

      {eventList.map((event, index) => (
        <rect
          key={event.id}
          x={x(event.year) - 1.5}
          y={16}
          width={3}
          height={baseline - 20}
          fill="var(--signal)"
          className="tick-grow"
          style={{ animationDelay: `${index * 0.08}s` }}
        >
          <title>{`${event.name} (${event.year})`}</title>
        </rect>
      ))}
    </svg>
  );
}

/** Stacked bar split by project type, computed from the project files. */
function StackBar() {
  const order: ProjectType[] = ["build", "data", "research", "design"];
  const width = 156;
  const height = 22;
  const total = order.reduce((sum, type) => sum + projectTypeBreakdown[type], 0);

  // Precomputed once so the bars and their labels cannot drift apart.
  let cursor = 0;
  const segments = order.map((type) => {
    const count = projectTypeBreakdown[type];
    const size = total === 0 ? 0 : (count / total) * width;
    const start = cursor;
    cursor += size;
    return { type, count, size, start, centre: start + size / 2 };
  });

  return (
    <svg width={width} height={height + 20} viewBox={`0 0 ${width} ${height + 20}`}>
      {segments.map((segment, index) => (
        <rect
          key={segment.type}
          x={segment.start}
          y={0}
          width={Math.max(segment.size - 1.5, 0)}
          height={height}
          fill={STACK_FILL[segment.type]}
          className="stack-grow"
          style={{
            animationDelay: `${index * 0.1}s`,
            transformOrigin: `${segment.start}px center`,
          }}
        >
          <title>{`${STACK_LABEL[segment.type]} ${segment.count}`}</title>
        </rect>
      ))}

      {segments.map((segment) => (
        <text
          key={`label-${segment.type}`}
          x={segment.centre}
          y={height + 14}
          textAnchor="middle"
          fontSize="8"
          fill="var(--ink-muted)"
          fontFamily="var(--font-geist-mono), monospace"
        >
          {segment.count}
        </text>
      ))}
    </svg>
  );
}

/** Platform marks over a row of account dots and a plus. Spec 4.2 row 4. */
function PlatformDots() {
  const accounts = Array.from({ length: 10 }, (_, index) => index);
  const marks = [
    { key: "instagram", path: siInstagram.path, name: "Instagram" },
    { key: "x", path: siX.path, name: "X" },
    { key: "tiktok", path: siTiktok.path, name: "TikTok" },
  ];

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex items-center gap-3">
        {marks.map((mark, index) => (
          <svg
            key={mark.key}
            viewBox="0 0 24 24"
            role="img"
            aria-label={mark.name}
            className="sticker-pop size-5 fill-ink"
            style={{ animationDelay: `${0.15 + index * 0.1}s` }}
          >
            <path d={mark.path} />
          </svg>
        ))}
      </div>
      <div className="flex items-center gap-1" aria-hidden>
        {accounts.map((index) => (
          <span
            key={index}
            className="dot-on size-2.5 rounded-pill border border-ink bg-paper-raised"
            style={{ animationDelay: `${index * 0.06}s` }}
          />
        ))}
        <span className="num ml-1 text-sm text-ink-muted">+</span>
      </div>
    </div>
  );
}

/** Paper-cut phone frame with a play triangle. Spec 4.2 row 5. */
function PhoneFrame() {
  return (
    <svg width={70} height={86} viewBox="0 0 70 86" aria-hidden>
      <rect x={1} y={1} width={68} height={84} fill="var(--paper-sunken)" stroke="var(--ink)" strokeWidth={2} />
      <rect x={7} y={10} width={56} height={60} fill="var(--paper-raised)" stroke="var(--line)" strokeWidth={1} />
      <path d="M28 30 L46 40 L28 50 Z" fill="var(--signal)" className="sticker-pop" />
      <rect x={26} y={75} width={18} height={3} fill="var(--line)" />
    </svg>
  );
}

export function StatViz({ viz, value }: { viz: Stat["viz"]; value: number }) {
  return (
    <div aria-hidden className="flex min-h-[86px] items-center justify-end">
      {viz === "ring" ? <RingGauge value={value} total={4} /> : null}
      {viz === "ticks" ? <TickAxis /> : null}
      {viz === "stack" ? <StackBar /> : null}
      {viz === "platforms" ? <PlatformDots /> : null}
      {viz === "phone" ? <PhoneFrame /> : null}
    </div>
  );
}
