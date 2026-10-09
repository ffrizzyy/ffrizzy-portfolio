# ffrizzy-portfolio

The portfolio site described by `docs/BUILD-SPEC.md` (version 2). One long
Home page with ten sections, plus a case study route, system pages, and a
contact form.

## Requirements

- Node 22 or newer (built and verified on Node 24.21.0)
- pnpm 11

## Install and run

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

```bash
pnpm build       # runs the copy check, then the production build
pnpm start       # serve the production build
pnpm typecheck   # tsc --noEmit, the authoritative type gate
pnpm check:copy  # spec 2.10: fails on any em-dash or en-dash in src/
python scripts/make-icons.py  # regenerate favicon, apple icon, and OG cards
```

`pnpm build` deliberately runs `check:copy` first. Spec 2.10 bans em-dashes and
en-dashes in visible copy, and a rule that is only checked by eye stops being
true after the tenth edit, so the build fails instead.

No environment variables are required to run it. With no secrets the contact
route validates the payload and returns a labelled development response instead
of sending mail. Copy `.env.example` to `.env.local` when you want real delivery.

## Four things about this checkout that will bite you if you change them

**1. `pnpm-workspace.yaml` sets `nodeLinker: hoisted`, and it is load-bearing.**

pnpm 11 defaults to an isolated layout that creates `node_modules/next` as a
junction into pnpm's global virtual store. On this Windows setup Node could not
resolve Next's own dependencies (`@next/env`, `@swc/helpers`) through that
junction, and `next build` failed with `MODULE_NOT_FOUND`. Hoisted linking
produces a flat, junction-free tree. Also note that pnpm 11 no longer reads
`node-linker` from `.npmrc`, so the setting has to live in
`pnpm-workspace.yaml`.

**2. Every icon goes through `src/components/shared/Icon.tsx`.**

Phosphor v2's `IconBase` calls `useContext`, so importing
`@phosphor-icons/react` from a Server Component throws. That file is the single
`"use client"` boundary which re-exports the allowed icon set. Add new icons
there, not by importing the package directly into a component.

**3. A Tailwind arbitrary value must be a literal string in the source.**

The hero is `min-h-[calc(100dvh-68px)]` and that `68px` is `LAYOUT.navTotal`
written out by hand. Interpolating it, as in
`` `min-h-[calc(100dvh-${LAYOUT.navTotal}px)]` ``, produces a class name Tailwind
never sees while scanning, so no CSS is generated and the rule silently does
nothing. If you change `navTotal`, change the hero too, or the nav will overlap
the hero by the difference.

**4. A Client Component may import types from `lib/content`, never values.**

`lib/content.ts` validates and assembles the whole catalogue, case study prose
included. A Client Component importing a value from it drags that entire
catalogue into the JavaScript every visitor downloads. This actually happened:
`WorkList` imported its rows from there, and the KITO case study text could be
found inside a chunk the Home page executes.

The rule is that values come down as props from a Server Component. The one
shared vocabulary a client needs, the `#all` filter list, lives in
`src/lib/work-filters.ts`, which holds no project data by design.

## Where content lives

All copy and data is in `src/content/`, validated by Zod at import time. An
invalid record fails the build with a field-level error rather than rendering an
empty box.

| File | Holds |
|---|---|
| `src/content/projects.ts` | The ten projects, their outcome lines, and the case study bodies |
| `src/content/site.ts` | Stats, timeline, events, awards, certifications, growth slides, writing, skills, tools, KITO copy |
| `src/content/schema.ts` | The Zod schemas and inferred types |
| `src/lib/content.ts` | Validation, computed stats, the derived skills map, and the `#all` row list |

Experience, education, certifications, the professional summary, and the CV
page's skill categories are transcribed from the owner's CV document. The Home
About rail is a curated subset of seven; the CV page carries the full list of
eleven roles in the CV's own two sections.

**The phone number in the CV header is deliberately not published.** Spec 9.1
says so and this repository is public, so it appears in no content module, no
page, and no metadata. Email and LinkedIn are the contact routes.

Derived rather than typed, so they cannot drift:

