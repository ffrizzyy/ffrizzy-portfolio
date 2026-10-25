"use client";

import { useRef, type CSSProperties, type ElementType, type PointerEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * React Bits' spotlight card, rebuilt for this project.
 *
 * A pointer-following radial wash that lives under the card's text, painted on a
 * pseudo-element so nothing is layered over the copy and nothing re-renders. The
 * pointer position is written straight to the host element as two custom
 * properties (spec 2.8: no `useState` for continuous values), and the only thing
 * the stylesheet animates is the wash's own opacity.
 *
 * The visual treatment is held to a tint. On a zine surface the card's 2px ink
 * border and hard shadow already do the work; this is the light raking across
 * the paper, not a second light source.
 *
 * It also owns the section reveal, which is why `delay` is here: the host is the
 * element the scroll timeline animates, and the card inside keeps its own
 * transform free for the hover lift. Two transforms on one element would fight.
 */
export function Spotlight({
  children,
  className,
  delay,
  as: Tag = "div",
  tint,
}: {
  children: ReactNode;
  className?: string;
  /** Reveal delay in seconds, staircased across a grid. */
  delay?: number;
  as?: ElementType;
  /** Which colour the wash is mixed from. Signal unless the surface is signal. */
  tint?: "signal" | "ink";
}) {
  const hostRef = useRef<HTMLElement | null>(null);

  const setHost = (node: HTMLElement | null) => {
    hostRef.current = node;
  };

  const track = (event: PointerEvent<HTMLElement>) => {
    const host = hostRef.current;
    if (!host || event.pointerType === "touch") return;

    const rect = host.getBoundingClientRect();
    host.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    host.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };

  return (
    <Tag
      ref={setHost}
      onPointerMove={track}
      data-spotlight={tint ?? "signal"}
      className={cn("spotlight-host reveal", className)}
      style={delay ? ({ animationDelay: `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
