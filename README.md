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
```

`pnpm build` deliberately runs `check:copy` first. Spec 2.10 bans em-dashes and
en-dashes in visible copy, and a rule that is only checked by eye stops being
true after the tenth edit, so the build fails instead.

No environment variables are required to run it. With no secrets the contact
route validates the payload and returns a labelled development response instead
of sending mail. Copy `.env.example` to `.env.local` when you want real delivery.

## Two things about this checkout that will bite you if you change them

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

Derived rather than typed, so they cannot drift:

- The **projects** stat counts `content/projects.ts`.
- The **events** stat counts the events list. That list currently names only two
  events, so the stat renders as a lower bound (`2+`) and says so in its method
  text. Fill in the list and the stat follows.
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
| Analytics through a script tag | `track()` no-op wrapper | The Plausible script is not wired yet; events are already dispatched at the four spec'd call sites |

## Not built yet

These are in the spec and intentionally unfinished, listed so nothing looks
accidentally done:

- **Leaflet map and Recharts charts.** The packages are installed, but the
  Portal Publik case study's interactive map and trend chart are not wired. That
  page currently renders the full written case study without the demos.
- **`next/og` Open Graph images.** Metadata is in place; generated images are not.
- **The Plausible or Vercel analytics script.** Event call sites exist.
- **ESLint, Playwright, and Lighthouse CI.** The spec lists them as quality
  gates. `tsc --noEmit` is the gate that runs here. Installing Playwright also
  pulls browser binaries, which is why it was left out.
- **GitHub metadata fetching** and **Sentry**, both marked optional in the spec.

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
