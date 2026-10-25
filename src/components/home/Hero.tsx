import { Fragment } from "react";
import { siFigma, siGo, siPython } from "simple-icons";

import { HeroIntro } from "@/components/home/HeroIntro";
import { CoverImage } from "@/components/shared/CoverImage";
import { Icon } from "@/components/shared/Icon";
import { Magnetic } from "@/components/shared/Magnetic";
import { Sticker, TapedPhoto } from "@/components/shared/decor";
import { CvLink } from "@/components/shared/TrackedLink";
import { ButtonLink } from "@/components/ui/Button";
import { LAYOUT, SITE } from "@/lib/constants";

/**
 * Spec 4.1 hero. Text in columns 1 to 7, the taped portrait and stickers in
 * columns 8 to 12. Three text elements only: headline, subtext, CTAs. Nothing
 * else is allowed here, so there is deliberately no tagline, trust strip, or
 * scroll cue.
 *
 * Motion: the entrance is a GSAP timeline in HeroIntro (see the note there for
 * why it is the one JS-driven sequence on the page). Every moving part carries a
 * `data-hero` hook, so this file stays a Server Component and the timeline is a
 * client leaf that only ever touches the DOM it was scoped to. The sticker delays
 * are timed to land after the last word rather than over it.
 *
 * Sticker note: spec 4.1 names Python, Go, Tableau, and Figma. Tableau has no
 * entry in simple-icons 16, and spec 1.1 says to drop a missing brand rather
 * than hand-draw it, so three stickers ship instead of four.
 */
const STICKERS = [
  { key: "python", name: "Python", path: siPython.path, className: "-left-5 top-6", spin: -7, delay: 1.12 },
  { key: "go", name: "Go", path: siGo.path, className: "-right-6 top-24", spin: 6, delay: 1.24 },
  { key: "figma", name: "Figma", path: siFigma.path, className: "-left-6 bottom-16", spin: 5, delay: 1.36 },
];

/**
 * The headline as words, because the entrance moves them one at a time. Text
 * content is identical to the plain sentence, spaces included, so copying the
 * heading and reading it with a screen reader are both unaffected. Only "tell the
 * story." is marked; the full stop rides inside the last word so the bar closes
 * on the sentence rather than leaving a stripe of paper before the period.
 */
const HEADLINE: { text: string; marked?: boolean }[] = [
  { text: "I" },
  { text: "build" },
  { text: "it," },
  { text: "analyze" },
  { text: "it," },
  { text: "and" },
  { text: "tell", marked: true },
  { text: "the", marked: true },
  { text: "story.", marked: true },
];

export function Hero() {
  return (
    /* min-height subtracts the nav offset (LAYOUT.navTotal) so the hero still
       lands inside one viewport with the floating bar above it. Tailwind cannot
       read a computed value here, so 76px is written literally and kept in sync
       with LAYOUT.navTotal. */
    <section className={`relative ${LAYOUT.section} min-h-[calc(100dvh-76px)] pt-6 md:pt-12`}>
      <HeroIntro
        className={`${LAYOUT.container} grid grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-8`}
      >
        <div className="md:col-span-7">
          <div className="mb-5 flex items-center gap-3">
            <span
              aria-hidden
              data-hero="rule"
              className="h-px w-8 origin-left bg-signal"
            />
            <p
              data-hero="eyebrow"
              className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted"
            >
              information systems / ai / data
            </p>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl">
            {HEADLINE.map((word, index) => (
              <Fragment key={index}>
                {index > 0 ? " " : null}
                <span
                  data-hero="word"
                  className={word.marked ? "hero-word hero-word-marked" : "hero-word"}
                >
                  {word.text}
                </span>
              </Fragment>
            ))}
          </h1>

          <div data-hero="sub" className={`mt-6 ${LAYOUT.measure} text-base text-ink-muted md:text-lg`}>
            <p>
              Information Systems graduate (3.97 GPA) shipping AI web apps, data dashboards, and
              content that grows audiences.
            </p>
          </div>

          {/* A 5px magnetic pull on each control. Small enough that the target
              stays where the eye expects it; see Magnetic for the gating. */}
          <div data-hero="cta" className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <ButtonLink href="#work" variant="primary" size="md">
                View work
              </ButtonLink>
            </Magnetic>

            {/* The CV control leads with the name rather than the action. The
                aria-label keeps the CV as the accessible name, and the mono CV
                badge is what tells a reader the pill opens the CV. The icon is
                an arrow, not a download: the pill opens the /cv page, and the
                PDF downloads live on that page. */}
            <Magnetic>
              <CvLink
                ariaLabel={`Open the CV page, ${SITE.name}`}
                className="group inline-flex h-11 select-none items-center justify-center gap-2 rounded-pill border-2 border-ink bg-transparent px-5 text-[0.95rem] font-medium tracking-tight text-ink transition-[background-color,transform] duration-200 ease-zine hover:bg-paper-sunken active:translate-y-px active:scale-[0.98]"
              >
                <Icon name="ArrowRight" size={18} className="nudge-right" />
                <span>{SITE.name}</span>
                <span
                  aria-hidden
                  className="num rounded-pill bg-paper-sunken px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.14em] text-ink-muted"
                >
                  CV
                </span>
              </CvLink>
            </Magnetic>
          </div>
        </div>

        {/* The zine layer: a taped portrait with stickers overlapping the photo
            edges, never the face. Spec 4.1 and 2.6.

            Two nesting levels on purpose: `portrait` is what the scroll parallax
            moves, `photo` is what the entrance moves. One element cannot carry
            both without the scrub tween overwriting the entrance mid-flight. */}
        <div data-hero="portrait" className="relative md:col-span-5">
          <div className="relative mx-auto max-w-sm md:ml-auto md:mr-0">
            <div data-hero="photo">
              <TapedPhoto rotate={-2}>
                <div className="relative aspect-[4/5]">
                  <CoverImage
                    src="/images/portrait.webp"
                    alt="Placeholder card standing in for the portrait of Muhammad Farrel Al-Wafi Frizzy"
                    sizes="(min-width: 768px) 32vw, 80vw"
                    priority
                  />
                </div>
              </TapedPhoto>
            </div>

            {STICKERS.map((sticker) => (
              <Sticker
                key={sticker.key}
                label={sticker.name}
                spin={sticker.spin}
                delay={sticker.delay}
                className={`absolute hidden sm:grid ${sticker.className}`}
              >
                <svg viewBox="0 0 24 24" className="size-6 fill-ink" aria-hidden>
                  <path d={sticker.path} />
                </svg>
              </Sticker>
            ))}
          </div>
        </div>
      </HeroIntro>
    </section>
  );
}
