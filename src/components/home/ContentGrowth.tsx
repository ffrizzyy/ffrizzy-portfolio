import { Carousel } from "@/components/shared/Carousel";
import { SectionHeading } from "@/components/shared/decor";
import { Reveal } from "@/components/shared/Reveal";
import { growthList } from "@/lib/content";
import { LAYOUT } from "@/lib/constants";

/**
 * Spec 4.5 content growth. A three-slide carousel where each slide is a
 * two-column layout: the story on the left, a two-bar chart on the right.
 *
 * Each slide has its own scale, so the bars compare start against peak within
 * that slide only. Heights are proportional inside a slide, never across
 * slides, which is what stops the chart from implying a false comparison.
 */
export function ContentGrowth() {
  const slides = growthList.map((slide) => {
    const startPercent = slide.peak === 0 ? 0 : Math.round((slide.start / slide.peak) * 100);

    return (
      <div
        key={slide.id}
        className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2 md:p-8 lg:gap-12"
      >
        <div className="flex flex-col gap-4">
          <p className="num text-xs uppercase tracking-[0.16em] text-ink-muted">{slide.role}</p>
          <h3 className="text-xl md:text-2xl">{slide.org}</h3>
          <p className="num text-4xl leading-none text-ink md:text-5xl">{slide.peakLabel}</p>
          <p className="text-sm text-ink-muted">{slide.subLine}</p>
          <p className="text-base text-ink-muted">{slide.sentence}</p>
        </div>

        {/* Two bars on a 2px ink baseline. The peak bar is signal and regrows
            slightly after the start bar. */}
        <div className="flex flex-col justify-end gap-3">
          <div className="flex h-40 items-end gap-8 border-b-2 border-ink">
            <div className="flex h-full flex-1 flex-col justify-end">
              <div
                className="grow-bar w-full bg-line"
                style={{ height: `${startPercent}%` }}
                aria-hidden
              />
            </div>
            <div className="flex h-full flex-1 flex-col justify-end">
              <div
                className="grow-bar w-full bg-signal"
                style={{ height: "100%", animationDelay: "0.2s" }}
                aria-hidden
              />
            </div>
          </div>

          <div className="flex gap-8">
            <div className="flex-1">
              <p className="num text-xs text-ink-muted">Start</p>
              <p className="num text-sm text-ink">{slide.startLabel}</p>
            </div>
            <div className="flex-1">
              <p className="num text-xs text-ink-muted">Peak</p>
              <p className="num text-sm text-ink">{slide.peakLabel}</p>
            </div>
          </div>

          <p className="text-xs text-ink-muted">
            Start and peak are scaled within this slide only.
          </p>
        </div>
      </div>
    );
  });

  return (
    <section id="content" className={`${LAYOUT.section} border-t border-line`}>
      <div className={LAYOUT.container}>
        <Reveal>
          <SectionHeading>Audiences I helped grow.</SectionHeading>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <Carousel
            ariaLabel="Audience growth stories"
            labels={growthList.map((slide) => slide.org)}
            slides={slides}
          />
        </Reveal>
      </div>
    </section>
  );
}
