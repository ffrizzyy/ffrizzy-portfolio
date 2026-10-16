/**
 * The mobile progressive disclosure shared by the two long Home sections, the
 * #all index and the #about timeline.
 *
 * The whole feature is mobile only, and both rules below are plain Tailwind
 * utilities rather than a new class in globals.css:
 *
 * - The control lives in a `flex md:hidden` wrapper, so it is drawn only below
 *   md and from md up nothing is drawn and no state is reachable, which is what
 *   keeps the desktop render byte for byte what it was.
 * - A row past the visible count renders `max-md:hidden`, so below md it is
 *   hidden by CSS and from md up it is an ordinary list row. Nothing is
 *   unmounted: the rows stay in the DOM, keep their place in the document, and
 *   `display: none` already takes them out of the accessibility tree and the
 *   tab order for a keyboard user on a phone.
 *
 * `max-md:` is Tailwind v4's built-in max-width variant. It compiles to the
 * same 767.98px boundary the `md:` prefix uses, which is the boundary
 * globals.css already documents for its mobile-only block, so the two can
 * never disagree about what "mobile" means.
 */

/** What a caller needs to know to render one row: hide it, or leave it. */
export type DisclosureRange = {
  /** Past this index the row is a candidate for hiding. */
  visible: number;
  /** False once the reader has asked for the whole list. */
  collapsed: boolean;
};

/** Tailwind utility for a row the collapsed state is hiding below md. */
export function hiddenUntilExpanded(index: number, range: DisclosureRange): string {
  return range.collapsed && index >= range.visible ? "max-md:hidden" : "";
}

/** Rounds a count into a disclosure label, singular and plural. */
export function moreLabel(hidden: number, noun: string): string {
  return `Show ${hidden} more ${noun}${hidden === 1 ? "" : "s"}`;
}
