# Farrel Frizzy Portfolio: Build Spec

**Version 2, build-ready.** Supersedes `portfolio-design-spec (3).md`.

| Field | Value |
|---|---|
| Working name | **Paper Zine, Cleaned Up** |
| Owner | Muhammad Farrel Al-Wafi Frizzy (ffrizzy) |
| Target stack | Next.js + TypeScript + Tailwind v4 + Motion |
| Document status | Approved design, dependencies verified against the live registry |
| Dash rule | This document and every visible site string use no em-dash and no en-dash. Ranges use a hyphen (`1993-2020`). |

### What changed in version 2

1. **Versions corrected to what actually exists.** Version 1 cited Next.js 16.3.5 and several unpinned packages. Every version in section 1.1 was queried from the npm registry and is real.
2. **Section 2.14 added: token to Tailwind wiring.** Version 1 defined CSS variables and Tailwind utilities in the same document but never connected them. That gap is the single most likely cause of a "the theme switch does nothing" bug.
3. **Section 2.15 added: primitive and state inventory.** Every interactive control, its states, and its ARIA role in one table.
4. **Section 4.12 added: per-section acceptance criteria.** Version 1 described sections but never said when one is finished.
5. **Section 5.4 added.** Version 1 referenced "section 5.4" twice and never wrote it.
6. **Section 7 expanded** with the schema of every data file, not just the project frontmatter.
7. **Section 9.2 rewritten as a triage table.** Version 1 listed 11 open items flat. They are now split into build-blocking, content-only, and post-launch, each with a default so the build never stalls.
8. **Sections 11 to 14 added:** implementation plan, definition of done, deviations log, asset manifest.
9. **Section 5.5 added:** the content-architecture decision, which version 1 implied but never stated.
10. **Placeholder policy added** (section 2.9): no asset exists yet, and no fake screenshot may be substituted. The rule for what to render meanwhile was missing.

---

## 0. Design read and decisions

**Reading this as:** personal portfolio for recruiters, freelance clients, and developers, with a paper-zine-meets-clean-editorial language, leaning toward Tailwind v4 utilities + CSS variables + Motion (aesthetic family, no official design system).

### 0.1 One design, not two

The brief offered two directions (paper/zine and sleek) or a merge. Decision: **merge them**, because each one alone fails part of the audience.

- Zine alone is memorable but tires a recruiter scanning 30 portfolios in an evening.
- Sleek alone is clean but looks like every other developer template, and it throws away the strongest brand asset already owned: the crumpled-paper, heavy-black-type look of the current deck.

Rule of the merge: **the skeleton is sleek, the personality is zine.** Structure, spacing, type hierarchy, and motion discipline come from the sleek side. Texture, stickers, tape, marker highlight, and hard-offset shadows come from the zine side, and are limited to a short list of places (section 2.6).

| Element | Zine contributes | Sleek contributes |
|---|---|---|
| Background | Crumpled paper texture (from the deck) | Flat neutral base, texture kept faint |
| Type | Heavy, tight display weight | Strict scale, one body font, 65ch measure |
| Color | Black ink on paper | One accent only, locked across the whole site |
| Shapes | Sharp paper-cut edges, hard offset shadows | One radius rule, no blur glows |
| Decoration | Logo stickers, tape on the portrait, marker highlight | Used in 3 places only, never on text blocks |
| Layout | Slight rotation on the hero photo and stickers | 12-column grid, asymmetric but aligned |
| Motion | Stickers pop in with a small overshoot | Reveals use one easing curve, reduced-motion honored |

### 0.2 Dials

| Dial | Value | Reason |
|---|---|---|
| `DESIGN_VARIANCE` | 8 | Creative-leaning portfolio, asymmetric hero and bento, but the content is a hiring document so grids stay aligned |
| `MOTION_INTENSITY` | 6 | Fluid reveals, count-ups, two carousels, one scrolling tools strip. No scroll hijack |
| `VISUAL_DENSITY` | 4 | Standard section rhythm (`py-20 md:py-24`), airy but not a gallery |

### 0.3 Theme

Light and dark are both designed from the start, with a three-way switch: **System** (default, follows `prefers-color-scheme`), **Light**, and **Dark**. The choice is persisted by `next-themes`. **One theme per page at a time**: no section ever flips to an inverted palette mid-scroll.

Mechanically: `next-themes` is configured with `attribute="data-theme"`, so it writes `data-theme="light"` or `data-theme="dark"` on `<html>` and resolves "System" itself. Every dark token therefore hangs off `[data-theme="dark"]`, and the Tailwind `dark:` variant is redefined to match (section 2.14).

### 0.4 Non-negotiables

These eight rules outrank any local preference. If a later change conflicts with one of them, the change is wrong.

1. No em-dash and no en-dash in any visible string, alt text, or metadata.
2. One accent (`--signal`). It is never text on paper in light mode.
3. One radius rule: surfaces `0`, controls pill.
4. No gradients, no blur glows, no pure `#000`, no pure `#fff`.
5. One theme per page, never mixed mid-scroll.
6. Real images only. A missing asset shows an honest pending frame, never a fake screenshot.
7. Every number is real, and every stat carries a `method` and an `asOf`.
8. Every motion above intensity 3 has a `prefers-reduced-motion` fallback.

---

## 1. Tech stack

### 1.1 Core

Versions below were read from the npm registry and are the current releases as of this document. `next`, `react`, and `react-dom` are pinned exactly because the framework and its renderer must move together.

| Layer | Choice | Verified version | Notes |
|---|---|---|---|
| Framework | **Next.js (App Router)** | `16.4.0` | Server Components by default. Published fixes cover the September 2026 advisory, but run `npm audit` after install anyway |
| UI runtime | **React** | `19.3.0` | Required by Next 16 |
| Language | **TypeScript** | `5.x` | `"strict": true`, `noUncheckedIndexedAccess` on |
| Styling | **Tailwind CSS** | `4.3.3` | Use `@tailwindcss/postcss`, not the old `tailwindcss` PostCSS plugin. Tokens live in CSS variables under `@theme` (section 2.14) |
| Class utilities | `clsx`, `tailwind-merge`, `class-variance-authority` | `2.1.1`, `3.7.0`, `0.7.1` | The `cn()` + `cva` pattern |
| Component primitives | **Radix primitives, restyled locally** | current | Version 1 named shadcn/ui. Decision changed to importing the specific Radix packages directly (Popover, Tabs, Accordion, Select, Dialog) and styling them with the tokens. Reason: shadcn's generator writes its own theme file and its own `globals.css` block, which fights the token layer in section 2.2 and reintroduces radius and color values that §0.4 forbids. Using Radix directly keeps exactly the accessible behavior and none of the styling conflicts |
| Icons | `@phosphor-icons/react` | `2.1.10` | One family, one stroke weight (`regular`), global default via `IconContext.Provider` |
| Brand logos | `simple-icons` | `16.34.0` | Logo stickers and the tools wall. Brand marks are exempt from the one-icon-family rule. Drop any brand missing from the set (RapidMiner, for example) instead of hand-drawing it |
| Fonts | `next/font/google`: Bricolage Grotesque, Geist, Geist Mono | current | Self-hosted at build, `display: swap`, no `<link>` to Google |
| Animation (UI) | `motion` (`motion/react`) | `14.0.0` | Carousel drag, list reorder, count-up fallback. See the CSS-first rule in section 2.8 |
| Animation (scroll) | GSAP + ScrollTrigger | not installed | Optional. The approved design needs no pinned section |
| Map | `leaflet`, `react-leaflet` | `1.9.4`, `5.0.0` | react-leaflet 5 is the line that supports React 19. Loaded with `next/dynamic` and `ssr: false`, only on the Portal Publik case study |
| Charts | `recharts` | `3.10.1` | Case study pages only. The Home growth bars are CSS |
| Content | **Typed content modules + Zod** | `zod` `4.6.5` | See section 5.5 for why this is not MDX |
| Forms | `react-hook-form` + Zod | current | One Zod schema validates on the client and in the route handler |
| Email | `resend` | `6.32.1` | Contact form delivery |
| Spam protection | Cloudflare Turnstile (`@marsidev/react-turnstile`) + honeypot | `1.6.1` | Free, no CAPTCHA puzzles for most visitors |
| Theme | `next-themes` | `0.4.6` | System, Light, Dark. CSS-variable tokens, no flash on load |
| Images | `next/image` (AVIF/WebP) | built in | All deck images compressed before use (some are 7 MB). Hero image gets `priority` |
| SEO | Next Metadata API, JSON-LD (`Person`), `sitemap.ts`, `robots.ts`, `next/og` | built in | Per-page OG images generated at build |
| Analytics | Plausible or Vercel Web Analytics | optional | Cookieless, so no consent banner needed |
| Hosting | Vercel | | Custom domain, preview deploys per branch |
| Package manager | pnpm, Node 22 or newer | pnpm `11.7.0` | Node 24.21.0 verified on the build machine |

### 1.2 Install

```bash
pnpm create next-app@latest ffrizzy-portfolio \
  --typescript --tailwind --eslint --app --src-dir --turbopack --import-alias "@/*"
cd ffrizzy-portfolio

# runtime
pnpm add next@16.4.0 react@19.3.0 react-dom@19.3.0 \
  motion @phosphor-icons/react simple-icons recharts leaflet@1.9.4 react-leaflet@5 \
  @radix-ui/react-popover @radix-ui/react-accordion @radix-ui/react-tabs \
  @radix-ui/react-select @radix-ui/react-dialog \
  next-themes react-hook-form zod @hookform/resolvers resend @marsidev/react-turnstile \
  clsx tailwind-merge class-variance-authority

# dev
pnpm add -D @types/leaflet prettier prettier-plugin-tailwindcss \
  @playwright/test @axe-core/playwright @lhci/cli
```

`create-next-app` writes a preferences file under `%APPDATA%` on Windows. In a sandboxed or restricted shell that write is denied and the command aborts with `EPERM`. The workaround is to scaffold by hand from the file tree in section 1.5, which is what the reference build does.

Dependency rule: before importing any package, confirm it exists in `package.json`. If it is missing, add the install command first.

### 1.3 Where heavy libraries load

| Library | Loaded on | How |
|---|---|---|
| Leaflet, react-leaflet | `/work/portal-publik` only | `dynamic(() => import(...), { ssr: false, loading: <MapSkeleton/> })` |
| Recharts | Case study pages with charts | Client leaf, lazy |
| Motion | Site-wide, small leaves only | Each animated component is its own `'use client'` leaf. Server Components render the static layout |

The Home first-load bundle must not contain Leaflet or Recharts. This is enforced by keeping every import of them inside a `dynamic()` call that only a case study route reaches.

### 1.4 Environment variables

```
NEXT_PUBLIC_SITE_URL=https://<your-domain>
RESEND_API_KEY=
CONTACT_TO_EMAIL=m.farrel2222@gmail.com
CONTACT_FROM_EMAIL=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
NEXT_PUBLIC_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
NEXT_PUBLIC_MAP_ATTRIBUTION=&copy; OpenStreetMap contributors
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
```

Commit a matching `.env.example` with the keys present and the values empty. Never commit `.env.local`.

OpenStreetMap standard tiles are fine for a low-traffic portfolio if attribution stays visible. Swap the URL for MapTiler or Stadia if traffic grows. Keep the attribution string in sync with whichever provider is used.

**Graceful degradation rule:** the contact form and the map must both work as a demo without secrets. If `RESEND_API_KEY` or the Turnstile keys are absent, the route handler validates the payload with Zod, skips the third-party calls, and returns a clearly labeled development response instead of throwing. This keeps `pnpm dev` useful on a fresh clone.

### 1.5 Project structure

```
src/
  app/
    layout.tsx                 fonts, theme provider, nav, footer, texture layer
    page.tsx                   Home: the 10 sections in order (one long page)
    work/[slug]/page.tsx       case study template
    api/contact/route.ts       form handler (Zod + Turnstile + Resend)
    cv/route.ts                redirect to /Farrel-Frizzy-CV.pdf, fires analytics event
    not-found.tsx  error.tsx  loading.tsx
    sitemap.ts  robots.ts  opengraph-image.tsx
  components/
    ui/                        restyled Radix primitives
    home/                      Hero, StatGrid, WorkBento, SkillsMap, ContentCarousel, KitoCaseStudy,
                               WorkList, WritingSection, AboutSection, ContactForm
    work/                      CaseStudyLayout
    shared/                    Sticker, TapedPhoto, CountUp, StatViz, Reveal, ThemeSwitch,
                               Carousel, Accordion, MarkerHighlight, PendingImage
  content/
    schema.ts                  Zod schemas and inferred types
    projects.ts                the ten project records
    site.ts                    stats, timeline, events, awards, certs,
                               growth, writing, skills, tools, KITO copy
  lib/
    content.ts                 validation, computed stats, derived skills map
    contact-schema.ts          one contact schema for the client and the route
    assets.server.ts           asset gap reporting, server only
    constants.ts               z-index scale, breakpoints, nav, routes
    analytics.ts               event names (stable, never renamed casually)
    utils.ts                   cn() and the stat formatter
  styles/globals.css           tokens, the @theme bridge, texture, motion,
                               and the single reduced-motion block
public/
  textures/paper.webp
  images/                      compressed deck images
  Farrel-Frizzy-CV.pdf
```

### 1.6 Quality gates

- ESLint flat config, Prettier with the Tailwind plugin, `tsc --noEmit` in CI.
- Playwright smoke test per route plus `@axe-core/playwright` accessibility scan in both themes.
- Lighthouse CI budgets: LCP under 2.5 s, INP under 200 ms, CLS under 0.1, mobile profile.
- Home first-load JS target: 170 KB gzipped or less.

### 1.7 Version policy

- `next` and `react` move together and stay pinned to exact versions.
- Everything else uses a caret range.
- Before any dependency bump, re-run `pnpm typecheck` and `pnpm build`. Recharts and react-leaflet are the two packages most likely to break on a React major.
- If Recharts ever rejects the installed React version, the fallback is a CSS or SVG chart for that page, not `--legacy-peer-deps`.

---

## 2. Design system

### 2.1 Concept

A printed zine that got a design system. Paper, ink, one orange. Everything else is whitespace.

### 2.2 Color tokens

Single accent: **Signal** orange. Saturation kept under 80%. No purple, no gradients, no glows.

The paper is a **neutral gray-white sampled from the deck's texture**, not a warm cream. No pure `#000` and no pure `#fff` anywhere.

```css
:root {
  /* surfaces */
  --paper:        #ECEDED;
  --paper-raised: #F5F6F6;
  --paper-sunken: #DFE0E1;
  /* ink */
  --ink:          #111214;
  --ink-muted:    #4A4D52;
  --line:         #C4C7CA;
  /* accent (locked, used identically on every page) */
  --signal:       #E2683A;
  --on-signal:    #111214;
  /* feedback */
  --danger:       #B3261E;
  /* texture layer */
  --texture-opacity: 0.55;
  --texture-filter:  none;
  --hard-shadow:  4px 4px 0 0 var(--ink);
}

[data-theme="dark"] {
  --paper:        #0F1012;
  --paper-raised: #17181B;
  --paper-sunken: #0B0C0D;
  --ink:          #E9EAEA;
  --ink-muted:    #A3A6AB;
  --line:         #2A2C30;
  --signal:       #E2683A;   /* unchanged: brand accent stays recognizable */
  --on-signal:    #111214;
  --danger:       #F2B8B5;
  --texture-opacity: 0.07;
  --texture-filter:  invert(1);
  --hard-shadow:  4px 4px 0 0 var(--signal);
}
```

