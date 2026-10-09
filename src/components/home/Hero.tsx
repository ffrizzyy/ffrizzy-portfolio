import { siFigma, siGo, siPython } from "simple-icons";

import { Sticker, TapedPhoto } from "@/components/shared/decor";
import { PendingImage } from "@/components/shared/PendingImage";
import { Reveal } from "@/components/shared/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { CvLink } from "@/components/shared/TrackedLink";
import { LAYOUT } from "@/lib/constants";
import { MarkerHighlight } from "@/components/shared/decor";

/**
 * Spec 4.1 hero. Text in columns 1 to 7, the taped portrait and stickers in
 * columns 8 to 12. Three text elements only: headline, subtext, CTAs. Nothing
 * else is allowed here, so there is deliberately no tagline, trust strip, or
 * scroll cue.
 *
 * Sticker note: spec 4.1 names Python, Go, Tableau, and Figma. Tableau has no
 * entry in simple-icons 16, and spec 1.1 says to drop a missing brand rather
 * than hand-draw it, so three stickers ship instead of four.
 */
const STICKERS = [
  { key: "python", name: "Python", path: siPython.path, className: "-left-5 top-6", spin: -7, delay: 0.5 },
  { key: "go", name: "Go", path: siGo.path, className: "-right-6 top-24", spin: 6, delay: 0.63 },
  { key: "figma", name: "Figma", path: siFigma.path, className: "-left-6 bottom-16", spin: 5, delay: 0.76 },
];

export function Hero() {
  return (
    <section className={`relative ${LAYOUT.section} min-h-[100dvh] pt-16 md:pt-24`}>
      <div className={`${LAYOUT.container} grid grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-8`}>
        <div className="md:col-span-7">
          <Reveal as="h1" className="text-4xl md:text-5xl lg:text-6xl">
            I build it, analyze it, and <MarkerHighlight>tell the story</MarkerHighlight>.
          </Reveal>

          <Reveal delay={0.12} className={`mt-6 ${LAYOUT.measure} text-base text-ink-muted md:text-lg`}>
            <p>
              Information Systems graduate (3.97 GPA) shipping AI web apps, data dashboards, and
              content that grows audiences.
            </p>
          </Reveal>

          <Reveal delay={0.24} className="mt-10 flex flex-wrap items-center gap-4">
            <ButtonLink href="#work" variant="primary" size="md">
              View work
            </ButtonLink>
            <CvLink className="inline-flex h-11 select-none items-center justify-center gap-2 rounded-pill border-2 border-ink bg-transparent px-6 text-[0.95rem] font-medium tracking-tight text-ink transition-[background-color,transform] duration-200 ease-zine hover:bg-paper-sunken active:translate-y-px active:scale-[0.98]">
              Download CV
            </CvLink>
          </Reveal>
        </div>

        {/* The zine layer: a taped portrait with stickers overlapping the photo
            edges, never the face. Spec 4.1 and 2.6. */}
        <Reveal delay={0.2} className="relative md:col-span-5">
          <div className="relative mx-auto max-w-sm md:ml-auto md:mr-0">
            <TapedPhoto rotate={-2}>
              <PendingImage
                src="/images/portrait.webp"
                width={800}
                height={1000}
                ratio="aspect-[4/5]"
                label="Portrait of Muhammad Farrel Al-Wafi Frizzy"
                className="border-0"
              />
            </TapedPhoto>

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
        </Reveal>
      </div>
    </section>
  );
}