- The **projects** stat counts `content/projects.ts`.
- The **events** stat sums the breakdown in `eventTotals`: 2 flagship festivals,
  1 national conference, and 20 or more smaller events. The last figure is a
  stated floor, so the stat keeps its lower bound and renders as `23+`. A
  build-time check refuses a state where more events are named individually than
  the stated total.
- The **type breakdown** and the stacked-bar illustration come from the project
  types.
- The skills map "Used in" lists come from each project's `tags`. A skill that
  resolves to nothing fails the build, which is how a rename gets caught.

## Assets are not in yet

No artwork exists in `public/` yet, so every image slot renders the honest
placeholder frame from spec 2.9: a paper-sunken panel showing the expected
filename and pixel size. Spec 2.9 forbids div-based fake screenshots, so the
placeholder deliberately does not imitate one.

The full list of expected paths and sizes is section 14 of
`docs/BUILD-SPEC.md`. In development, the Home page also logs a single
warning listing every missing asset.

Artwork that is not a photograph is already committed, because it is generated
rather than photographed: `src/app/icon.png`, `src/app/apple-icon.png`,
`src/app/opengraph-image.png`, and one share card per project under `public/og/`.
Regenerate them all with `python scripts/make-icons.py`, which renders real
Bricolage Grotesque letterforms with Pillow. It makes no network request once the
font is cached under `scripts/.fonts/`, so `next build` never depends on a font
CDN.

## Deviations from the spec

Recorded so a deliberate change is not mistaken for a mistake. Section 13 of the
spec document tracks the same list.

