"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/** The set a split-flap drum has: capitals only, which is what the boards use. */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * When each tile stops cycling, in frames. Tiles settle left to right one frame
 * apart, which is what makes the board read as a wave rather than a single
 * flash. A name of thirty characters lands in a little over a second.
 */
const settleAt = (index: number) => 6 + index;

/**
 * A split-flap board for a short line of text.
 *
 * Every character is a tile with a seam across the middle. On mount the tiles
 * cycle through glyphs and settle left to right, so the name arrives the way a
 * departure board resolves. The animation runs once and stops; there is no loop.
 *
 * The accessible text is the caller's. This renders `aria-hidden`, and the
 * heading that wraps it carries the real name in its `aria-label`, so a screen
 * reader hears the name once rather than thirty letters.
 *
 * The first render is the settled text, which is also what a visitor without
 * JavaScript sees. Under reduced motion the effect never starts.
 */
export function SplitFlap({ text, className }: { text: string; className?: string }) {
  const [tick, setTick] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Each tile settles one frame after the one before it, at 30ms a frame.
    const last = settleAt(text.length - 1);
    let frame = 0;

    const timer = window.setInterval(() => {
      frame += 1;
      if (frame > last) {
        window.clearInterval(timer);
        setTick(null);
        return;
      }
      setTick(frame);
    }, 30);

    return () => window.clearInterval(timer);
  }, [text]);

  const words = text.split(" ");

  return (
    <span className={cn("split-flap", className)} aria-hidden>
      {words.map((word, wordIndex) => {
        const origin = words
          .slice(0, wordIndex)
          .reduce((total, previous) => total + previous.length, 0);

        return (
          <span key={`${word}-${wordIndex}`} className="split-flap-word">
            {word.split("").map((character, characterIndex) => {
              const index = origin + characterIndex;
              const settled = tick === null || tick >= settleAt(index);
              const glyph = settled
                ? character
                : GLYPHS[(index * 7 + tick * 11) % GLYPHS.length];

              return (
                <span key={characterIndex} className="split-flap-tile">
                  {glyph}
                </span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}
