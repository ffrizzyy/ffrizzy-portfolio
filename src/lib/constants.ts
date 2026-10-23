/**
 * Z-index scale and layout constants.
 *
 * Spec 2.12 requires the z-index scale to be documented here rather than
 * scattered as magic numbers.
 */

export const Z = {
  texture: -10,
  content: 0,
  nav: 40,
  sheet: 50,
  dialog: 60,
  toast: 70,
} as const;

/**
 * The site's public origin, normalised.
 *
 * A host dashboard will happily hand over "https://example.com/" with a trailing
 * slash. Concatenating that with a path produced "https://example.com//work/djournl"
 * in the sitemap and in robots.txt, and a doubled slash is a different URL to a
 * crawler, so the canonical URL it was told to index was not the one being served.
 * Trimming here means the value can be pasted either way.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

export const LAYOUT = {
  /** Spec 2.4: max-w-7xl mx-auto px-4 md:px-8 */
  container: "mx-auto w-full max-w-7xl px-4 md:px-8",
  /** Spec 2.4: py-20 md:py-24 */
  section: "py-20 md:py-24",
  /** Floating glass bar: 56px tall sitting 20px below the top edge. */
  navHeight: 56,
  navOffset: 20,
  /** Total vertical space the fixed nav claims, used to pad page content. */
  navTotal: 76,
  /**
   * The mobile section bar: a fixed bar pinned to the bottom edge below md.
   * Only the bar itself. The iPhone home-indicator inset is added on top of
   * this at the point of use, because env() is a CSS value.
   */
  mobileNavHeight: 64,
  anchorOffset: 104,
  /** Spec 2.3: 65ch measure for body copy. */
  measure: "max-w-[65ch]",
} as const;

/**
 * Spec 3: one line of anchors, then the theme switch. It grew from five to
 * seven as the Open source and Skills sections were added, and the About
 * section has since come off Home: the same list feeds the desktop bar, the
 * mobile section bar, and the phone menu sheet, so an entry that moves moves
 * everywhere.
 *
 * The order is the order the sections appear down the page, so the active mark
 * travels left to right as a reader scrolls rather than jumping back. That is
 * why Skills and Content lead, and Work sits third: the skills map and the
 * content carousel both sit above the #all index on the page even though Work
 * reads first everywhere else. The Work link still points at #all, the
 * filterable list, which is the deliberate asymmetry spec 3 records; only its
 * position in the bar is set by the page, not by the label's rank.
 *
 * About is the one entry that is a route rather than an anchor: the About
 * section was removed from Home, so the label now opens /cv, which carries the
 * experience, education, skills, awards, and languages that section used to
 * show. It sits last, and last is where it belongs: it points away from the
 * page the other entries scroll within, so it reads as a destination rather
 * than as another stop on the scroll. A route href is the leading `/`; the
 * bars branch on `isRouteHref` rather than guessing.
 */
export const NAV_LINKS = [
  { label: "Skills", href: "#skills" },
  { label: "Content", href: "#content" },
  { label: "Work", href: "#all" },
  { label: "Repos", href: "#repos" },
  { label: "Writing", href: "#writing" },
  { label: "Contact", href: "#contact" },
  { label: "About", href: "/cv" },
] as const;

/** True when a nav entry points at a route rather than a `#section` anchor. */
export function isRouteHref(href: string): boolean {
  return href.startsWith("/");
}

export const SITE = {
  name: "Muhammad Farrel Al-Wafi Frizzy",
  shortName: "ffrizzy",
  wordmark: "ffrizzy",
  role: "Information Systems graduate",
  /**
   * From the CV header. The phone number is kept out of the markup on purpose,
   * but note that publishing the CV PDF below does publish it, because the
   * document itself carries it in its header.
   */
  location: "Jakarta, Indonesia",
  email: "m.farrel2222@gmail.com",
  linkedin: "https://www.linkedin.com/in/ffrizzy/",
  github: "https://github.com/ffrizzyy",
  /** The deployed site, as the CV header lists it. */
  website: "https://ffrizzy.vercel.app",
  /** The English CV. Offered first, and the one the hero button leads to. */
  cvPath: "/Farrel-Frizzy-CV.pdf",
  /** The same CV in Bahasa Indonesia. */
  cvPathId: "/Farrel-Frizzy-CV-ID.pdf",
  cvRoute: "/cv",
  copyright: "2026 Muhammad Farrel Al-Wafi Frizzy",
} as const;