Note the rename: version 1 called the shadow token `--shadow-hard`, which collides with Tailwind's own `--shadow-*` namespace. The raw token is `--hard-shadow`, and section 2.14 maps it to the `shadow-hard` utility.

**Contrast (approximate, verify with a checker):**

| Pair | Ratio | Use |
|---|---|---|
| `--ink` on `--paper` (light) | about 15:1 | Body, headings |
| `--ink-muted` on `--paper` (light) | about 7:1 | Secondary text |
| `--on-signal` on `--signal` | about 5.6:1 | Button label, marker highlight |
| `--ink` on `--paper` (dark) | about 16:1 | Body, headings |
| `--ink-muted` on `--paper` (dark) | about 7.5:1 | Secondary text |

**Accent rule (important):** in light mode `--signal` fails as text on paper (about 2.6:1). So in light mode the accent is **only a fill, an underline, or a highlight**, always with `--on-signal` text on top. Links are ink with a thick signal underline. In dark mode the accent may also be used as text.

Third-party brand logos (stickers, tools wall) keep their native colors. That is the one documented exception to the single-accent rule.

### 2.3 Typography

The deck fonts (Poppins, Montserrat) are intentionally not used. This pairing keeps the heavy, tight headline feel of the deck with a more distinctive display face.

| Role | Font | Weights | Notes |
|---|---|---|---|
| Display | **Bricolage Grotesque** | 700, 800 | `tracking-tighter leading-[1.02]`, optical size on |
| Body | **Geist** | 400, 500 | `leading-relaxed`, `max-w-[65ch]` |
| Mono | **Geist Mono** | 400, 500 | All numbers, stats, dates. `tabular-nums` |

No serif anywhere. Inter is not used.

**Scale:**

| Token | Mobile | Desktop | Use |
|---|---|---|---|
| `display-hero` | `text-4xl` | `md:text-5xl lg:text-6xl` | Hero headline only (it is a 9-word line, so no larger) |
| `display-section` | `text-3xl` | `md:text-5xl` | Section headlines, 8 words max |
| `title` | `text-xl` | `md:text-2xl` | Card and case-study subheads |
| `body` | `text-base` | `text-base` | 65ch max |
| `small` | `text-sm` | `text-sm` | Captions, metadata |
| `stat` | `text-4xl` | `md:text-6xl` | Stat numbers (count-up), Geist Mono 500 |

**Emphasis:** done with the **marker highlight** (signal-colored background behind the word, `box-decoration-break: clone`) or bold of the same family. No italic display, no mixed-family emphasis. The highlight avoids descender clipping.

### 2.4 Layout and spacing

| Item | Value |
|---|---|
| Base unit | 4 px |
| Spacing steps | 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 |
| Container | `max-w-7xl mx-auto px-4 md:px-8` |
| Grid | 12 columns, `gap-6 md:gap-8` |
| Section padding | `py-20 md:py-24` |
| Breakpoints | `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536` |
| Hero height | `min-h-[100dvh]` (never `h-screen`) |
| Hero top padding | max `pt-24` at desktop |
| Nav | one line at desktop, 64 px tall, never over 80 px |

Multi-column layouts use CSS Grid (`grid-cols-1 md:grid-cols-12`), never flex percentage math. Every asymmetric layout collapses to a single column below 768 px (`w-full px-4`).

Anchors need `scroll-padding-top: 80px` on `<html>` so a jumped-to section heading is not hidden under the nav. Smooth scrolling is enabled, and turned off under `prefers-reduced-motion`.

### 2.5 Radius, borders, shadows

**One documented shape rule, followed everywhere:**

| Element | Radius |
|---|---|
| Surfaces: cards, bento cells, images, inputs, dialogs | `0` (paper-cut) |
| Controls: buttons, chips, toggles, tabs | `9999px` (pill) |
| Stickers | circle (`9999px`) |

| Item | Value |
|---|---|
| Hairline | `1px solid var(--line)` |
| Emphasis border | `2px solid var(--ink)` (primary button, stickers, taped photo) |
| Hard offset shadow | `var(--hard-shadow)`: used only on the primary button, the taped portrait, and project cells on hover |
| Soft shadows | None. No blur glows, no pure-black shadows |

Cards exist only where elevation means something (bento cells, project cards). Elsewhere, group with spacing or a single `border-t`.

### 2.6 Zine layer: where it is allowed

The zine personality lives in exactly these places:

1. **Paper texture**: a fixed, `pointer-events-none` pseudo-element behind everything (`fixed inset-0 -z-10`), using `public/textures/paper.webp` at `--texture-opacity`. Never applied to scrolling containers.
2. **Hero portrait**: the photo taped to the page with a CSS tape strip, rotated at most 2 degrees, with the hard offset shadow.
3. **Logo stickers**: circular, 2 px ink border, rotated up to 8 degrees, around the hero portrait and on the 404 page.
4. **Marker highlight**: one phrase in the hero headline, and one per section headline at most.

Tape and stickers are built with CSS (a semi-transparent rectangle with a `clip-path` edge, a bordered circle). Do not hand-draw SVG decoration. Illustrations follow section 2.13.

Never place texture, tape, stickers, or rotation behind or over body text, forms, or the experience timeline.

### 2.7 Components

**Buttons (pill)**

| Variant | Light | Dark |
|---|---|---|
| Primary | `--signal` fill, `--on-signal` text, 2 px ink border, hard shadow | Same, shadow in signal |
| Secondary | Transparent, 2 px ink border, ink text | Same |
| Text link | Ink text, 2 px signal underline, `underline-offset-4` | Signal underline stays |

States: hover (shadow grows to 6 px), `:active` (`translate-y-[1px] scale-[0.98]`, shadow collapses), `:focus-visible` (`outline: 2px solid var(--ink); outline-offset: 3px`), disabled (50% opacity, no shadow), loading (label swaps to "Sending", no spinner).

Labels fit on one line at desktop and stay under 3 words. **One label per intent across the whole site:**

| Intent | Label |
|---|---|
| See projects | `View work` |
| Resume | `Download CV` |
| Contact | nav link `Contact`, form button `Send` |

The only section-end link is `Work` under Selected work (it jumps to `#all`), a plain text link with a Phosphor arrow. It is navigation, not an extra CTA.

**Chips (pill, hairline border, small):** filter chips, stack tags. Selected chip = signal fill + `--on-signal`.

**Inputs (radius 0):** label above, 1.5 px `--ink` border on `--paper-raised`, helper text optional, error text below in `--danger`, `gap-2` between label, field, and message. No placeholder-as-label. Focus ring as buttons. Placeholders pass 4.5:1.

**Project cell/card (radius 0):** image on top (real screenshot), title, one-line outcome, max 3 stack chips, links row. Hover lifts 2 px and adds the hard shadow. Cells are used only where hierarchy needs them.

**Nav:** wordmark left (Bricolage 800), five anchor links (`Work` to `#all`, `Content`, `Writing`, `About`, `Contact`), theme switch right. 64 px tall, `--paper` with a hairline bottom border, not sticky (it scrolls away). Below `md`, a hamburger opens a full-height sheet with large links.

**Footer:** copyright line left, LinkedIn, GitHub, and `Download CV` links right, single row, hairline top border. No version string, no locale or time strip.

**Toast:** not used in the approved design. Form states are inline.

**Theme switch:** a segmented pill with three round icon buttons (34 px): System (`Monitor`), Light (`Sun`), Dark (`Moon`), inside a 2 px ink border. Selected = ink fill with paper icon. It is a radio group with an `aria-label` on each option and a visible focus ring. Default System.

**Carousel (Content growth, Instagram series):** one slide at a time inside a hairline-bordered `--paper-raised` box (radius 0). Slide = two columns with a mono counter (`01 / 03`), content on the left, visual on the right. Previous and next are 44 px square buttons (2 px ink border, hover signal fill, press scale 0.94) that wrap around. Progress dots are 36 by 6 px pills, and the active one stretches to 56 px in signal. Arrow keys switch slides when a dot or arrow is focused. No autoplay. One column below 900 px.

**Accordion (skills, certifications):** hairline rows, a mono `+` that rotates 45 degrees when open, hover = signal fill, open = `--paper-sunken` with an ink border, content fades up in 350 ms. Skills allow one open at a time.

**Timeline (About):** a 2 px `--line` rail on the left with a signal progress line that fills as the reader scrolls. Each entry has a title and mono dates.

### 2.8 Motion spec

Global easing: `cubic-bezier(0.16, 1, 0.3, 1)`. Durations: micro 150 to 300 ms, reveal 700 ms, carousel slide 600 ms, bars 800 to 1000 ms. Animate `transform` and `opacity` (plus `stroke-dashoffset` and an integer counter for count-ups).

**Implementation rule: CSS first.** Scroll-driven animation (`animation-timeline: view()`) where supported, with a plain on-load animation as the fallback. Use Motion only for what CSS cannot do well: list reordering, route transitions, swipe.

| Motion | Tool | Purpose | Reduced-motion fallback |
|---|---|---|---|
| Section reveal (fade up 24 px) | CSS `animation-timeline: view()`, `animation-range: entry 0% entry 45%`. Motion `whileInView` as fallback | Guide reading order | Visible immediately |
| Hero entrance: headline, subtext, CTAs (0.12 s stagger), portrait (0.2 s) | CSS or Motion | First impression | Static |
| Sticker pop-in (scale 0.8 to 1, small overshoot, 0.5 to 0.8 s delays) | CSS | Zine personality, hero only | Static |
| Stat count-up (projects 0 to 10, followers 0 to 100K+, 1.4 s) | CSS `@property --n` integer counter | Make the numbers land | Final number |
| Stat visuals: ring arc draw, tick growth, stack segments, account dots, platform marks, play triangle | CSS (`stroke-dashoffset`, `scale`) | Show what each number counts | Final state |
| Stat hover: icon tile shadow, thicker label underline, illustration scale 1.08, ring turns signal | CSS | Reward exploring | Kept (no motion) |
| Carousel slide-in (40 px from right, 600 ms) with bars regrowing each slide | CSS | Make each slide feel new | Instant switch |
| Flow connectors (grow from left, 600 ms, 300 ms delay) | CSS `scaleX` | Show direction of the flow | Static |
| Timeline progress line (`scaleY`) | CSS scroll-driven, `entry 20% cover 70%` | Show progress through the timeline | Full line |
| Tools strip (30 s linear loop, pauses on hover and focus) | CSS `translateX` | The only infinite loop on the site | Static, scrollable |
| Accordion open (content fades up, 350 ms) | CSS | Soft disclosure | Instant |
| Work filter reorder | Motion `layout` + `AnimatePresence` | Show what changed | Instant swap |
| Theme change (background and color, 300 ms) | CSS transition | Smooth switch | Instant |
| Button press and card lift | CSS `:hover`, `:active` | Tactile feedback | Kept (tiny) |
| Page transition (case study routes) | CSS `@view-transition { navigation: auto; }` | Smooth route changes | Disabled |
| Carousel touch swipe | Motion `drag` | Mobile affordance | Not needed (buttons remain) |

Bans: no `window.addEventListener("scroll")`, no `useState` for continuous values (mouse, scroll), no custom cursor, no infinite loop other than the tools strip, no autoplay on carousels, no scroll cue ("Scroll" text or mouse icon).

**Enforcement:** the reduced-motion rule is written once, in `globals.css`, as a single `@media (prefers-reduced-motion: reduce)` block that zeroes the animation and transition durations and forces every revealed element to its final state. Scattering the check across components is what causes the "one element still animates" bug.

### 2.9 Imagery and assets

Real images only. No div-based fake screenshots, no gradient blobs standing in for a hero.

| Asset | Source | Spec |
|---|---|---|
| Paper texture | Background image in the current deck (`ppt/media`, likely the large JPEG used as slide background) | One 1600 x 1000 WebP, under 150 KB |
| Hero portrait | Portrait from deck slide 2 | 4:5 crop, WebP/AVIF, `priority` |
| Djournl screenshots | Live app at djournl.up.railway.app | Light and dark, desktop and phone, plus a short muted loop |
| Portal Publik screenshots | Local run of `portal-publik` | Home, list, map, scorecard |
| Tableau dashboard | Slide 7 image or fresh export | 16:10 |
| K-Means and TOPSIS charts | Slides 7 and 8 images or the papers | Optional redraw in Recharts only with the real numbers |
| COBIT, SAT SET (Figma) | Slide 8 images | 16:10 |
| Content proof | Instagram screenshots from slides 12, 13 to 16, 22 to 25, 28 to 32 | Phone-frame crops, WebP |
| Event photos | Slide 5 and 20 photos | 3:2 |
| Brand logos | `simple-icons` | Single SVG each, theme-aware color |

Every image has meaningful alt text, explicit width and height (CLS), and a blur placeholder. Pills or text labels are not overlaid on images; captions go below.

**Placeholder policy (new).** Until an asset listed in section 14 exists, its slot renders the `PendingImage` component: a `--paper-sunken` panel, radius 0, hairline border, showing the expected filename and pixel size in mono, with `aria-label` naming the missing asset. It must not imitate a screenshot, and it must be obvious in review that the slot is empty. The full asset list is in section 14.

### 2.10 Copy rules

- **Zero em-dashes and zero en-dashes anywhere on the site.** Use a hyphen, comma, colon, or period. Ranges use a hyphen (`1993-2020`).
- Section headlines are 8 words or fewer. Sub-paragraphs are 25 words or fewer.
- Concrete verbs only. No "elevate", "seamless", "unleash", "next-gen".
- Numbers come from the CV or deck. Mock numbers (such as the Portal Publik demo data) are labeled "Sample data".
- No step labels like "Step 1 / Phase 2". Use the verb itself.
- Eyebrow labels (small uppercase above a headline): maximum 1 per 3 sections, never numbered. Home budget: 2.
- Middle-dot separators: at most one per line.
- No decorative dots, no version labels, no fake status.
- Re-read every string before launch (see section 8).

**Enforcement note:** `CLAUDE.md`-style prose linting is out of scope, but the reference build adds a unit check that scans the rendered copy and content modules for `\u2014` and `\u2013` and fails the build if either appears. This is the only reliable way to keep rule 1 true after the tenth edit.

### 2.11 Accessibility

- WCAG AA contrast minimum, AAA target on hero copy.
- Skip-to-content link, visible `:focus-visible` on everything, full keyboard use of the filter bar, skills map, accordion, and form.
- `prefers-reduced-motion` honored for everything above motion level 3 (table 2.8).
- `prefers-color-scheme` respected, manual toggle persisted.
- Map and charts have text equivalents (a short summary and a data table disclosure).
- Form labels, error text, and focus rings pass AA in both themes.
- The theme switch is a labelled radio group, not three unlabelled buttons.

### 2.12 Z-index scale (document in `constants.ts`)

| Layer | z-index |
|---|---|
| Texture (fixed, behind) | `-10` |
| Content | `0` |
| Nav (applies if it becomes sticky later) | `40` |
| Mobile sheet | `50` |
| Dialog | `60` |
| Toast | `70` |

### 2.13 Illustration and icon system

**Rule:** an illustration must show a real number or a real thing. No filler. This replaces the earlier blanket ban on decorative SVG, and nothing outside this section is allowed.

