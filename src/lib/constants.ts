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

export const LAYOUT = {
  /** Spec 2.4: max-w-7xl mx-auto px-4 md:px-8 */
  container: "mx-auto w-full max-w-7xl px-4 md:px-8",
  /** Spec 2.4: py-20 md:py-24 */
  section: "py-20 md:py-24",
  /** Floating glass bar: 56px tall sitting 12px below the top edge. */
  navHeight: 56,
  navOffset: 12,
  /** Total vertical space the fixed nav claims, used to pad page content. */
  navTotal: 68,
  anchorOffset: 96,
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
  email: "m.farrel2222@gmail.com",
  linkedin: "https://www.linkedin.com/in/ffrizzy/",
  github: "https://github.com/ffrizzyy",
  cvPath: "/Farrel-Frizzy-CV.pdf",
  cvRoute: "/cv",
  copyright: "2026 Muhammad Farrel Al-Wafi Frizzy",
} as const;
