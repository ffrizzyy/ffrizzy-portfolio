"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useState } from "react";

import { Icon } from "@/components/shared/Icon";
import { cn } from "@/lib/utils";

/**
 * Spec 2.7 carousel: one slide at a time inside a hairline-bordered
 * --paper-raised box at radius 0. A mono counter, wrapping 44px square
 * prev/next buttons, and progress dots where the active one stretches to 56px
 * in signal. Arrow keys switch slides while a dot or an arrow has focus. No
 * autoplay, which is also a spec 2.8 ban.
 *
 * Spec 4.5 adds touch swipe, which is the one thing here CSS cannot do, so it
 * is the only reason Motion is imported. It is switched off entirely under
 * prefers-reduced-motion.
 *
 * Slides arrive as already-rendered nodes so this can stay a client leaf while
 * the slide content itself is rendered on the server.
 */
export function Carousel({
  slides,
  labels,
  ariaLabel,
  className,
}: {
  slides: ReactNode[];
  labels: string[];
  ariaLabel: string;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const count = slides.length;

  const go = (next: number) => setIndex(((next % count) + count) % count);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
    }
  };

  const pad = (value: number) => String(value).padStart(2, "0");

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className={cn("border border-line bg-paper-raised", className)}
    >
      {/* Keyed on index so the slide-in animation replays on every change, and
          carries aria-live so the new slide is announced. */}
      <motion.div
        key={index}
        aria-live="polite"
        className="slide-panel"
        drag={reduceMotion ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        dragMomentum={false}
        onDragEnd={(_event, info) => {
          if (reduceMotion) return;
          if (info.offset.x < -60 || info.velocity.x < -400) go(index + 1);
          else if (info.offset.x > 60 || info.velocity.x > 400) go(index - 1);
        }}
      >
        <div
          role="group"
          aria-roledescription="slide"
          aria-label={labels[index] ?? `Slide ${index + 1}`}
        >
          {slides[index]}
        </div>
      </motion.div>

      <div className="flex items-center justify-between gap-4 border-t border-line p-4">
        <p className="num text-sm text-ink-muted">
          {pad(index + 1)} / {pad(count)}
        </p>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            {slides.map((_, dotIndex) => (
              <button
                key={dotIndex}
                type="button"
                aria-label={`Go to slide ${dotIndex + 1}: ${labels[dotIndex] ?? ""}`}
                aria-current={dotIndex === index}
                onClick={() => setIndex(dotIndex)}
                className={cn(
                  "h-1.5 rounded-pill transition-[width,background-color] duration-200 ease-zine",
                  dotIndex === index ? "w-14 bg-signal" : "w-9 bg-line hover:bg-ink-muted",
                )}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous slide"
              className="grid size-11 place-items-center border-2 border-ink text-ink transition-colors hover:bg-signal hover:text-on-signal active:scale-[0.94]"
            >
              <Icon name="CaretLeft" size={18} />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next slide"
              className="grid size-11 place-items-center border-2 border-ink text-ink transition-colors hover:bg-signal hover:text-on-signal active:scale-[0.94]"
            >
              <Icon name="CaretRight" size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
