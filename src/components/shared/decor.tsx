import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The zine layer. Spec 2.6 allows texture, tape, stickers, and the marker
 * highlight in exactly four places, and none of them may sit behind or over
 * body text, forms, or the experience timeline.
 */

/** Spec 2.3: emphasis is the marker highlight or bold of the same family. */
export function MarkerHighlight({ children }: { children: ReactNode }) {
  return <span className="marker">{children}</span>;
}

/**
 * A round logo sticker: 2px ink border, rotated up to 8 degrees. Spec 2.6.
 * `spin` is passed as a CSS variable so the pop-in keyframe can preserve the
 * rotation while it scales.
 */
export function Sticker({
  children,
  spin = 0,
  delay = 0,
  className,
  label,
}: {
  children: ReactNode;
  spin?: number;
  delay?: number;
  className?: string;
  label: string;
}) {
  return (
    <span
      aria-label={label}
      role="img"
      className={cn(
        "sticker-pop grid size-14 place-items-center rounded-pill border-2 border-ink bg-paper-raised",
        className,
      )}
      style={
        {
          "--spin": `${spin}deg`,
          transform: `rotate(${spin}deg)`,
          animationDelay: `${delay}s`,
        } as React.CSSProperties
      }
    >
      {children}
    </span>
  );
}

/**
 * A photograph taped to the page: rotated at most 2 degrees, with the hard
 * offset shadow. Spec 2.6 and 4.1.
 */
export function TapedPhoto({
  children,
  rotate = -2,
  className,
  caption,
}: {
  children: ReactNode;
  rotate?: number;
  className?: string;
  caption?: string;
}) {
  return (
    <figure className={cn("relative", className)}>
      <div
        className="relative border-2 border-ink bg-paper-raised p-2 shadow-hard"
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        <span aria-hidden className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[-2deg]" />
        {children}
      </div>
      {caption ? (
        <figcaption className="mt-4 text-sm text-ink-muted">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

/** A 40px square icon tile: 2px ink border, radius 0. Spec 2.13. */
export function IconTile({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-10 shrink-0 place-items-center border-2 border-ink bg-paper-raised text-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Section heading. Spec 2.10 caps headlines at 8 words and budget the eyebrow
 * labels at 2 for the whole Home page, so the eyebrow is opt-in.
 */
export function SectionHeading({
  id,
  eyebrow,
  children,
  className,
  as: Tag = "h2",
}: {
  id?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {eyebrow ? (
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">{eyebrow}</p>
      ) : null}
      <Tag id={id} className="text-3xl md:text-5xl">
        {children}
      </Tag>
    </div>
  );
}

/** A single hairline rule. Spec 2.5: group with spacing or one border-t. */
export function Hairline({ className, ...props }: HTMLAttributes<HTMLHRElement>) {
  return <hr className={cn("border-0 border-t border-line", className)} {...props} />;
}