**Allowed illustration sources (use in this order):**
1. **Data-driven SVG generated in code** from `stats`, `timeline`, and project files: rings, dot grids, tick axes, stacked bars. These are not hand-drawn, and they update when the data changes.
2. **CSS paper-cut shapes**: tape, stickers, phone frame, ticket stub. They follow the zine layer rules in 2.6.
3. **One licensed illustration set** (optional), in one style only, with the license checked and the colors remapped to the tokens. Use it only for empty states, the 404 page, and the contact band.

**Drawing rules:** 2 px strokes in `--ink`, fills from `--paper-raised` or `--paper-sunken`, and at most one `--signal` element per illustration. Surfaces have radius 0 and circles stay circles. Everything works in light and dark through tokens, never hard-coded colors.

**Not allowed:** hand-drawn blobs, wave dividers, gradient orbs, AI-generated pictures of people, emoji used as icons, and mixing in a second icon family.

**Where illustrations appear:**

| Spot | Illustration |
|---|---|
| Home stat grid | The five data-driven visuals in section 4.2 |
| Work empty state | Paper-cut folder shape with a "Reset filters" button |
| 404 | One sticker and the large display type |
| Contact band | Optional licensed illustration, single style |

**Icons:** `@phosphor-icons/react`, weight `regular`, 24 px by default (20 px inline), `currentColor`. Icon tiles are 40 px squares with a 2 px ink border, radius 0, and `--paper-raised` fill. Icon-only buttons need an `aria-label`. Icons never loop or spin. Hover moves them 1 px at most.

| Use | Icon |
|---|---|
| Stats | `GraduationCap`, `CalendarCheck`, `Stack`, `UserPlus`, `Eye` |
| Work types | build `Code`, data `ChartBar`, research `Flask`, design `PenNib`, content `PencilSimpleLine` |
| Timeline markers | work `Briefcase`, leadership `UsersThree`, award `Trophy` |
| Actions | `ArrowUpRight` (external), `DownloadSimple` (CV), `CaretLeft` and `CaretRight` (carousel), `Plus` (accordion), `Monitor`, `Sun`, `Moon` (theme) |
| Contact | `EnvelopeSimple`, `LinkedinLogo`, `GithubLogo` |

### 2.14 Token to Tailwind v4 wiring (new)

Version 1 defined raw CSS variables and then used Tailwind class names as if utilities such as `bg-paper` and `text-ink` already existed. In Tailwind v4 they do not exist until the variables are registered in the `@theme` block. This section is the missing link, and getting it wrong is the most common reason a theme switch appears to do nothing.

Two rules make the whole thing work:

1. **`@theme inline` is required** because the values point at other CSS variables. Without `inline`, Tailwind resolves the variable once at build time and the dark theme stops switching.
2. **The `dark:` variant must be redefined** because the theme is driven by a `data-theme` attribute, not the `.dark` class that Tailwind assumes by default.

```css
/* src/styles/globals.css */
@import "tailwindcss";

/* 1. Point the dark variant at the attribute next-themes writes. */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

/* 2. Register the raw tokens as Tailwind theme values.
      "inline" keeps them as live var() references so they re-resolve. */
@theme inline {
  --color-paper:        var(--paper);
  --color-paper-raised: var(--paper-raised);
  --color-paper-sunken: var(--paper-sunken);
  --color-ink:          var(--ink);
  --color-ink-muted:    var(--ink-muted);
  --color-line:         var(--line);
  --color-signal:       var(--signal);
  --color-on-signal:    var(--on-signal);
  --color-danger:       var(--danger);

  --font-display: var(--font-bricolage);
  --font-sans:    var(--font-geist);
  --font-mono:    var(--font-geist-mono);

  --radius-pill: 9999px;
  --shadow-hard: var(--hard-shadow);
  --ease-zine:   cubic-bezier(0.16, 1, 0.3, 1);
}
```

What that buys, and the exact class to use:

| Token | Utility generated | Example |
|---|---|---|
| `--color-paper` | `bg-paper`, `text-paper`, `border-paper` | `bg-paper` page surface |
| `--color-ink` | `text-ink`, `border-ink` | `text-ink` body copy, `border-ink` the 2 px emphasis border |
| `--color-signal` | `bg-signal`, `border-signal` | `bg-signal` primary button fill |
| `--color-on-signal` | `text-on-signal` | primary button label |
| `--font-display` | `font-display` | hero and section headlines |
| `--font-mono` | `font-mono` | all numbers |
| `--radius-pill` | `rounded-pill` | buttons and chips |
| `--shadow-hard` | `shadow-hard` | primary button, taped photo, card hover |
| `--ease-zine` | `ease-zine` | every reveal transition |

`rounded-none` already exists in Tailwind and needs no token, so surfaces use it directly.

The three fonts are bound in `layout.tsx` with `next/font/google`, each exporting a CSS variable, and those variables are attached to `<html>`:

```tsx
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-bricolage" });
const geist = Geist({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-geist-mono" });

<html lang="en" suppressHydrationWarning className={`${bricolage.variable} ${geist.variable} ${geistMono.variable}`}>
```

`suppressHydrationWarning` on `<html>` is required, because `next-themes` writes the theme attribute before React hydrates and the server cannot know which theme the visitor chose.

The provider configuration that matches section 0.3:

```tsx
<ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
```

`disableTransitionOnChange` stays `false` because section 2.8 asks for the 300 ms theme transition. The provider's inline script sets the attribute before first paint, so the transition never fires on load and there is no flash.

Finally, the global transition itself lives in one place:

```css
html { scroll-padding-top: 80px; }
body { background-color: var(--paper); color: var(--ink); transition: background-color 300ms, color 300ms; }
```

### 2.15 Primitive and state inventory (new)

Every interactive primitive, its accessible role, and its states. This is the checklist for section 1.6's accessibility scan.

| Primitive | Radix base | Role | States to implement |
|---|---|---|---|
| Button | native `<button>` | `button` | default, hover, active, focus-visible, disabled, loading |
| Text link | native `<a>` | `link` | default, hover, focus-visible, visited |
| Chip (filter) | native `<button>` in a radio group | `radio` | unselected, selected, hover, focus-visible |
| Input, Textarea | native | `textbox` | default, focus, filled, invalid, disabled |
| Select | `@radix-ui/react-select` | `combobox` | closed, open, option highlighted, invalid |
| Accordion | `@radix-ui/react-accordion` | `button` + region | closed, open, hover, focus-visible |
| Popover ("How is this counted?") | `@radix-ui/react-popover` | `dialog` | closed, open, Escape closes and restores focus |
| Tabs (if used) | `@radix-ui/react-tabs` | `tablist` | selected, unselected, focus-visible |
| Dialog (mobile nav sheet) | `@radix-ui/react-dialog` | `dialog` | closed, open, focus trapped, Escape closes |
| Carousel | native buttons + `role="group"` | `aria-roledescription="carousel"` | first, middle, last, keyboard, swipe |
| Theme switch | native inputs in a radio group | `radiogroup` | system, light, dark, focus-visible |
| Timeline | static markup | `list` | scrolled, fully revealed |

---

## 3. Information architecture

The site is **one long page** (`/`) with ten sections and anchor navigation, plus case study pages and a few system routes.

| Route | Purpose | Primary audience |
|---|---|---|
| `/` | The whole portfolio, in the ten sections below | Everyone |
| `/work/[slug]` | Case study page (10 projects), linked from cards and rows | Developers, clients |
| `/cv` | Redirect to the CV PDF with an analytics event | Recruiters |
| `/work`, `/content`, `/writing`, `/about`, `/contact` | Permanent redirects to `/#all`, `/#content`, `/#writing`, `/#about`, `/#contact` | Old or shared links |
| `404`, `error`, `loading` | System states | All |

**Home sections, in order:**

| # | Section | Anchor | Layout family |
|---|---|---|---|
| 1 | Hero | top | Asymmetric split |
| 2 | Stat grid | `#stats` | Hairline-divided grid |
| 3 | Selected work | `#work` | Bento (5 cells) |
| 4 | Skills map | `#skills` | Two columns plus marquee strip |
| 5 | Content growth | `#content` | Carousel |
| 6 | KITO case study | `#kito` | Stat pair plus flow diagram |
| 7 | Everything I have built | `#all` | Filter chips plus list rows |
| 8 | Writing | `#writing` | Feature band plus carousel |
| 9 | About | `#about` | Two columns with timeline |
| 10 | Contact | `#contact` | Form band |

Primary nav (one line): `Work` (to `#all`), `Content`, `Writing`, `About`, `Contact`, then the theme switch. Anchors use smooth scrolling (off under reduced motion) and `scroll-padding-top` of 80 px. Slugs and anchor names are stable once published.

Note the deliberate asymmetry: the nav link `Work` points at `#all` (the filterable list of everything), while the bento section carries the `#work` anchor and its own section-end link. This is intentional, not a bug, and should not be "tidied".

---

## 4. Landing page (`/`)

Ten sections and a footer on one page. Neighboring sections never share a layout family (the carousel component is the one pattern reused, in sections 5 and 8, with other sections between them). No 3-in-a-row zigzag.

### 4.1 Hero (asymmetric split)

- **Layout:** 12-col grid, text in cols 1-7, taped portrait with stickers in cols 8-12. `min-h-[100dvh]`, content and CTAs visible without scrolling.
- **Text elements (max 4, here 3):**
  - Headline (2 lines max): **"I build it, analyze it, and tell the story."** with "tell the story" in the marker highlight.
  - Subtext (16 words): "Information Systems graduate (3.97 GPA) shipping AI web apps, data dashboards, and content that grows audiences."
  - CTAs: primary `View work`, secondary `Download CV`.
- **Visual:** real portrait taped to the page, rotated 2 degrees, hard shadow. 4 logo stickers (Python, Go, Tableau, Figma) overlap the photo edges, never the face.
- **Motion:** headline, subtext, CTAs, and portrait fade up in a staggered sequence, then the stickers pop in one by one. Reduced motion: all static.
- **Mobile:** single column, portrait below the CTAs at a smaller size, stickers reduced to 3.
- **Not allowed here:** tagline under the CTAs, trust strip, scroll cue, audience toggle, locale strip.

### 4.2 Stat grid (hairline-divided, no cards)

Five accumulated, measurable numbers. Every number is real, has a stated method and date, and is shown in the same technical format.

- **Layout:** a 6-column grid. Row 1 has three stats (`col-span-2` each), row 2 has two stats (`col-span-3` each), so the five stats fill both rows with no gap. Stats are divided by a `border-t` hairline with generous padding. No fills, no shadows, no cards. Each stat has an icon tile, the number, a unit label, one short detail line, an illustration on the right, and a "How is this counted?" text button.
- **Number format (the "technical" part):**
  - Geist Mono 500, `tabular-nums`, `text-4xl md:text-6xl`.
  - `+` marks a lower bound (`[N]+`, `100K+`, `1M+`). Exact counts have no plus (`10 projects`).
  - `K` and `M` are uppercase and fixed in place, so the number never shifts while it animates.
  - Each stat stores `method` and `asOf`. The popover shows both, for example "As of 2026".

| # | Number | Label | Detail line | Icon (Phosphor) | Illustration (data-driven) |
|---|---|---|---|---|---|
| 1 | `3.97` / 4.00 | GPA | Information Systems, Universitas Sriwijaya | `GraduationCap` | Ring gauge filled to 99.25% (3.97 out of 4.00) |
| 2 | `N+` | events | Organized or covered, 2022 to 2026 | `CalendarCheck` | Tick marks on a 2022 to 2026 axis, one tick per event, generated from `timeline.ts` |
| 3 | `10` | projects delivered | Build, data, research, and design | `Stack` | Stacked bar split by project type (build 4, data 1, research 4, design 1), computed from the project files |
| 4 | `100K+` | followers combined | Across 10+ managed accounts | `UserPlus` | Instagram, X, and TikTok marks over a row of 10 account dots and a "+" |
| 5 | `1M+` | views combined | From 500+ published posts | `Eye` | Paper-cut phone frame with a play triangle |

**How each number is counted (shown in the popover):**

| Stat | Method text |
|---|---|
| GPA | Final GPA at graduation, Apr 2025. |
| Events | Counted from `timeline.ts`. Flagship events: Technology Euphoria Festival 2023 and Pesta Rakyat Sriwijaya 2023. Attendance figures are not shown on Home. |
| Projects | Counted automatically from `content/projects/`. It goes up when a project is added. |
| Followers | Sum of followers across 10+ Instagram, X, and TikTok accounts managed. As of 2026. |
| Views | Reels and TikTok views combined. Campaign lifts: +80% (Technology Euphoria 2023), +30% (Pesta Rakyat Sriwijaya 2023), +20% (Rhetoric Academy). As of 2026. |

**Why "combined engagement" is shown as views, not a percentage:** the +80%, +30%, and +20% lifts have different starting points, so they cannot be added into one honest percentage. The combined figure is the 1M+ views, and the three lifts sit in the popover as the breakdown. If there is a real total of likes, comments, and shares, replace the views figure with it.

**Data:** `src/content/stats.ts` holds the manual numbers. `projects` and the type breakdown are computed from the project files, and `events` ticks are computed from `timeline.ts`.

```ts
type Stat = {
  id: "gpa" | "events" | "projects" | "followers" | "views";
  value: number;                 // 3.97, N, 10, 100000, 1000000
  kind: "exact" | "lower-bound"; // lower-bound adds the "+"
  decimals?: number;
  suffix?: string;               // " / 4.00", "K", "M"
  label: string;
  detail: string;                // 12 words or fewer
  method: string;                // shown in the popover
  asOf: string;                  // "2026"
  icon: string;                  // Phosphor icon name
  viz: "ring" | "ticks" | "stack" | "platforms" | "phone";
  href: string;                  // #about, #content, #work, #all
};
```

The events stat is the one entry that is **computed, not typed**: its value is the number of entries in `timeline.ts`, so open item 3 in section 9.2 resolves itself. If the timeline is later trimmed for display reasons, the stat keeps its own count field so the number does not silently change.

- **Animation (on first view, once):**
  - Count-up on two numbers: projects (0 to 10) and followers (0 to 100K+), 1.4 s, using an integer counter. GPA, events, and views show immediately, and their illustrations carry the motion.
  - Ring arc draws. Ticks grow up from the axis. Stack segments grow left to right (staggered 100 ms). Account dots light up in order, and the platform marks pop in. The phone's play triangle scales in.
  - Reduced motion: every stat renders in its final state.
- **Interaction:**
  - Hover or focus on a stat: the icon tile gets the hard shadow, the label underline thickens, the illustration scales to 1.08, and the ring turns signal.
  - Event ticks show their event name in a tooltip. Stack segments show "Build 4", "Data 1", "Research 4", "Design 1" on hover or keyboard focus.
  - Platform marks lift 3 px on hover. The "How is this counted?" disclosure fades open.
- **Accessibility:** the number and label are real text. Illustrations are `aria-hidden`. The popover is keyboard-operable (Radix Popover), closes with Escape, and returns focus to its button.
- **Links:** the label is a text link to its source section (`#about`, `#content`, `#work`, `#all`).
- **Mobile:** one column on small phones, two columns from `sm` (the fifth stat spans both columns). The illustration moves under the number at a smaller size.
- **Not allowed here:** card backgrounds, gradient fills, a stat without a method, rounding a number up to look bigger.

### 4.3 Selected work (bento, exactly 5 cells)