| Spec | Built as | Why |
|---|---|---|
| shadcn/ui primitives | Direct Radix imports | shadcn's generator writes its own theme block, which fights the token layer and reintroduces banned radius and colour values |
| MDX case studies | Typed Zod-validated content modules | Turbopack and Next 16 MDX wiring is a build-level risk, and the stat grid needs to compute over the content set |
| `--shadow-hard` | `--hard-shadow` raw token, `shadow-hard` utility | The original name collides with Tailwind's `--shadow-*` theme namespace |
| Four hero stickers | Three (Python, Go, Figma) | Tableau has no entry in simple-icons 16; spec 1.1 says to drop a missing brand rather than hand-draw it |
| Ten tools in the strip | Seven | Excel, Tableau, and Canva have no simple-icons entry. Excel is still covered in the Deep skills accordion |
| Brand logos in native colour | Ink at rest, signal on hover | Spec 2.2 exempts logos, but spec 4.4 specifically asks the strip to turn signal on hover. The more specific rule wins |
| CSS `@property` count-up | `IntersectionObserver` plus `requestAnimationFrame` | The CSS counter can only paint through `content`, so the real number would never be in the DOM. This keeps the final value as real text at all times |
| `content/projects/*.ts` | One `content/projects.ts` registry | With MDX gone, a single registry is the natural equivalent and avoids ten near-identical files |
| Analytics through a script tag | Conditionally loaded Plausible plus the `track()` wrapper | The script loads only when `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set, so a clone with no secrets makes no third-party request at all |
| Spec 2.7 nav: 64px, not sticky | Fixed, rounded, translucent glass bar that compacts on scroll and marks the current section | Requested directly, and spec 5.3 had already listed a sticky header as a later addition. Both the compact state and the active section come from IntersectionObserver, so spec 2.8's ban on scroll listeners still holds and nothing runs per frame |
| Spec 2.5: no blur | `backdrop-filter` on the floating nav and the mobile sheet only | The glass request. Blur is confined to those two surfaces and is never used as the blur glow that 2.5 bans |
| Spec 3: `/cv` redirects to the PDF | `/cv` is a real page | There is no PDF yet, HTML is searchable and linkable where a PDF is not, and one source of truth cannot drift the way a second document does. The page exports itself through the browser print pipeline and links a hosted PDF automatically once one exists |
| Spec 2.10: numbered eyebrows banned | Kept the ban; no section indices added | Techy styling was done with mono micro-labels, the scroll rule, and the glass bar instead, so the eyebrow budget stays unspent |
| Spec 4.4 broad-skill chips | Static spans, not buttons | They are labels, not controls. The first version was a button with `pointer-events-none`, which silently disabled the hover state it declared |

## Not built yet

These are in the spec and intentionally unfinished, listed so nothing looks
accidentally done:

- **ESLint, Playwright, and Lighthouse CI.** The spec lists them as quality
  gates. `tsc --noEmit` is the gate that runs here. Installing Playwright also
  pulls browser binaries, which is why it was left out.
- **GitHub metadata fetching** and **Sentry**, both marked optional in the spec.

Wired since the first draft: the **Leaflet report map** on the KITO case study
and the **Recharts index charts** on the Sriwijaya Digital Conference case study,
each behind a lazy boundary so neither library reaches the Home page.

## Artwork

Every image on the site is generated, not photographed, and the generator is in
the repository:

```
python scripts/make-artwork.py
```

It draws the paper texture, one typographic cover per project, the portrait card,
and the four Instagram cards. They are lettering and geometry on paper rather
than imitations of a screenshot, which the spec forbids, and they exist so no slot
is an empty grey box.

**To put a real screenshot in, drop the file over the same path.** A project's
cover is always `/images/<slug>.webp`, so replacing `public/images/azzifa.webp`
with a capture of the app needs no code change. Case study galleries additionally
look for `<slug>-2.webp` and `<slug>-3.webp`. The spec's section 14.2 lists what
to capture for each project.

One caveat worth stating plainly: as shipped, **no image on this site is a real
screenshot**. They are all drawn stand-ins.

Both were then rendered in headless Chrome and inspected as images, which is how
two things were caught: the map and charts do draw, and **Recharts ignores
`prefers-reduced-motion`**, so its marks animated for readers who asked for no
motion. Both charts now pass `isAnimationActive={!reduceMotion}`.

If you re-run a headless capture, force reduced motion
(`--force-prefers-reduced-motion`). Without it you will photograph the charts
mid-animation and they will look broken.

## Security

Hardened against the OWASP Top 10 (2021). What is in place, and where:

| OWASP | Control | Where |
|---|---|---|
| A01 Broken access control | The contact endpoint refuses cross-site submissions, using `Sec-Fetch-Site` and an `Origin` versus `Host` comparison | `src/app/api/contact/route.ts` |
| A02 Cryptographic failures | Two-year HSTS with `includeSubDomains`. No server-only secret is readable by the client, confirmed by scanning the built chunks | `next.config.ts` |
| A03 Injection | Mail header values are collapsed to a single line, unknown fields are rejected by a strict schema, and the JSON-LD payload is escaped before `dangerouslySetInnerHTML` | `src/lib/contact-schema.ts`, `src/app/layout.tsx` |
| A04 Insecure design | Bounded rate limit, 8 KB body cap, 5s verification timeout, and a honeypot that returns a silent success | `src/app/api/contact/route.ts` |
| A05 Security misconfiguration | Full OWASP header baseline, `X-Powered-By` suppressed, and a CSP with a per-request nonce and no `unsafe-inline` for scripts | `next.config.ts`, `src/proxy.ts` |
| A06 Vulnerable components | `pnpm audit --prod` reports no known vulnerabilities; `next` and `react` are pinned exactly | `package.json` |
| A07 Auth failures | Not applicable. There are no accounts, sessions, or passwords |
| A08 Integrity failures | Lockfile committed; the single third-party script is optional and origin-restricted. See the residual risk below |
| A09 Logging failures | Security events are logged. Addresses and message bodies are not | `src/app/api/contact/route.ts` |
| A10 SSRF | The only outbound request is to a fixed Cloudflare verification URL. A future configurable fetch would need an allowlist |

### The one real cost of this

`script-src` no longer permits `'unsafe-inline'`. It uses a per-request nonce from
`src/proxy.ts`. A nonce changes on every request, so **`/`, `/cv`, and
`/work/[slug]` are now rendered per request rather than prerendered as static
HTML**, and Next switches them to `Cache-Control: no-store`. That caching change
is not optional: a cached page would carry a stale nonce and every script in it
would be blocked.

If you would rather have static rendering back, delete `src/proxy.ts`. You get
prerendering, and unavoidably `script-src 'unsafe-inline'` with it.

### Three ways to break the policy without noticing

1. **A new third-party script will be blocked.** Adding a plain
   `<script src="https://other.example">` fails under `strict-dynamic` and a
   nonce policy. Load it through `next/script`, which receives the nonce, or add
   its origin to `script-src` in `src/proxy.ts`.
2. **A library that injects its own inline script needs a nonce.** This is
   exactly what bit next-themes: its pre-paint theme script is a raw `<script>`,
   and CSP blocks a parser-inserted inline script that has no nonce. It is passed
   `nonce={nonce}` in `src/app/layout.tsx`. If the theme ever starts flashing on
   load again, check that prop first.
3. **Inline `style` attributes are still allowed.** Style attributes cannot carry
   a nonce, so `style-src` keeps `'unsafe-inline'`. That does not permit script
   execution.

### Residual risks, stated rather than hidden

- **The rate limiter trusts a header.** It keys on `x-real-ip` and otherwise the
  last `x-forwarded-for` entry, so a client able to set those can evade the
  limit. Turnstile is the control that does not depend on it, and a durable limit
  belongs in the host's edge configuration. This was tested: with distinct
  `x-real-ip` values each request gets its own bucket, and with a fixed value the
  sixth request is refused with a 429.
- **Turnstile is optional.** With no `TURNSTILE_SECRET_KEY` the spam check is
  skipped entirely and only the honeypot and the rate limit remain. Set the key
  in production.
- **The analytics script has no SRI.** Plausible serves an unversioned
  `script.js`, so an integrity hash would break on their next release. If that
  outweighs the convenience, self-host the script.
- **HSTS omits `preload`.** Adding it is a long-lived commitment covering the
  domain and every subdomain, so it is your call, not mine.

## Verification status

Verified on Node 24.21.0 with pnpm 11.7.0.

- `pnpm typecheck`: clean across the whole project.
- `pnpm build`: succeeds and prerenders all 17 routes.

```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /api/contact
├ ƒ /cv
├ ○ /robots.txt
├ ○ /sitemap.xml
└ ● /work/[slug]   (10 paths)
```

- `pnpm check:copy`: passes across 48 source files.
- The build was then served with `next start` and fetched over HTTP, so this is a
  running site rather than only prerendered files. Every route answered
  correctly:

  | Route | Result |
  |---|---|
  | `/` | 200 |
  | `/work/portal-publik`, `/work/azzifa`, `/work/cobit-audit` | 200 |
  | `/robots.txt`, `/sitemap.xml` | 200 |
  | `/cv` | 307 redirect to the CV PDF |
  | an unknown path | 404 |

- The served Home page was inspected, not just its status code. All ten section
  anchors, every headline, the marker highlight, the placeholder frames, the
  skip link, the texture layer, and the JSON-LD block are present, and no
  `NaN`, `undefined`, `[object Object]`, or `href="#"` appears anywhere.
- Every motion in spec 2.8 was confirmed in the compiled CSS and client
  JavaScript: the scroll-driven reveals, the marker and sticker pop-ins, the
  count-up, the ring and tick and stack and dot illustrations, the carousel
  slide-in with its touch-swipe drag, the flow connectors, the timeline rail,
  the tools marquee, the accordion fade, and the `@view-transition` rule with
  its reduced-motion override all reached the output.
- The token layer was checked by reading the compiled CSS rather than the
  source, because `@theme inline` deliberately does not emit the variables: what
  matters is that `bg-signal`, `text-on-signal`, `border-ink`, `bg-paper`,
  `font-display`, `rounded-pill`, `ease-zine`, and `shadow-hard` each compile to
  a real declaration. They do.
- The computed stats check out in the output: projects renders `10`, events
  `2+`, followers `100K+`, views `1M+`, GPA `3.97 / 4.00`.
- The next-themes pre-paint script is inlined, and `data-theme` is correctly
  absent from the server markup. That combination is what prevents a theme
  flash on load.

One caveat worth knowing: Next forks child processes for type checking, for page
generation, and for the dev server. A restricted shell that blocks process
spawning fails with `spawn EPERM`. If you hit that, run `pnpm typecheck`
directly for the type gate, or run the build from a normal shell.
