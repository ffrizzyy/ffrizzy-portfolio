import type { ButtonHTMLAttributes, HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/**
 * Spec 2.7 chips: pill, hairline border, small. A selected chip is filled with
 * signal and labelled with --on-signal.
 *
 * Rendered as a button so the filter bar can be a proper radio group.
 */
type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
};

export function Chip({ selected = false, className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-checked={selected}
      className={cn(
        "inline-flex h-9 select-none items-center rounded-pill border px-4 text-sm font-medium",
        "transition-colors duration-200 ease-zine",
        selected
          ? "border-ink bg-signal text-on-signal"
          : "border-line bg-transparent text-ink-muted hover:border-ink hover:text-ink",
        className,
      )}
      {...props}
    />
  );
}

/** Non-interactive chip, used for stack tags on cards and rows. */
export function TagChip({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill border border-line px-2.5 py-0.5 font-mono text-xs text-ink-muted",
        className,
      )}
      {...props}
    />
  );
}
