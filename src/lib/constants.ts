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

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

/**
 * The site's public origin, normalised.
 *
 * A host dashboard will happily hand over "https://example.com/" with a trailing
 * slash. Concatenating that with a path produced "https://example.com//work/azzifa"
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
  anchorOffset: 104,
  /** Spec 2.3: 65ch measure for body copy. */
  measure: "max-w-[65ch]",
} as const;

/** Spec 3: nav is one line with five anchors, then the theme switch. */
export const NAV_LINKS = [
  { label: "Work", href: "#all" },
  { label: "Content", href: "#content" },
  { label: "Writing", href: "#writing" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

/** Spec 3: the ten Home sections in order. Anchors are stable once published. */
export const HOME_SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "stats", label: "Stat grid" },
  { id: "work", label: "Selected work" },
  { id: "skills", label: "Skills map" },
  { id: "content", label: "Content growth" },
  { id: "kito", label: "KITO case study" },
  { id: "all", label: "Everything I have built" },
  { id: "writing", label: "Writing" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

/** Spec 2.7: one label per intent across the whole site. */
export const CTA = {
  viewWork: "View work",
  downloadCv: "Download CV",
  contact: "Contact",
  send: "Send",
} as const;

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
  /** The English CV. Offered first, and the one the hero button leads to. */
  cvPath: "/Farrel-Frizzy-CV.pdf",
  /** The same CV in Bahasa Indonesia. */
  cvPathId: "/Farrel-Frizzy-CV-ID.pdf",
  cvRoute: "/cv",
  copyright: "2026 Muhammad Farrel Al-Wafi Frizzy",
} as const;
