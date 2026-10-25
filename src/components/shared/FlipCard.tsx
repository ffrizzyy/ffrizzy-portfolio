"use client";

import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * A card that turns over. The portrait faces the reader; the summary is on the
 * back.
 *
 * Why a div plus an overlay button rather than a button wrapping the faces: the
 * front is a `<figure>` (the taped photo), and a button may not contain flow
 * content like that. The overlay button is the real control, so the keyboard,
 * Enter and Space, and `aria-pressed` all come from the platform. It carries the
 * accessible name; the faces underneath carry the content.
 *
 * The face that is not showing carries `inert`, which keeps its contents out of
 * the tab order and out of the accessibility tree; the two sides cannot both be
 * read, which is the usual failure of a flip card.
 *
 * The turn is one CSS transform on the card and one `rotateY` on the back face.
 * The reduced-motion block in globals.css collapses the transition, so the swap
 * is instant rather than avoided.
 */
export function FlipCard({
  front,
  back,
  label,
  className,
}: {
  front: ReactNode;
  back: ReactNode;
  /** Accessible name, describing the action rather than the photo. */
  label: string;
  className?: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className={cn("flip-scene", className)}>
      <div className={cn("flip-card", flipped && "is-flipped")}>
        <div className="flip-face" inert={flipped}>
          {front}
        </div>
        <div className="flip-face flip-back" inert={!flipped}>
          {back}
        </div>
      </div>

      <button
        type="button"
        aria-pressed={flipped}
        aria-label={label}
        onClick={() => setFlipped((value) => !value)}
        className="flip-trigger"
      />
    </div>
  );
}