| Cell | Project | Size (desktop, 12-col) | Treatment |
|---|---|---|---|
| A | Djournl | cols 1-7, row 1 | Real app screenshot, largest cell |
| B | KITO Portal Publik | cols 8-12, row 1 | Real screenshot of the map page |
| C | Aid Distribution Dashboard | cols 1-4, row 2 | Tableau screenshot |
| D | Rice Production Clustering | cols 5-9, row 2 | **Signal-filled cell** with the cluster chart |
| E | SAT SET (Figma) | cols 10-12, row 2 | Paper-sunken cell with Figma screenshot |

- **Card content:** title, one-line outcome, max 3 stack chips.
- **Features:** whole cell is the link to `/work/[slug]`, hover lift plus hard shadow, keyboard focus ring, reveal stagger.
- **Section-end link:** `Work` with arrow (jumps to `#all`).
- **Mobile:** single column, order A, B, C, D, E.

Cell D is the only signal-filled surface on the Home page. It is the anchor of the grid and it must stay the only one, or the accent stops meaning anything.

### 4.4 Skills map (two columns plus tools strip)

Headline: "Broad reach, deep tools."

- **Layout:** two columns (`md:grid-cols-2`, gap 48 px). Left, **Broad**: 7 pill chips (Project Management, Event Coordination, Team Leadership, IT, Critical Thinking, Strategic Planning, Creativity). Right, **Deep**: an accordion of 8 skills. Below both, a full-width tools strip with a 2 px ink border above and below.
- **Deep accordion:** one open at a time. Each skill shows "Used in:" with text links to its projects (they jump to `#all`). The lists are **computed from project `tags`**, so adding a project updates them. Current mapping (confirm each one):

| Skill | Used in |
|---|---|
| Microsoft Excel | Aid Distribution Dashboard |
| Content Writing | Audience growth stories, Writing |
| Python | watsonx.ai app, IMDB sentiment capstone |
| Backend Development with Go | Redesign Challenge backend |
| Machine Learning | IMDB sentiment capstone, Rice Production Clustering |
| Data Analytics | Aid Distribution Dashboard, Rice Production Clustering |
| OSINT | Google Dorking and Lens series |
| Information Systems | COBIT 2019 hospital audit, SAT SET, TOPSIS vs SMART |

- **Broad chips:** hover fills the chip with signal.
- **Tools strip:** Python, Go, Excel, Trello, Meta, Tableau, Streamlit, Google, Figma, Canva. The build uses `simple-icons` marks with accessible names and no captions. It scrolls left in a 30 s loop, pauses on hover and focus, and each tool turns signal on hover. The list is duplicated for a seamless loop, and the copy is `aria-hidden`. This is the only marquee on the site.
- **Motion:** section reveal only, plus the accordion fade and the strip.
- **Mobile:** columns stack.

### 4.5 Content growth (carousel)

Headline: "Audiences I helped grow."

- **Layout:** one carousel (component in section 2.7) with three slides, each a two-column layout.
- **Slides (data in `content/growth.ts`):**

| # | Organization | Role | Big number | Sub line | One sentence | Bars (start to peak) |
|---|---|---|---|---|---|---|
| 1 | Technology Euphoria 2023 | Publication lead | `3,400+` | followers, up from zero. 190 posts. | Led the publication team behind event content on Instagram, TikTok, and Twitter. Engagement grew 80%. | 0 to 3,400+ |
| 2 | GDSC UNSRI | Content writing core team | `2,400+` | followers, up from 1,800+ in 3 months. 263 posts. | Set the content and outreach strategy for the year. | 1,800+ to 2,400+ |
| 3 | Pesta Rakyat Sriwijaya 2023 | Social media specialist | `15.3k` | followers, up from 13.1k. 160+ posts. | Coordinated event content across platforms. Engagement grew 30%. | 13.1k to 15.3k |

- **Chart (right column):** two bars, Start and Peak, on a 2 px ink baseline. The peak bar is signal. Each slide has its own scale, so bars compare start against peak only. Heights are proportional within a slide.
- **Behavior:** counter, arrows, dots, and keyboard as in the carousel component. Slide-in from the right (600 ms). The bars regrow every time a slide appears (1 s, the peak bar delayed 0.2 s). No autoplay. The build adds touch swipe (Motion drag) and carousel semantics (`aria-roledescription="carousel"`, labelled slides).
- **Mobile:** one column, chart below the text.
- **Later:** a MediaSI slide when there are numbers for it.

### 4.6 KITO case study (`#kito`)

Headline: "KITO: report once, track everything." Subline: "Case study. My part: the public portal. The Telegram bot, AI agent, and officer dashboard are team work."

- **Two stats (mono, large):** `23,596` complaints recorded by Ombudsman RI in 2025. `64%+` of reports closed in 2024 were delayed handling (33.86%) or no service (30.31%).
- **Flow diagram (four boxes in a row, 2 px ink border, joined by 20 px connector lines):**
  1. **Resident writes:** in everyday language, to a Telegram bot.
  2. **AI agent sorts:** redacts personal data, suggests category, agency, and urgency.
  3. **Officers decide:** they verify and close. The model never does.
  4. **Public portal** (signal fill, hard shadow, this is the owned part): map, status by tracking code, agency scorecard.
- **Safeguards (two-column list):** the agent's database account can only insert; tracking codes come from the server, not the model; field teams get one-time links stored as hashes; photo GPS is checked against the reported location.
- **Stack chips:** Next.js, TypeScript, Tailwind, SWR, Leaflet, Recharts.
- **Status line (mono, small, muted, plain text, not a link button):** "Telegram bot t.me/Palembang_lapor_bot: not active right now." Change it when the bot runs again.
- **Link:** a text link to the full case study page, `/work/portal-publik` (section 5.1).
- **Motion:** section reveal, and the connector lines grow from left.
- **Mobile:** boxes stack, connectors hidden.

### 4.7 Everything I have built (`#all`)

Headline: "Everything I have built."

- **Filter chips:** All, Build, Data, Research, Design, Content (pills, selected = signal fill with ink border). The state lives in the URL (`?type=build`) so views are shareable. Chips are a radio group with a visible focus ring.
- **List rows:** hairline-divided, three columns: title (230 px), one-line outcome (muted), type (mono, right-aligned, 90 px). Hover shifts the row 12 px right. Each row links to `/work/[slug]`.
- **Rows (11):** Djournl, KITO Portal Publik, watsonx.ai app, Redesign Challenge backend (Build); Aid Distribution Dashboard (Data); IMDB sentiment capstone, Rice Production Clustering, TOPSIS vs SMART, COBIT 2019 hospital audit (Research); SAT SET (Design); Audience growth stories (Content, links to `#content`).
- **Row text:** the shortened outcome line for each project.
- **States:** empty ("No projects here yet" with `Reset filters`).
- **Mobile:** rows stack, type left-aligned.

Note the arithmetic: 11 rows, but only 10 are project files. The Content row is a pointer to `#content`, not a case study, so it has no `/work/[slug]` route. The filter must handle that row without a dead link.

### 4.8 Writing (`#writing`)

Headline: "Writing."

- **Article band:** full width, signal fill, 2 px ink border, hard shadow. Two chips (`LinkedIn`, `Bahasa Indonesia`), title "KITO: Kanal Informasi, Transparansi & Observasi", then "30 Sep 2026." and the English excerpt (25 words or fewer, see section 10.3). The whole band is the outbound link. Hover moves it up and left 2 px with an 8 px shadow.
- **Instagram series:** the same carousel component, four slides: Google Maps, Google Dorking, Google Lens, Google Translate. Each slide has the counter, title, one-line description, an `Open on Instagram` text link, and arrows. The right column shows the post cover.
- **Data:** `content/writing.ts`. The article's title, date, and excerpt are copied by hand, because LinkedIn blocks automated reading.
- **Analytics:** outbound clicks fire `article_outbound`.
- **Open links:** Google Maps and Google Dorking post URLs are still missing (section 9.2, item 11). Until they arrive, those two slides render without the `Open on Instagram` link rather than with a placeholder `#`, so no visitor ever lands on a dead link.

### 4.9 About (`#about`)

Headline: "About."

- **Layout:** two columns (`md:grid-cols-2`, gap 48 px).
- **Left:** three short paragraphs (65ch): (1) Information Systems graduate from Universitas Sriwijaya (GPA 3.97 / 4.00, Apr 2025) with three years across content, communications, data, and organizational leadership; (2) comfortable on the creative side and the analytical side; (3) keeps learning through self-driven certifications. Then the languages line (mono): Bahasa Indonesia (native), English (professional). Then **Awards**: three rows in display type with a 2 px ink top border: The Best Core Team (GDSC 2024), 2nd Winner Redesign Challenge (GDSC 2024), 1st Winner UI/UX Competition (Technology Euphoria 2023).
- **Right:** **Experience** timeline with six entries (newest end date first): Product Development Contributor, Palembang Digital (Mar 2024 to Oct 2025); Staff Humas, MediaSI (Mar 2023 to Apr 2025); IBM Generative AI & ML, Hacktiv8, MSIB Batch 7 (9 Sep to 31 Dec 2024); Core Team, Content Writing, GDSC UNSRI (Sep 2023 to Sep 2024); Social Media Specialist, Rhetoric Academy (Jul to Aug 2024); Kerja Praktik, PT PLN Indonesia Power (Dec 2023 to Jan 2024). Then **Certifications** in an accordion by issuer: IBM, Hacktiv8, Coursera, Dicoding.
- **Data:** `timeline.ts`, `awards.ts`, `certs.ts`.
- **Not on this section:** a portrait, a separate education block, a CV button (the CV is in the hero, contact links, and footer).
- **Mobile:** columns stack.

### 4.10 Contact (`#contact`)

- **Layout:** band with a 2 px ink border on top. Headline "Have a project or a role in mind?" (display, up to 72 px, 16ch max). Subtext (under 25 words): "Send a short note about what you need. Email, LinkedIn, or the form all work."
- **Form (max 640 px):** Name, Email, Topic (select: `Hiring`, `Project`, `Collaboration`, `Other`), Message (5 rows, minimum 20 characters in the build), and a primary `Send` button. Labels above the fields (14 px, weight 500), inputs with a 1.5 px ink border on `--paper-raised`, radius 0, focus outline 2 px signal with a 2 px offset.
- **Links row below the form:** email (mailto), LinkedIn, GitHub, `Download CV`.
- **Build behavior:** hidden honeypot, Cloudflare Turnstile, one Zod schema shared by client and server, inline errors under each field. States: idle, sending (button label "Sending"), success (form replaced by a confirmation), error (inline banner with retry plus the email link), rate-limited (clear message). `POST /api/contact` verifies Turnstile, validates, sends through Resend, and returns JSON.
- **Privacy:** the phone number is not published.

### 4.11 Footer

Copyright line ("2026 Muhammad Farrel Al-Wafi Frizzy") on the left. LinkedIn, GitHub, and `Download CV` on the right. Single row on desktop, wraps on mobile.

### 4.12 Section acceptance criteria (new)

A section is done when every row passes. This exists so "looks finished" and "is finished" stop being the same thing.

| Section | Done when |
|---|---|
| 1 Hero | Fits `100dvh` at 1280 px wide and at 390 px wide with no clipped CTA. Headline is 2 lines or fewer at both widths. Stickers never overlap the face. Hero image has `priority` |
| 2 Stat grid | Row 1 is 3 stats, row 2 is 2, no leftover gap at any breakpoint. Every stat has `method` and `asOf`. The events and projects numbers are computed, not typed. Count-up runs once, not on every scroll back |
| 3 Selected work | Exactly 5 cells. Cell D is the only signal-filled surface in the section. Every cell is fully clickable and has a focus ring |
| 4 Skills map | Every "Used in" link resolves to an existing row in `#all` or to `#writing`. The strip pauses on hover and on focus, and its duplicate copy is `aria-hidden` |
| 5 Content growth | Three slides, no autoplay, arrow keys work, dots are keyboard focusable, bars regrow per slide, one column below 900 px |
| 6 KITO | The 23,596 and 64%+ figures render as text, not images. Connectors are hidden on mobile. The bot status line is plain text, not a button |
| 7 Everything built | 11 rows, filter state in the URL, deep link `?type=research` works on first load, the Content row does not 404, empty state has a working reset |
| 8 Writing | The whole article band is one link target. Slides without a URL show no link. Excerpt is 25 words or fewer |
| 9 About | Six timeline entries, newest end date first. Certifications are grouped by issuer. No CV button in this section |
| 10 Contact | Invalid submit shows inline errors and no network call. Honeypot filled means silent success and no email. Missing secrets still return a labeled development response |
| Footer | Single row at desktop, wraps without overflow at 360 px |

---

## 5. Case study pages and system pages

### 5.1 `/work/[slug]` (case study template)

Shared structure, driven by the project module's typed fields:

