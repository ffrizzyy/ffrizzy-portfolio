import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Section reveal. Spec 2.8: CSS first. The `.reveal` class uses a scroll-driven
 * `animation-timeline: view()` where the browser supports it, and a plain
 * on-load animation otherwise. The reduced-motion fallback lives in the one
 * global block in globals.css, so nothing here needs to branch on it.
 *
 * A small `delay` staggers siblings (the hero uses 0.12s steps).
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
}) {
  return (
    <Tag
      className={cn("reveal", className)}
      style={delay ? ({ animationDelay: `${delay}s` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
