import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** The cn() + cva pattern from spec 1.1. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a stat value the way spec 4.2 requires: uppercase K and M fixed in
 * place so the glyph never shifts mid count-up.
 */
export function formatStat(
  value: number,
  options: { decimals?: number; suffix?: string; lowerBound?: boolean } = {},
) {
  const { decimals = 0, suffix = "", lowerBound = false } = options;
  const plus = lowerBound ? "+" : "";

  if (suffix === "K" || suffix === "M") {
    return `${(value / (suffix === "K" ? 1_000 : 1_000_000)).toFixed(decimals)}${suffix}${plus}`;
  }

  return `${value.toFixed(decimals)}${suffix}${plus}`;
}

/** Groups thousands for plain counts such as 23,596. */
export function groupNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

/**
 * Formats an ISO timestamp as a month and year, for a repository's last push.
 * Returns an empty string on a missing or malformed value so a card can skip the
 * line rather than print "Invalid Date".
 */
export function formatMonthYear(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(date);
}