1. Header: title, role, time frame, stack chips, links.
2. Summary: 2 to 3 sentences.
3. Problem.
4. Approach (with diagram or screenshots).
5. Outcome (real numbers only).
6. Honest limitations: what is untested or would change (Djournl's README already has a strong version of this, reuse it).
7. Gallery (scroll-snap).
8. Next project link.

Featured case studies have extras:

**Djournl**
- Live link (djournl.up.railway.app) and GitHub repo. Because signup is open, show a short muted video loop and screenshots instead of embedding the app.
- Feature list: daily and check-up journaling, mood dashboard, weekly AI pattern insights, shared streaks with invite codes, tags, favorites, `.json` backup and restore, photo notes (4 per note), guided feature tour, forgot-password via personal question.
- Architecture block: vanilla HTML/CSS/JS frontend, Express API, SQLite (`better-sqlite3`), a single AI provider abstraction (Anthropic, OpenAI, or any OpenAI-compatible endpoint by changing `.env`), Docker and Fly.io / Railway / Render deploy guides.
- Security and quality block: scrypt password hashing, HttpOnly session cookies, rate limits, sanitized input, CSP headers, HTTP-level integration tests.
- Interactive piece: a small mood-calendar component built from sample data, labeled "Sample data".

**KITO Portal Publik** (the public portal of KITO: Kanal Informasi, Transparansi & Observasi. Tagline: "Suaro Kito, Urusan Kito")
- **Role:** the public portal was built by the owner. The Telegram bot, AI agent, officer dashboard, and database are team work and are credited as such. The repo sits under another account (`Gedegok23`), so mirror or fork it and replace the "qwewe" description.
- **The problem (open with this):** Ombudsman RI recorded 23,596 complaints in 2025. Among reports closed in 2024, the two most common maladministration types were delayed handling (33.86%) and no service given (30.31%), over 64% combined, all ending at the same point: residents spoke up but could not tell whether anyone heard. In Palembang, complaint channels are split by agency, so residents must know the category and agency before they can report. Link the sources listed in the article.
- **What KITO is:** residents tell a Telegram bot (`@Palembang_lapor_bot`) what is wrong in everyday language. An AI agent (OpenClaw, calling models through OpenRouter: deepseek-v4-flash, with gemini-2.5-flash as backup) removes names, phone numbers, and emails before saving, then suggests category, target agency, and urgency. It asks at most one question when the location is too vague. If both models fail, the report is still saved and marked for manual review. Officers verify and close reports, never the model.
- **Where the portal fits:** report map, status check by tracking code, agency speed scorecard, and category trends over time. Data is filtered at the database query level, so internal officer notes and handler names are never requested, and never reach the public or even the reporter.
- **Safeguards worth showing (team work, shown as a diagram):**
  - The agent's database account (`lapor_agent`) has INSERT rights only. DELETE and SELECT attempts were tested and rejected by the database itself.
  - Reports are saved by an MCP server tool (`submit_laporan`) in one transaction with three INSERTs. Tracking codes are generated by the server, not the model.
  - Field teams get one-time links (random token stored as a hash, valid for one report, with an expiry, photo evidence only).
  - Photo GPS (EXIF) is compared with the reported location, and a red flag appears for officers when the distance is large.
  - Pre-launch tests: the same Telegram webhook sent twice gives one row, an OpenRouter outage still stores the report, another person's tracking code is rejected, and prompt-injection reports cannot override system rules.
  - The whole system (bot, agent, PostgreSQL, dashboard, portal) runs on one server (IDwebhost AI Hosting on Cloud VPS).
- **Why it was designed this way:** the Public Service Law and the Personal Data Protection Law drove the design (redaction before storage, a tightly limited database role, a human making the final decision).
- **Stack block:** Next.js (App Router), TypeScript, Tailwind, SWR for interactive filters after a server-rendered first paint, Leaflet map, Recharts, Radix primitives.
- **Interactive map demo:** Leaflet map centered on Palembang, category-colored pins, filter by category and status. **Uses mock data and says so** ("Sample data"), unless the live API is connected.
- **Chart:** trend chart (bars plus line) from the same data.
- **Decisions block:** numbered pagination (not infinite scroll), sensitive fields intentionally absent from client types, original SVG illustrations, motion that respects reduced-motion.
- **Links:** `Gedegok23/portal-publik`, the LinkedIn article (published 30 Sep 2026), and the agent and dashboard repos if public. There is no live portal URL, so no "Live" button. The Telegram bot `https://t.me/Palembang_lapor_bot` is linked as plain text with the status line "Not active right now" and no "Try it" button, so visitors are not sent to a dead bot. Change the status line when it goes live.
- **States:** map skeleton while loading, empty state when filters match nothing.

**COBIT 2019 hospital audit, SAT SET (Figma)**
- Shorter variant: objective, method, result, link to paper or Figma. COBIT: DSS06 domain, Level 2 capability, 92.8% fully achieved, roadmap to Level 3. SAT SET: predictive-maintenance dashboard design for PT PLN Indonesia.

**watsonx.ai app and IMDB sentiment capstone** (both from the IBM Generative AI & ML program, MSIB Batch 7)
- watsonx.ai app: what the program covered (calling the model through an API from a local machine, then deploying with Streamlit), what was built, and a screenshot. Repo: `ffrizzyy/H8-test-genai`. Add a README first (section 10).
- IMDB sentiment capstone: 5-person team project (Hacktiv8 IBM program, Batch 7) that classifies IMDB review sentiment with a Bidirectional LSTM. Show the problem (star ratings can be biased and may not reflect what the comment says), the pipeline from the deck (data cleaning, word tokenizer, word embedding, model architecture, deployment), and the result: accuracy, recall, and F1 all 88%, balanced across positive and negative. Dataset: TensorFlow Datasets `imdb_reviews`. Links: Colab notebook and the presentation video. The owner's part: data cleaning and feature engineering, plus contributions across the whole project. Credit it as a team of five, with no names. **Only call 88% a test-set result if it is one.**
- Optional proof: a cropped image of the program certificate (name and program only, no signatures or student ID).

Other projects (Tableau dashboard, rice clustering, TOPSIS vs SMART, Redesign Challenge backend) use the same template with fewer sections. For the Redesign Challenge backend, state that the owned part was the backend, then describe the layers (controller, service, repository), the main endpoints or features, and how it connected to the frontend.

### 5.2 System pages

- **404:** composed page with one sticker and a link home. Title in the display font.
- **error.tsx:** short explanation, `Try again` button, link home.
- **loading.tsx:** skeletons matching final layout shapes. No generic spinners.

### 5.3 Later additions (not in the approved design)

Kept here so nothing is lost. None of these are in the approved Home preview.

- **Content proof:** phone-frame screenshot gallery, caption samples (quote blocks of 3 lines or fewer), outbound links to reels and posts (Instagram is linked, never embedded), the "WHISPERS" acronym case for Pesta Rakyat, the mascot and logo story for Techporiafest, and a MediaSI slide.
- **Growth chart as a data chart:** a Recharts version with a "View data" disclosure (accessible table), only if the CSS bars are not enough.
- **Writing:** platform filter chips and more posts, once there are more than five items.
- **About:** a taped portrait, a separate education block, "Show earlier roles" when the timeline grows, and a Download CV button.
- **Footer and contact:** an email copy button with a "Email copied" toast.
- **Navigation:** a sticky header, if the long page feels hard to navigate.

### 5.4 Instagram post links (new, fixes the dangling reference)

Version 1 pointed at "section 5.4" twice without writing it. These are the canonical links for the Writing carousel.

| Slide | URL | Status |
|---|---|---|
| Google Lens | `https://www.instagram.com/p/CsIFl4brYxQ/` | Known |
| Google Translate | `https://www.instagram.com/p/C0YCra8LtML/` | Known |
| Google Maps | not supplied | Missing, slide renders without a link |
| Google Dorking | not supplied | Missing, slide renders without a link |

Strip `utm_source` and `stkn` from any Instagram URL before storing it.

### 5.5 Content architecture (new)

Version 1 specified MDX with Zod-validated frontmatter. This revision specifies **typed TypeScript content modules validated by Zod**, for three reasons:

1. **Turbopack integration risk.** `@next/mdx` with Turbopack and Next 16 needs additional loader wiring, and a failure there breaks the whole build rather than one page. The content in this site is structured records, not prose-heavy documents.
2. **The stat grid computes over the data.** Projects count, the type breakdown, event ticks, and the skills "Used in" lists are all derived from the content set. Importing a typed module makes that a plain function call; parsing MDX at build time makes it a build step.
3. **Zod still does the validating.** Each module is parsed through a Zod schema at import time in `lib/content.ts`, so an invalid record fails `pnpm build` with a field-level error, which is the guarantee version 1 was actually after.

The trade-off is real and worth stating: adding a case study now means editing a TypeScript file, not dropping in a new `.mdx` file. If long-form prose inside case studies becomes common, revisit this and add MDX for the body only, keeping the frontmatter as typed data. The pages are structured so that swap is contained to `lib/content.ts` and the case study body component.

---

## 6. Global features

| Feature | Detail |
|---|---|
| Theme switch | System (default), Light, Dark. Persisted, no flash on load |
| Redirects | `/work`, `/content`, `/writing`, `/about`, `/contact` redirect to the matching anchor on `/` (`next.config` `redirects()`) |
| Skip link | First focusable element |
| Page transitions | CSS View Transitions, progressive enhancement |
| SEO | Per-page metadata, canonical URLs, JSON-LD `Person`, sitemap, robots |
| Open Graph | Generated image per page with `next/og` |
| Analytics events | `cv_download`, `contact_submit`, `project_outbound`, `article_outbound`. Names stay stable |
| Optional GitHub metadata | Repo language and last update pulled at build with `revalidate: 86400`. Skip if it adds noise |
| Error monitoring | Optional Sentry free tier |
| Security headers | CSP, `X-Content-Type-Options`, `Referrer-Policy` via `next.config` headers |

Anchor redirects need care: `next.config` `redirects()` cannot preserve a hash, so a request to `/about` redirects to `/#about` and the browser then handles the hash. Verify each one by hand, because a hash-only redirect that lands at the top of the page looks like a broken link.

---

## 7. Project data model

Frontmatter for each project module, validated with Zod:

```ts
{
  slug: string,
  title: string,
  type: "build" | "data" | "research" | "design" | "content",
  featured: boolean,
  role: string,
  period: string,            // "Nov 2024 - Dec 2024"
  outcome: string,           // one line, real numbers only
  stack: string[],           // chips, max 3 shown on cards
  tags: string[],            // skills; drives the "Used in" lists in the skills map
  links: { label: string, href: string }[],
  cover: string,             // image path
  sampleData?: boolean       // true if any metric on the page is mock
}
```

Initial inventory:

| Slug | Type | Stack | Key result |
|---|---|---|---|
| `djournl` | build | Express, SQLite, vanilla JS, multi-provider AI | Journal, weekly AI insights, shared streaks, tested API |
| `portal-publik` | build | Next.js, TypeScript, Tailwind, SWR, Leaflet, Recharts | Public portal of KITO, a Telegram AI complaint system for Palembang: report map, status by tracking code, agency speed scorecard, category trends. Title on the site: "KITO Portal Publik" |
| `aid-dashboard` | data | Tableau, Excel | Interactive public-transparency dashboard, Musi Banyuasin Regency |
| `watsonx-genai-app` | build | Python, IBM watsonx.ai, Streamlit | Generative AI app built from local API calls to Streamlit deployment, during IBM Generative AI & ML (Hacktiv8, MSIB Batch 7). Repo: `ffrizzyy/H8-test-genai` (confirmed) |
| `imdb-sentiment-bilstm` | research | Python, Bidirectional LSTM, NLP | Team capstone: sentiment analysis of IMDB reviews, from data exploration to model testing. Result: accuracy, recall, and F1 all 88%. Dataset: TensorFlow Datasets `imdb_reviews`. Links: Colab notebook and presentation video `https://youtu.be/xWDXvl7IerM` |
| `rice-clustering` | research | RapidMiner, K-Means | 27 years (1993-2020) of Sumatra rice data, 3 productivity clusters |
| `topsis-smart` | research | TOPSIS, SMART | SMART showed higher sensitivity and stability |
| `cobit-audit` | research | COBIT 2019 (DSS06) | Level 2 capability, 92.8% fully achieved, roadmap to Level 3 |
| `sat-set` | design | Figma | Predictive-maintenance dashboard design for PT PLN Indonesia |
| `redesign-challenge` | build | Go | Backend for the GDSC Redesign Challenge entry (2nd Winner, GDSC 2024). The owned part: the backend. Repo: `ffrizzyy/redesign`. Tags: Backend, Go |

Content work (Techporiafest, GDSC UNSRI, Pesta Rakyat, MediaSI) appears in the `Content` filter and links to the `#content` section.

### 7.1 Supporting data schemas (new)

Version 1 named these files but never specified them. Each is a typed module parsed by Zod in `lib/content.ts`.

```ts
// content/timeline.ts
type TimelineEntry = {
  id: string;
  title: string;                                  // "Product Development Contributor"
  org: string;                                    // "Palembang Digital"
  kind: "work" | "leadership" | "award";          // drives the icon
  start: string;                                  // "2024-03", sortable
  end: string | "present";
  display: string;                                // "Mar 2024 to Oct 2025"
  summary?: string;                               // 25 words or fewer
  countsAsEvent?: boolean;                        // feeds the events stat
};

// content/awards.ts
type Award = { id: string; title: string; org: string; year: number };

// content/certs.ts
type CertIssuer = {
  issuer: "IBM" | "Hacktiv8" | "Coursera" | "Dicoding";
  items: { id: string; name: string; year: number; credentialUrl?: string }[];
};

// content/growth.ts
type GrowthSlide = {
  id: string;
  org: string;
  role: string;
  peak: number;            // 3400, 2400, 15300
  peakLabel: string;       // "3,400+", "2,400+", "15.3k"
  start?: number;          // 0, 1800, 13100 (for the two-bar chart)
  startLabel?: string;
  subLine: string;
  sentence: string;
  posts: number;
};

// content/writing.ts
type WritingItem = {
  id: string;
  platform: "linkedin" | "instagram";
  title: string;
  description: string;
  url?: string;            // absent means the slide renders without a link
  date?: string;           // "30 Sep 2026"
  cover: string;
  language?: "id" | "en";
};
```

Two invariants the loader enforces at build time, because they are the mistakes most likely to ship:

1. Every `tags` value in a project appears in the skills map, and every skill in the map resolves to at least one project. A skill with no project is an orphan and fails the build.
2. Every `cover` path resolves to a file in `public/`, or the project is marked as pending an asset. A broken image path fails the build rather than rendering an empty box.

---

## 8. Pre-flight checklist (run before launch)

**Blocking.** Launch is wrong if any of these fails.

- [ ] Design read declared and dials justified (section 0).
- [ ] Zero em-dashes or en-dashes in any visible string, alt text, or metadata, enforced by the automated check in 2.10.
- [ ] `pnpm typecheck` and `pnpm build` both clean.
- [ ] One theme per page, tested in System, Light, and Dark, with the choice persisted.
- [ ] One accent (`--signal`) used identically everywhere, never as light-mode text.
- [ ] One radius rule (surfaces 0, controls pill) followed everywhere.
- [ ] Hero fits `100dvh`: headline 2 lines or fewer, subtext 20 words or fewer, CTAs visible, 4 text elements max.
- [ ] No CTA label wraps at desktop. One label per intent (`View work`, `Download CV`, `Contact`).
- [ ] Button, form, and placeholder contrast pass AA in both themes.
- [ ] Every stat has a method and an `asOf` date. Computed stats are computed, not typed.
- [ ] All motion above level 3 honors `prefers-reduced-motion`.
- [ ] No `window.addEventListener("scroll")`, no `useState` for continuous values.
- [ ] Every anchor link resolves, and no link points at `#`.
- [ ] No image path is broken. Pending assets use the placeholder frame from 2.9.

**Should.** Fix before launch, or record the reason it is deferred.

- [ ] Eyebrow count within budget, no numbered eyebrows, no split-header pattern.
- [ ] The ten Home sections never repeat a layout family back to back. Bento has exactly 5 cells.
- [ ] Tools strip uses logos with accessible names, theme-aware, and is the only infinite loop.
- [ ] Both carousels are keyboard operable (arrows, dots), have no autoplay, and switch instantly under reduced motion.
- [ ] No fake screenshots, no pills over images, and illustrations only from section 2.13.
- [ ] No scroll cues, no decorative dots, no version labels, no locale strips.
- [ ] Heavy libraries loaded only on their routes. Home JS under budget.
- [ ] Empty, loading, and error states exist for filters, map, charts, and form.
- [ ] Lighthouse mobile: LCP under 2.5 s, INP under 200 ms, CLS under 0.1.
- [ ] Keyboard-only pass: tab from the skip link to the footer without a trap.
- [ ] Copy self-audit done: every visible string re-read for grammar and clarity.

---

## 9. Decisions made and what is still open

### 9.1 Resolved

| Item | Decision |
|---|---|
| Visual direction | Paper-zine per section 2. Confirmed against an alternative "bolder, more colorful" reading. The single-accent and no-gradient rules stand |
| LinkedIn article | Published 30 Sep 2026. Title: "KITO: Kanal Informasi, Transparansi & Observasi". Indonesian, so the card carries a `Bahasa Indonesia` chip. English excerpt drafted in section 10.3 |
| Portal Publik | The public portal of KITO. The owner built the portal. The Telegram bot, AI agent, officer dashboard, and database are credited as team work |
| Live portal | No live URL, so no "Live" button anywhere |
| Telegram bot | Linked as plain text with the status line "Not active right now" and no "Try it" button. Update the status when it is running again |
| IMDB capstone | Team of five (no names). Owned part: data cleaning and feature engineering, plus contributions across the whole project. Result: accuracy, recall, and F1 all 88%. Dataset: TensorFlow Datasets `imdb_reviews`. Presentation video: `https://youtu.be/xWDXvl7IerM` |
| Redesign Challenge | 2nd Winner (GDSC 2024). The `redesign` repo is the entry's backend, and the backend was the owner's responsibility. It is a project on the site (`redesign-challenge`) and a Go backend skill |
| Skills | "Backend Development (Go)" added to the deep skills and the tools wall (section 4.4) |
| Stat grid | Five stats: GPA, events, projects, followers, views. The members-led stat is removed. Numbers are "as of 2026" |
| Spec sync | This spec matches the approved Home artifact: one long page with anchors, carousels instead of the pinned pan, a three-way theme switch |
| Tech stack | Next 16.4.0 and React 19.3.0 pinned. GSAP is optional and not installed. shadcn/ui replaced by direct Radix imports (section 1.1) |
| Content format | Typed Zod-validated content modules, not MDX (section 5.5) |
| Event attendees | 2,000+ |
| "100K+ followers" | Combined across all accounts managed |
| Pesta Rakyat followers | 15.3k |
| Instagram links | Lens and Translate each have their own post (section 5.4) |
| watsonx project | `ffrizzyy/H8-test-genai` is the watsonx app |
| Phone number | Not published |
| CV differences | The site follows what the owner stated, not the CV |
| Fonts | Deck fonts are not used. Bricolage Grotesque, Geist, Geist Mono stay |
| Shadow token | Renamed `--hard-shadow` to avoid a collision with Tailwind's `--shadow-*` namespace (section 2.2) |

### 9.2 Still open, triaged

Version 1 listed these flat, which made it impossible to tell what actually blocks work. Split by consequence, each with the default that applies if no answer arrives.

**A. Build-blocking.** The build cannot produce a correct result without a decision.

| # | Item | Default if unanswered |
|---|---|---|
| 1 | Which Colab link is canonical. Two were sent ("CAPSTONE GAS NGENG" `drive/1l1tAEHq...` and the capstone deck's `drive/1Vf--tup...`) | Use the deck link, mark the project `linksPending: true`, and render the link only after it is confirmed shareable to "anyone with the link" |
| 2 | Whether the 88% is a held-out test-set result | Phrase it as "88% accuracy, recall, and F1 on the evaluation split" until confirmed. Never claim a test-set number that is not one |

**B. Content-only.** The build proceeds correctly without these; only the copy is thinner.

| # | Item | Default if unanswered |
|---|---|---|
| 3 | Total events organized or covered | Computed from `timeline.ts` where `countsAsEvent` is true. No typed number |
| 4 | Redesign Challenge detail: what was redesigned, what the backend does, team size | Ship the section 10.2 outcome line plus the layer description. Add a `detailsPending` note in the repo README, not on the public page |
| 5 | KITO agent and dashboard repos, if public | Omit. Keep the article link and the `Gedegok23/portal-publik` link |
| 7 | A real combined likes, comments, and shares total | Keep `1M+` views and the three lifts in the popover |
| 10 | Confirm the skill-to-project mapping in 4.4 | Use the table as written. The build-time orphan check in 7.1 catches a skill that maps to nothing |
| 11 | Google Maps and Google Dorking post URLs | Those two slides render without the `Open an Instagram` link (section 4.8) |

**C. Out of scope for the site, tracked separately.** These are repo and document tasks, not build tasks.

| # | Item | Where it belongs |
|---|---|---|
| 6 | `H8-test-genai` cleanup: `.venv` is committed and there is no README | Repo task. `git rm -r --cached .venv`, confirm `.gitignore`, add run steps and one screenshot |
| 8 | The IBM report PDF contains a student ID and signature | Publishing rule. Never publish the PDF. Crop any certificate image to name and program only |
| 9 | Case study pages for the nine non-KITO projects | Post-launch. Ship the template plus the full KITO page, and the short variant for the rest |

---

## 10. Description recommendations

### 10.1 GitHub repository descriptions (pick one per repo)

GitHub "About" field. Each option is about 120 characters or less, so it is not cut off in pinned cards.

**`ffrizzy-portfolio`** (the site itself. Set the Website field once it is deployed)
- **A, concise (this is the one currently set):** Personal portfolio: AI web apps, data dashboards, and content that grows audiences. Next.js, TypeScript, Tailwind.
- **B, outcome-led:** The projects I have built, the data I have analyzed, and the audiences I helped grow, in one place.
- **C, technical:** Next.js 16 portfolio: nonce-based CSP, Zod-validated content, print-ready CV, generated favicon and share cards.
- Topics: `portfolio` `nextjs` `typescript` `tailwindcss` `react` `design-system` `personal-website`

**`djournl`** (set the Website field to djournl.up.railway.app)
- **A, concise:** AI-assisted mood journal with weekly pattern insights and shared streaks. Express, SQLite, any major AI provider.
- **B, outcome-led:** A journal that notices your mood patterns each week. Photo notes, shared streaks, and a swappable AI provider.
- **C, technical:** Full-stack journaling app: Express API, SQLite, scrypt auth, provider-agnostic AI layer, Docker, integration tests.
- Topics: `journal` `mood-tracker` `express` `sqlite` `openai` `anthropic` `docker` `javascript`

**`Gedegok23/portal-publik`** (description already updated, options kept for reference)
- **A, concise:** Public portal for KITO, Palembang's citizen report system: report map, status by tracking code, agency scorecard.
- **B, civic:** See where residents report problems in Palembang and how fast each agency responds. Map, status lookup, trends.
- **C, technical:** Next.js, TypeScript frontend for KITO: Leaflet report map, SWR filters, Recharts trends, no sensitive fields in client types.
- Topics: `nextjs` `typescript` `tailwindcss` `leaflet` `recharts` `swr` `civic-tech`

**`loopnote`**
- **A, concise:** Turns photos of notes into searchable summaries and spaced-repetition flashcards. Express, Expo, SQLite. AI calls mocked.
- **B, outcome-led:** Photograph a whiteboard, get a summary and flashcards scheduled with SM-2. Expo app, Express API. AI calls are mocked.
- **C, technical:** Monorepo: Express and SQLite API, Expo client, SM-2 scheduling, review UI, CI. LLM calls mocked for now.
- Keep "mocked" in whichever is chosen, because the README says so.
- Topics: `expo` `react-native` `typescript` `express` `sqlite` `flashcards` `spaced-repetition`

**`H8-test-genai`** (the watsonx app)
- **A, concise:** Streamlit app built on IBM watsonx.ai during the Hacktiv8 IBM Generative AI & ML program (MSIB Batch 7).
- **B, outcome-led:** Generative AI web app using IBM watsonx.ai, called through its API from Python and deployed with Streamlit.
- **C, skills-led:** Hands-on watsonx.ai project from the IBM GenAI & ML program: prompt design, API calls, Streamlit interface.
- Optional rename: `watsonx-streamlit-genai`. GitHub redirects the old URL.
- Topics: `python` `streamlit` `watsonx` `generative-ai` `llm` `hacktiv8`

**`redesign`** (the Go backend for the GDSC Redesign Challenge entry, 2nd place)
- **A, concise:** Backend for our GDSC Redesign Challenge 2024 entry (2nd place). Go, layered architecture: controller, service, repository.
- **B, first person:** Go backend I built for the GDSC Redesign Challenge (2nd place). Controller, service, and repository layers with middleware.
- **C, outcome-led:** GDSC Redesign Challenge 2024, 2nd place. My part: the Go backend, organized in controller, service, and repository layers.
- If it serves HTTP endpoints, add "REST API". If there is a frontend repo, link it in the README.
- Optional rename: `gdsc-redesign-challenge-backend`. GitHub redirects the old URL.
- Topics: `go` `golang` `backend` `layered-architecture` `gdsc` `redesign-challenge`

**Profile bio (under 160 characters)**
- **A:** IT generalist: AI web apps, data dashboards, and content. Information Systems, Universitas Sriwijaya.
- **B:** Information Systems graduate building AI web apps and public-data dashboards. Based in Jakarta.
- **C:** I build AI apps and civic-tech dashboards, and write about them.
- Set the profile website to the portfolio domain.

**Repo hygiene fixes (quick wins):**
- `H8-test-genai`: remove the committed `.venv` folder (`git rm -r --cached .venv`, confirm `.venv/` is in `.gitignore`, commit), then add a README with run steps and one screenshot.
- `redesign`, `H8-test-genai`: add a README. A pinned repo with no README reads as unfinished. If a README cannot be added, unpin it.
- `redesign`: the name is vague. Say in the README that it is the Redesign Challenge backend, and consider renaming it.

### 10.2 One-line outcomes for project cards (25 words or fewer)

| Slug | Outcome line |
|---|---|
| `djournl` | A private journal that spots mood patterns every week, with shared streaks. Works with Anthropic, OpenAI, or any compatible model. |
| `portal-publik` | The public face of KITO: residents see reports on a map, check status by tracking code, and compare how fast each agency responds. |
| `aid-dashboard` | An interactive Tableau dashboard that makes social aid distribution data easy to read for the public. |
| `watsonx-genai-app` | A generative AI app on IBM watsonx.ai, from local API calls to a deployed Streamlit interface. |
| `imdb-sentiment-bilstm` | Team capstone: a Bidirectional LSTM that classifies IMDB review sentiment with 88% accuracy, recall, and F1. |
| `rice-clustering` | K-Means clustering of 27 years of Sumatra rice production data (1993-2020) into three productivity clusters. |
| `topsis-smart` | Compared TOPSIS and SMART to find the best regions for rice growth. SMART was more sensitive and stable. |
| `cobit-audit` | COBIT 2019 audit of a hospital's DSS06 process: Level 2 capability, 92.8% fully achieved, with a roadmap to Level 3. |
| `sat-set` | A Figma dashboard design for real-time asset monitoring and predictive maintenance at PT PLN Indonesia. |
| `redesign-challenge` | The Go backend I built for our GDSC Redesign Challenge entry, which placed 2nd. Controller, service, and repository layers. |

### 10.3 Writing card copy

| Item | Suggested line |
|---|---|
| LinkedIn article (EN excerpt) | How a Telegram bot, an AI agent, and a public portal give Palembang residents one simple place to report problems and track what happens next. |
| LinkedIn article (ID line) | Warga sudah bicara, tapi tidak tahu apakah ada yang mendengar. |
| Google Maps series | Instagram carousel series on practical Google Maps features most people skip |
| Google Dorking | Short Instagram explainer on advanced search operators, with examples |
| Google Lens | Instagram post on searching with a camera instead of words |
| Google Translate | Instagram post on getting more out of Google Translate |

The last four lines describe each post by topic only. Replace them with one real sentence from each post so they match what was actually written.

---

## 11. Implementation plan (new)

Version 1 had no build order. This is the order that avoids rework, because each milestone is a dependency of the next.

| Milestone | Deliverable | Depends on | Exit test |
|---|---|---|---|
| **M0 Toolchain** | Project scaffolds, dependencies install, `pnpm dev` serves a page | none | Dev server responds on localhost, `tsc --noEmit` clean |
| **M1 Token layer** | `globals.css` tokens, `@theme` block, fonts, `next-themes` provider, texture layer | M0 | The three theme options visibly restyle the page with no flash on reload |
| **M2 Shell** | Nav, footer, skip link, container, z-index constants, `Reveal` primitive | M1 | Keyboard tab order is skip link, nav, content, footer. All five anchors scroll with correct offset |
| **M3 Content layer** | All typed content modules, Zod schemas, computed stats, orphan and asset checks | M1 | `pnpm build` fails on a deliberately invalid record and passes when reverted |
| **M4 Home sections** | Sections 1 to 10 in order, each meeting its 4.12 criteria | M2, M3 | All ten sections render at 390 px and 1440 px with no horizontal scroll |
| **M5 Motion and a11y** | Section 2.8 motion, the single reduced-motion block, axe scan in both themes | M4 | Zero axe violations of serious or critical severity in either theme |
| **M6 Case studies and system pages** | `/work/[slug]`, the full KITO page, short variants, 404, error, loading | M3 | The map and charts load only on the case study route, confirmed in the build output |
| **M7 SEO and launch** | Metadata, JSON-LD, sitemap, robots, OG images, redirects, analytics events | M6 | Section 8 blocking checklist fully passes |

Sequencing note: M3 before M4 matters. Building sections against hand-typed numbers and then swapping in the computed content layer is the single largest source of rework in a build like this.

---

## 12. Definition of done (new)

The project is done when all of the following are true, and not before.

1. Section 8 blocking checklist passes in full.
2. `pnpm build` and `pnpm typecheck` are clean on a fresh clone after `pnpm install`.
3. A fresh clone with no `.env.local` still runs, with the contact form and map degraded exactly as described in 1.4.
4. System, Light, and Dark each render every one of the ten sections without a contrast failure or a clipped element.
5. Every number on the page is either typed in `stats.ts` with a `method` and `asOf`, or computed from the content modules.
6. No image path is broken, and every pending asset uses the honest placeholder frame.
7. The Lighthouse mobile run meets the section 1.6 budgets on the deployed URL, not just locally.
8. `README.md` documents the environment variables, the two commands to run, and the one place to edit content.

---

## 13. Deviations from version 1 (new)

Recorded so a future reader does not treat a deliberate change as a mistake.

| Version 1 | Version 2 | Why |
|---|---|---|
| Next.js 16.3.5 cited | 16.4.0 pinned | 16.3.5 was an advisory reference, not the current release. Registry-verified |
| shadcn/ui for primitives | Direct Radix imports | shadcn's generator writes its own theme block, which conflicts with the section 2.2 token layer and reintroduces banned radius and color values |
| MDX with frontmatter | Typed Zod-validated content modules | Turbopack and Next 16 integration risk, plus the stat grid needs to compute over the content set (section 5.5) |
| `--shadow-hard` | `--hard-shadow` | The original name collides with Tailwind's `--shadow-*` theme namespace once registered in `@theme` |
| No token-to-utility bridge | Section 2.14 | Without `@theme inline`, the dark theme does not switch |
| "section 5.4" referenced, never written | Section 5.4 written | The Instagram link table was missing |
| 11 open items listed flat | Triaged into A, B, C with defaults | Removes the ambiguity about what blocks the build |

### 13.1 Deviations found while building

These surfaced only once the site was implemented and built, and they are worth
knowing before the next edit undoes one of them.

| Version 1 | Built as | Why |
|---|---|---|
| Phosphor icons imported directly | Every icon routed through one `"use client"` module | Phosphor v2's `IconBase` calls `useContext`, so importing the package from a Server Component throws. One client boundary keeps Server Components able to render icons |
| Spec 4.1: 4 hero stickers (Python, Go, Tableau, Figma) | 3 stickers (Python, Go, Figma) | Tableau has no entry in simple-icons 16, and spec 1.1 says drop a missing brand rather than hand-draw it |
| Spec 4.4: 10 tools, branded colour | 7 tools, ink at rest and signal on hover | Excel, Tableau, and Canva have no simple-icons entry. Excel stays covered in the Deep skills accordion. On colour, spec 4.4's explicit hover instruction is more specific than the 2.2 logo exemption |
| Spec 2.8: CSS `@property` integer counter | `IntersectionObserver` plus `requestAnimationFrame` | A CSS counter can only paint through `content`, so the real number never enters the DOM and a browser that mishandles `@property` renders zero. The built version keeps the final value as real text at all times |
| `projects/*.ts`, one module per project | A single `content/projects.ts` registry | With MDX removed, one registry is the natural equivalent and avoids ten near-identical files |
| Spec 4.7: filter state through the router | `history.replaceState`, read on mount | Avoids a `useSearchParams` Suspense boundary for a filter that never needs a server round trip. `?type=research` still deep-links correctly |
| Spec 6: analytics script | A `track()` no-op wrapper at the four call sites | The Plausible script is not wired yet, so events are dispatched and safely ignored rather than requiring the script to exist |
| pnpm default isolated linking | `nodeLinker: hoisted` in `pnpm-workspace.yaml` | The isolated layout made `node_modules/next` a junction into pnpm's global virtual store, and Node could not resolve `@next/env` or `@swc/helpers` through it, so the build failed with `MODULE_NOT_FOUND`. Note that pnpm 11 no longer reads `node-linker` from `.npmrc` |
| Spec 1.2: `create-next-app` | Hand-written scaffold | `create-next-app` writes a preferences store under `%APPDATA%`, which a restricted shell denies. The resulting file tree is the one in section 1.5 |
| Spec 1.6 quality gates installed | `tsc --noEmit` only | ESLint, Playwright, and Lighthouse CI are deferred. Playwright also pulls browser binaries. `@swc/helpers` had to be added as a direct dependency, because Next requires it and the hoisted tree does not nest it |
| Spec 5.1: Leaflet map and Recharts charts | Installed but not wired | The case study pages render the full written case study; the interactive map and trend chart demos are still outstanding |

### 13.2 Round 2 requests

These came in after launch and change decisions version 2 had already settled.

| Version 2 | Built as | Why |
|---|---|---|
| Spec 2.7: nav is 64px and not sticky | Fixed, rounded, translucent glass bar, 56px with a 12px inset, compacting to 48px once the page moves, with the current section marked | Requested directly. Spec 5.3 had already parked a sticky header as a later addition, so this is that addition. The compact state comes from an IntersectionObserver on a one-pixel sentinel and the active section from a second observer over the nav targets, so spec 2.8's ban on scroll listeners still holds |
| Spec 2.5: no blur at all | `backdrop-filter` on the floating nav and the mobile sheet only | The glass request. The 2.5 ban is about blur glows as decoration; this is surface material on two floating layers |
| Spec 3: `/cv` is a redirect to the PDF | `/cv` is a real page | There is no PDF yet, HTML is searchable and linkable where a PDF is not, and one source of truth cannot drift. The page exports itself through the browser print pipeline and links a hosted PDF automatically once `public/Farrel-Frizzy-CV.pdf` exists |
| No icon or share images | `icon.png`, `apple-icon.png`, `opengraph-image.png`, and one card per project under `public/og/` | Generated by `scripts/make-icons.py` with Pillow and the real Bricolage Grotesque variable font, pinned to weight 800. Deterministic and offline after one font download, so `next build` never depends on a font CDN |
| Spec 6: analytics script not wired | Plausible loads only when `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set | Keeps a clone with no secrets free of any third-party request, and the CSP only names plausible.io when the script can actually load |
| Spec 2.10: numbered eyebrows banned | The ban is kept. No section indices were added | The techy treatment is carried by mono micro-labels, the scroll-progress rule, the active-section marker, and the glass bar, so the eyebrow budget stays unspent |
| Spec 4.4: broad skills as chips | Static spans rather than buttons | They are labels, not controls. The first version was a button carrying `pointer-events-none`, which silently disabled the very hover state it declared |
| LinkedIn URL | `https://www.linkedin.com/in/ffrizzy/` | Superseded the longer profile slug used in version 2 |

New motion added in round 2, all reduced-motion safe:

| Motion | Tool | Purpose |
|---|---|---|
| Nav entrance (drop and fade, 600ms) | CSS | First impression |
| Nav compaction on scroll | IntersectionObserver on a sentinel | Keeps the bar out of the way without a scroll listener |
| Scroll progress rule | CSS `animation-timeline: scroll(root block)` | Orientation on a long page, zero JavaScript |
| Active section underline (scaleX, 300ms) | CSS transition | Shows where the reader is |
| Marker highlight sweep (clip-path, 700ms, 350ms delay) | CSS | Draws the eye to the hero emphasis |
| Arrow nudge on hover | CSS transition | Ties an outbound link to its row |

Two notes for whoever edits the nav next:

1. **`LAYOUT.navTotal` is duplicated as a literal.** The hero is
   `min-h-[calc(100dvh-76px)]`, and that `76px` is `navTotal` written by hand,
   because a Tailwind arbitrary value must be a literal string in the source or
   the scanner never generates the rule. Changing the constant without changing
   the hero makes the nav overlap the hero by the difference.
2. **Content starts below the bar** via `main { padding-top: navTotal }`, applied
   as an inline style from the constant, so that one does stay in sync.

### 13.3 Round 4: the CV becomes the source of truth

The owner supplied the real CV. It corrected several things and exposed one
conflict.

| Before | Now | Why |
|---|---|---|
| 6 timeline entries, with roles missing entirely | 11 entries: 4 professional and 7 leadership, each with the CV's own bullets, locations, and dates | The CV has four professional roles where the site had two, and adds BEM KM Fasilkom and the earlier GDSC member term |
| Home rail showed all six | Home shows a curated 7; the CV page shows all 11 in the CV's own two sections | Eleven entries on Home pushes everything below it out of reach |
| 5 certifications, several with no source | The CV's real 7, grouped by issuer with month and year | The previous list contained fabricated entries: "watsonx.ai Foundations", "MSIB Batch 7 Program", "Data analysis coursework", and "Information Systems fundamentals" appeared in no source document. They were invented to fill the structure, and that is a correctness failure, not a placeholder |
| IBM Generative AI and ML as a four-month experience entry | A certification, per the CV | Confirmed by the owner |
| Education: institution, GPA, graduation date | Adds "Bachelor of Information Systems" and the two coursework bullets | Straight from the CV |
| Broad skills: 7 loose terms including "IT" and "Creativity" | The CV's Content and Communications plus Leadership and Operations terms, 11 in total | "IT" and "Creativity" were not claims the CV makes |
| Deep skills: 8 | 11, adding watsonx.ai, AI Prompting, and Data Visualization, each mapped to a project tag | Keeps the orphan check meaningful rather than decorative |
| No professional summary | The CV's summary, transcribed | |

**The conflict, recorded.** The CV states "3rd Winner, Redesign Challenge, GDSC
2024". This spec (section 9.1, marked resolved) and everything already published
say "2nd Winner". The owner confirmed **2nd is correct and the CV carries the
typo**, so the site, this spec, and the project page all keep 2nd. If the CV is
reissued, fix the CV rather than the site.

**One deliberate omission.** The CV header lists a phone number. Section 9.1 says
it is not published and the repository is public, so it appears nowhere: not on
Home, not on the CV page, and not in any metadata. Confirmed by the owner. Email
and LinkedIn remain the contact routes.

**How the CV was read.** No PDF library was installed and the package index was
unreachable, so the text was extracted with a standard-library script:
decompress the FlateDecode content streams, then reassemble positioned text from
the `TJ` and `Tj` operators grouped by Y coordinate. The text layer turned out to
be simple-encoded, so no CMap work was needed.

### 13.4 Round 4 bug fixes

| Symptom | Cause | Fix |
|---|---|---|
| Nav links did nothing on `/cv` and on case study pages, stranding the reader on the page they were already on | The targets are anchors on the one long Home page, and off Home the links stayed bare fragments such as `#all`. A browser cannot scroll to an id that does not exist on that document, so the click was silently a no-op | Links become absolute (`/#all`) whenever the path is not `/` |
| Nav sat flush against the top of the viewport | `LAYOUT.navOffset` was 12 but was never applied to the markup: the glass bar carried no top margin at all, so the constant was decorative | `mt-5` added, and the offsets corrected to `navOffset: 20`, `navTotal: 76`, `anchorOffset: 104` |
| The tools strip looked cropped | The marquee is duplicated and translated by exactly `-50%`, which is seamless only while half the track is at least as wide as the viewport. With two copies the track came to about 1230px against a container of about 1216px, so as it scrolled the track ran out and left a few hundred pixels of empty space at the trailing edge | Six copies instead of two, putting half the track near 1850px, plus a gradient mask so a logo dissolves at the edge instead of being sliced mid-letterform |

### 13.5 Round 5: events, the conference, and the last two links

This closes the last two open items in section 9.2: item 3, the events total, and
item 11, the Google Maps and Google Dorking post URLs.

| Before | Now | Source |
|---|---|---|
| The events stat read `2+` because only two events could be named | `23+`: 2 flagship festivals with over 2,000 attendees each, 1 national conference, and 20 or more webinars, seminars, and sharing sessions across GDSC and BEM | Stated by the owner |
| Two named events driving the tick chart | Six named events, adding Sriwijaya Digital Conference 2024 and the GDSC sharing session | Owner, plus the conference deck |
| Two Instagram slides rendered with no link at all | All four carry their real post URL and date | URL from the owner, date decoded from the shortcode |
| Nothing about the national conference | An "Event Concept and Session Author" role: authored the concept name and the session titles and themes for Sriwijaya Digital Conference 2024, billed as The Biggest Digital Conference in South Sumatera, held 19 to 20 October 2024 at Hotel Swarna Dwipa | Extracted from the pitch deck |
| No speaking credit | A "Speaker, Sharing Session on Media and Creative" role for GDSC internals | Owner, dated from the post |

**The events number is a floor, and it is still computed.** `eventTotals` holds
the breakdown (2 festivals, 1 conference, 20 or more smaller events) and
`lib/content.ts` sums it, so the stat is derived rather than typed and keeps its
lower-bound plus. A build-time check refuses a state where more events are named
individually than the stated total.

**How the conference details were obtained.** The pitch deck is a presentation
export: its fonts are subsets with custom encodings, and its resource
dictionaries are packed into compressed object streams, so neither a resource
name nor a font object can be trusted as a key. The text was recovered by
collecting every ToUnicode CMap in the file and choosing, per text block, the
CMap that decodes that block most like language, using the fact that the most
frequent byte in prose is the space as the tie-breaker. That read 68 of 114
blocks confidently, which was enough for the name, tagline, dates, and venue.

It is not a full transcription, so the session list on the site is deliberately
partial: only session titles that came out cleanly are quoted. The deck is not
committed to the repository, being 46 MB and containing sponsor and internal
material.

**Instagram post dates** are decoded from the shortcodes. An Instagram media id
carries its creation time in its high bits and the shortcode is that id encoded
in base64, so the real post date is recoverable without asking. All four writing
slides now show theirs.

### 13.6 Round 6: the map, the charts, and the bundle regression they exposed

| Before | Now | Why |
|---|---|---|
| Leaflet and Recharts installed but unwired | A sample report map on the KITO case study, and two index charts on a new SDC case study | Spec 5.1 asked for both, and the conference deck supplied real figures to plot |
| 11 projects | 12, adding `sdc-2024` | Its own case study is the right home for the concept work and the index data behind it |
| A chart with nothing real to show | The charts plot the deck's own figures: South Sumatra ranked 21st, 23rd, 19th, and 22nd from 2021 to 2024, and the 2024 peer scores | A chart of real numbers is worth more than a mock trend line, and the deck is a primary source |
| Two accessibility obligations unmet | Both interactive pieces carry a summary and a data table behind a disclosure | Spec 2.11 requires a text equivalent for a map and a chart |

**Implementation notes that matter.**

- Rank is plotted on a **reversed** axis on the trend chart. Rank 1 is the best
  result, so a normal axis would draw an improvement as a fall.
- The map uses `CircleMarker`, not Leaflet's default `Marker`. The default marker
  loads PNG icon assets whose URLs break under a bundler, which is the usual
  reason a Leaflet map appears as an empty grey box in Next.js.
- The map is wrapped in a Client Component that calls `next/dynamic` with
  `ssr: false`, because that option is only permitted inside a Client Component
  and the case study layout is a Server Component.
- The points are invented and the interface says so three times. Spec 5.1
  requires mock data to be labelled rather than passed off as real reports.

**The bundle regression, and the fix.** Loading the case study pages proved that
`WorkList` was a Client Component importing the content layer. That pulled the
entire project catalogue, every case study's prose included, plus Zod, into the
JavaScript every visitor downloads. It was confirmed by finding the KITO case
study text inside a chunk the Home page executes, and it contradicted the
170 KB budget in spec 1.6.

The fix moves the filter vocabulary into `src/lib/work-filters.ts`, which holds
no project data, and passes the rows to `WorkList` as a prop from the Server
Component instead of having it import them. The `WorkRow` type is imported as a
type only, so it is erased at build time. After the change the catalogue prose is
absent from every chunk the Home page executes, while the list still renders all
twelve rows.

The rule this establishes: **a Client Component may import types from
`lib/content`, never values.** Values come down as props.

### 13.7 Rendering confirmed in a real browser

Chrome will not start inside the project's confined shell. Its IPC uses Windows
named pipes, so it exits with `FATAL:mojo platform_channel.cc: Access is denied`
before drawing anything, and no combination of crash-reporter flags avoids it.
Run headlessly with full access, the pages were rendered and inspected as images
rather than inferred from HTML:

- **The report map draws.** OpenStreetMap tiles resolve across Palembang, the
  category-coloured circle markers are placed, Leaflet's zoom control and
  attribution line are present, and the category filter chips render.
- **Both index charts draw to completion.** The rank line connects all four
  years with the reversed axis correctly placing 19th above 23rd, and the grouped
  bars show 2023 against 2024 with South Sumatra highlighted in signal.
- **The Home page is correct in dark mode**, which is also the evidence that the
  pre-paint theme script runs: the floating bar has its top gap, the progress rule
  sits under it, and the marker highlight, taped portrait, and stickers all place.

Two findings came out of that run.

1. **Recharts ignores `prefers-reduced-motion`.** Its marks animate with
   `requestAnimationFrame` and it never consults the media query, so every chart
   animated for a reader who had asked for no motion. That is a spec 2.8
   violation, and it lands on the substance of the chart rather than on a
   flourish, because the bars and the line *are* the data. Both charts now pass
   `isAnimationActive={!reduceMotion}`.
2. **A headless capture taken during the draw-in shows flat bars and a
   half-drawn line.** That is a timing artifact, not a rendering fault, and it is
   why the verification run forces reduced motion: it makes the capture
   deterministic and doubles as the test for finding 1.

Screenshots and DOM dumps from that run are working files under
`.chrome-profile-*` and `.shots` at the workspace root. None of it is committed.

### 13.8 Round 7: a browser audit, generated artwork, and the list rebuilt

The site was audited in a real browser at 1440 and 390 wide, in both themes,
section by section, with the theme switch, the project filter, the carousel, and
the map filter all exercised rather than assumed. The method is `puppeteer-core`
installed outside the repository at `.tools/pptr`, driving the installed Chrome,
so it never becomes a shipped dependency.

| Problem the audit found | Fix |
|---|---|
| Every image slot was a grey `ARTWORK PENDING` frame, and `public/textures/paper.webp` did not exist, so the texture layer 404'd on every page and the zine layer was invisible | `scripts/make-artwork.py` draws the paper texture, one cover per project, the portrait card, and four Instagram cards. These are drawn, not imitations of a screenshot, which is what 2.9 forbids |
| Section 4.7 was twelve flat rows of text, with the type reduced to dim mono at the far right | Rebuilt as an index: position, a type icon from the set 2.13 already assigns, the outcome, and the type and period together, with the chips carrying their counts |
| The GPA stat read `3.97 /` on one line and `4.00` on the next | The `/ 4.00` moved into a new `qualifier` field, rendered smaller and muted beside the number, so the digits can never wrap away from their unit |
| Nine `cover:` paths named files that never existed, including `djournl-home.webp`, `portal-map.webp`, and `rice-clusters.webp` | One cover per slug, `/images/<slug>.webp`, so the bento and the case studies resolve, and a real screenshot replaces a stand-in by filename alone |

Two notes on method, because both cost time and both will recur:

- **A headless element screenshot draws the fixed header over the element.** The
  overlap that appears at the top of a section capture is an artifact, not a bug.
  Measuring the geometry after a real nav click settles it: the heading lands at
  201 px with the nav ending at 68 px, so it is clear.
- **A test can rot while the code is fine.** The filter check matched a chip by
  exact text, which broke the moment the chips gained counts, and it reported a
  regression that did not exist. A test that keys on rendered text needs the same
  care as the code it checks.

After the round the audit reports no missing assets, and everything it exercises
passes: theme switch, filter (12 rows to 4, with `?type=research` in the URL),
carousel, and map filter (10 markers to 2), with no image missing alt text, no
unlabelled control, exactly one `h1`, and no heading level skips.

One caveat is recorded rather than fixed. Every cover is a drawn stand-in, so the
site currently shows no real interface anywhere. Section 14.2 lists exactly what
to capture and where each file goes.

### 13.9 Round 8: real assets

The author supplied a portrait, a Turnstile site key, and sources for the projects.
Seven covers are now real captures or real figures rather than drawn stand-ins.

| Project | Cover now | Source |
|---|---|---|
| Djournl | Live app screenshot | `djournl.up.railway.app`, captured at 1600x1000, 305 KB PNG to 35 KB WebP |
| KITO Portal Publik | drawn | the dev server at `192.168.1.106:3000` was not reachable |
| Aid Distribution Dashboard | Live Tableau dashboard | the `public.tableau.com` embed form, which hides Tableau's own chrome |
| watsonx Generative AI App | drawn | kept drawn at the author's request |
| IMDB Sentiment Capstone | Training curves | extracted from the project notebook |
| Rice Production Clustering | K-Means elbow plot | extracted from the paper DOCX |
| TOPSIS vs SMART | Method flowchart | extracted from the paper PDF |
| COBIT 2019 Hospital Audit | Method flowchart | extracted from the paper PDF |
| SAT SET | Figma prototype | public proto, cropped to the frame |
| Redesign Challenge Backend | drawn | the Instagram post needs a session |
| Sriwijaya Digital Conference | drawn | the Instagram profile needs a session |

Method notes worth keeping:

- **Figures come out of the source files, not off the screen.** A notebook stores
  its rendered charts as base64 PNG inside its JSON, so they extract at full
  resolution. A DOCX is a zip and its images sit in `word/media/`. A PDF usually
  embeds figures as image XObjects, and `DCTDecode` streams are already JPEG. Only
  2 of 8 image objects in the TOPSIS paper and 5 of 6 in the COBIT paper were large
  enough to be figures rather than fragments.
- **A figure from a paper must not be dropped in raw.** It arrives as a bare chart
  on a white field, which reads as a screenshot of someone else's document.
  `scripts/mount-figures.py` mounts each one on the design system's paper inside a
  rule, with its title and a caption, so it speaks the same plate language as the
  drawn covers.
- **The COBIT PDF also contained a group photograph of identifiable students in a
  laboratory.** It was not used and will not be. Publishing photographs of other
  people needs their consent, and a paper being public does not supply it.
- **An Instagram post and a profile both present a session wall**, so those two
  remain drawn. No attempt was made to get past it.
- **Figma letterboxes the prototype on black and runs a cookie bar across the full
  bottom edge.** That bar is bright, so detecting the content box reports the full
  width and the crop then slides sideways, clipping the navigation. The prototype
  rectangle has to be given explicitly.

**The 88 percent claim was checked and holds.** The site says the capstone
classifies sentiment with 88 percent accuracy, while the notebook's first epoch
reads `0.7212`, which looks like a contradiction. It is not one: epoch 1 is not
the result. The final evaluation reads `accuracy: 0.8800` over 2,491 test reviews,
and the best validation accuracy reached `0.8778`.

**Turnstile is wired but does not render on 127.0.0.1.** The site key is inlined
into the client chunk correctly and the Turnstile script loads, but Cloudflare
answers the challenge platform with HTTP 400 and no iframe is created. That is the
signature of a site key whose allowed hostnames exclude the host being served, so
the key is most likely restricted to the deployment domain. Two consequences: the
deployment domain must be in the key's allowlist, and `TURNSTILE_SECRET_KEY` must
be set in the host environment, because the contact route skips verification
entirely without it. As shipped, the widget is in the bundle and enforcing nothing.

---

## 14. Asset manifest (new)

Every image the build expects, with the exact filename and the required size. Until a file exists at the listed path, its slot renders the `PendingImage` frame from section 2.9.

**The table below is the original plan and is superseded for live paths.** What the build actually requests today is in 14.1 and 14.2, where each project's cover is `/images/<slug>.webp`. The names here that differ from that convention, such as `djournl-home.webp` and `portal-map.webp`, are no longer referenced by any code.

| Path | Size | Source | Notes |
|---|---|---|---|
| `public/textures/paper.webp` | 1600 x 1000, under 150 KB | Deck background image | Global texture layer |
| `public/images/portrait.webp` | 4:5 | Deck slide 2 | Hero, `priority` |
| `public/images/djournl-home.webp` | 16:10 | Live app | Bento cell A |
| `public/images/djournl-dark.webp` | 16:10 | Live app | Case study gallery |
| `public/images/djournl-loop.mp4` | under 2 MB, muted | Live app screen recording | Case study, replaces embedding the app |
| `public/images/portal-map.webp` | 16:10 | Local run | Bento cell B and case study |
| `public/images/portal-scorecard.webp` | 16:10 | Local run | Case study |
| `public/images/aid-dashboard.webp` | 16:10 | Deck slide 7 or Tableau export | Bento cell C |
| `public/images/rice-clusters.webp` | 16:10 | Deck slide 7 or 8 | Bento cell D |
| `public/images/sat-set.webp` | 16:10 | Deck slide 8 (Figma) | Bento cell E |
| `public/images/cobit.webp` | 16:10 | Deck slide 8 | Case study |
| `public/images/watsonx.webp` | 16:10 | Screenshot | Case study |
| `public/images/imdb-pipeline.webp` | 16:10 | Deck slide | Case study |
| `public/images/ig-maps.webp` | 4:5 phone crop | Instagram | Writing slide |
| `public/images/ig-dorking.webp` | 4:5 phone crop | Instagram | Writing slide |
| `public/images/ig-lens.webp` | 4:5 phone crop | Instagram | Writing slide |
| `public/images/ig-translate.webp` | 4:5 phone crop | Instagram | Writing slide |
| `public/Farrel-Frizzy-CV.pdf` | | CV export | Target of `/cv` |

Compression rule: any source image over 400 KB is converted to WebP before it enters `public/`. The 7 MB deck originals never ship.

### 14.1 Generated stand-ins, which exist now

Section 2.9 forbids div-based fake screenshots, so the empty slots are not filled
with imitation interfaces. They are filled with drawn typographic covers instead,
produced by `scripts/make-artwork.py`: lettering, rules, and geometry on paper, in
the design system's own language. Replacing one is a file drop at the same path
with no code change.

| Path | Size | What it is |
|---|---|---|
| `public/textures/paper.webp` | 1600 x 1000, 174 KB | Procedural paper fibre, drawn with numpy and Pillow |
| `public/images/portrait.webp` | 800 x 1000 | A monogram card, captioned as a pending portrait |
| `public/images/<slug>.webp` | 1600 x 1000 | One cover per project, eleven of them |
| `public/images/ig-<slug>.webp` | 1080 x 1350 | Four Instagram post cards |

### 14.2 Replacing them with real captures

| Drop in at | What to capture |
|---|---|
| `public/images/djournl.webp` | The journal's home screen |
| `public/images/portal-publik.webp` | The report map and the agency scorecard |
| `public/images/aid-dashboard.webp` | The Tableau dashboard |
| `public/images/watsonx-genai-app.webp` | The Streamlit interface |
| `public/images/imdb-sentiment-bilstm.webp` | Training output or a confusion matrix |
| `public/images/rice-clustering.webp` | The cluster plot |
| `public/images/topsis-smart.webp` | The ranking comparison |
| `public/images/cobit-audit.webp` | The capability table |
| `public/images/sat-set.webp` | The Figma dashboard frames |
| `public/images/redesign-challenge.webp` | The API responding |
| `public/images/sdc-2024.webp` | A photograph of the conference, once one is licensed |
| `public/images/<slug>-2.webp` and `-3.webp` | Case study gallery extras. The layout already looks for these and shows labelled pending frames until they arrive |
| `public/images/portrait.webp` | A real portrait |
| `public/Farrel-Frizzy-CV.pdf` | The CV export, which turns the `/cv` download button live |

---

## 15. Security (added in round 3)

Version 2 said nothing about security. This section is now normative: a change that
weakens a control here is a regression, not a style choice.

### 15.1 OWASP Top 10 coverage

| OWASP 2021 | Control | Lives in |
|---|---|---|
| A01 Broken access control | The contact endpoint refuses cross-site submissions using `Sec-Fetch-Site`, then `Origin` versus `Host` | `src/app/api/contact/route.ts` |
| A02 Cryptographic failures | HSTS `max-age=63072000; includeSubDomains`. No server-only secret reaches the client bundle | `next.config.ts` |
| A03 Injection | Mail header values collapse to one line. Strict Zod schemas reject unknown fields. The JSON-LD payload is escaped before `dangerouslySetInnerHTML` | `src/lib/contact-schema.ts`, `src/app/layout.tsx` |
| A04 Insecure design | Bounded rate-limit map, 8 KB body cap, 5 s verification timeout, silent-success honeypot | `src/app/api/contact/route.ts` |
| A05 Security misconfiguration | OWASP header baseline. `X-Powered-By` suppressed. CSP with a per-request nonce, no `unsafe-inline` for scripts | `next.config.ts`, `src/proxy.ts` |
| A06 Vulnerable components | `pnpm audit --prod` clean. Framework and renderer pinned exactly | `package.json` |
| A07 Identification and authentication | Not applicable. No accounts, sessions, or credentials exist |
| A08 Software and data integrity | Lockfile committed. One optional third-party script, origin-restricted. No SRI, for the reason in 15.4 | `src/app/layout.tsx` |
| A09 Logging and monitoring | Security events are logged. Addresses and bodies are not | `src/app/api/contact/route.ts` |
| A10 SSRF | One outbound request to a fixed Cloudflare URL. Any future configurable fetch needs an allowlist |

### 15.2 The one accepted cost

`script-src` no longer allows `'unsafe-inline'`. It carries a per-request nonce
issued by `src/proxy.ts`, which is what Next.js 16 renamed Middleware to. **A nonce
changes every request, so `/`, `/cv`, and `/work/[slug]` are served per request
instead of being prerendered as static HTML**, and Next applies
`Cache-Control: private, no-cache, no-store`. That caching change is load-bearing:
a shared cache holding one visitor's page would hand the next visitor a stale
nonce, and every script in that document would be blocked.

This trades static rendering for the removal of `unsafe-inline`. It was accepted
deliberately, and it is reversible in one action: delete `src/proxy.ts` and the
site returns to prerendering with the weaker policy.

Only these stay static, because they contain no script tag: `icon.png`,
`apple-icon.png`, `opengraph-image.png`, `robots.txt`, `sitemap.xml`.

### 15.3 Rules that must hold when you edit

1. **The CSP is set in exactly one place.** `next.config.ts` must never also send a
   `Content-Security-Policy`. Two policies are both enforced, and their
   intersection silently breaks the site.
2. **Next reads the nonce from the request header**, specifically
   `headers['content-security-policy']`. The policy therefore has to be set on the
   forwarded request as well as the response.
3. **A library that injects a raw inline `<script>` must be given the nonce.** CSP
   blocks a parser-inserted inline script with no nonce. next-themes does exactly
   this with its pre-paint theme script, which is why `ThemeProvider` carries
   `nonce={nonce}`. Without it the theme attribute is not set until hydration and
   the flash returns. Verified: the served HTML went from 1 nonce-less script to 0
   after that prop was added.
4. **New third-party scripts go through `next/script`**, or their origin is added
   to `script-src`. `strict-dynamic` means an allowlisted host is not enough on
   its own for a parser-inserted tag.
5. **The honeypot field must not be constrained to empty in the schema.** Doing so
   makes a filled honeypot fail validation and answer 400, which tells the bot it
   was caught. The route answers a silent success instead.

### 15.4 Residual risks

| Risk | Why it is accepted | How to close it |
|---|---|---|
| The rate limiter keys on `x-real-ip`, then the last `x-forwarded-for` entry | A portfolio has no durable store to count against. Turnstile does not depend on the header | Move the limit into the host's edge config or a KV store |
| Turnstile is skipped when `TURNSTILE_SECRET_KEY` is unset | Keeps a fresh clone useful, per 1.4 | Set the key in production |
| The analytics script carries no Subresource Integrity hash | Plausible serves an unversioned `script.js`, so a hash breaks on their next release | Self-host the script |
| HSTS omits `preload` | It is a long-lived commitment over the domain and all subdomains | Add it once the domain is final |
| The CSP keeps `style-src 'unsafe-inline'` | Style attributes cannot carry a nonce. This does not permit script execution | Nothing better exists without dropping inline styles entirely |

### 15.5 Reporting

`public/.well-known/security.txt` follows RFC 9116 with a contact and an expiry.
`Canonical` and `Policy` are deliberately omitted until the production domain is
fixed, because both require an absolute URL and a wrong one is worse than none.

---

## 16. The JavaScript budget, revised against measurement

Section 1.6 set the home page first-load JavaScript budget at 170 KB gzipped. Measured against the deployed site with a cold cache, that figure is not reachable, and no application-level work makes it reachable.

| Page | Measured | Before the deferrals |
|---|---|---|
| `/` | 302 KB | 299 KB |
| `/cv` | 186 KB | 185 KB |
| `/work/portal-publik` | 241 KB | 348 KB |
| `/work/djournl` | 194 KB | 301 KB |

The case study routes fell by roughly 100 KB once the chart and map panels moved behind dynamic imports. That is the change that worked. The home page did not move, and the reason is structural: the form libraries and Motion share one eager chunk, and Motion is still required on first load by the work list and the carousel. Deferring the contact form removes only its share of a chunk that has to load anyway.

Beneath the route code is a floor the application does not control. The framework shell plus polyfills measured 172,449 B gzip, of which 39,520 B is a core-js polyfill set shipped to every route. Adding a modern `browserslist` target to package.json, the documented lever for dropping it, did **not** measurably reduce the result: the polyfill chunk still appears on every route at about 45 KB.

**The 170 KB budget is therefore withdrawn and replaced by a regression guard.** A budget exists to catch growth. A number already exceeded by the framework, before any application code loads, cannot do that. Set the replacement from measurement rather than aspiration, using the table above as the baseline.

The only remaining lever of real size is Motion. Its projection system is reached from the work list's `layout` prop and the carousel's `drag`. Replacing those with CSS visibility plus a transform transition, and pointer events instead of drag, would take Motion out of the first load entirely. Both are genuine changes to animation behaviour and neither has been attempted.
