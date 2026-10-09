import { Carousel } from "@/components/shared/Carousel";
import { SectionHeading } from "@/components/shared/decor";
import { PendingImage } from "@/components/shared/PendingImage";
import { Reveal } from "@/components/shared/Reveal";
import { TrackedLink } from "@/components/shared/TrackedLink";
import { TagChip } from "@/components/ui/Chip";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { getFeaturedWriting, getInstagramSeries } from "@/lib/content";
import { LAYOUT } from "@/lib/constants";

/**
 * Spec 4.8 writing. A signal-filled article band that is one whole link target,
 * then the Instagram series reusing the same carousel component as content
 * growth.
 *
 * Two of the four Instagram posts still have no URL (spec 9.2 item 11). Those
 * slides render without a link rather than with a placeholder href, so no
 * visitor can land on a dead link.
 */
export function WritingSection() {
  const article = getFeaturedWriting();
  const series = getInstagramSeries();

  const slides = series.map((item) => (
    <div key={item.id} className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2 md:p-8 lg:gap-12">
      <div className="flex flex-col gap-4">
        <h3 className="text-xl md:text-2xl">{item.title}</h3>
        <p className="text-base text-ink-muted">{item.description}</p>

        {item.url ? (
          <TrackedLink
            href={item.url}
            event={ANALYTICS_EVENTS.articleOutbound}
            eventProps={{ target: item.id }}
            external
            className="w-fit text-base font-medium text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4"
          >
            Open on Instagram
          </TrackedLink>
        ) : (
          <p className="text-xs text-ink-muted">
            Post link pending. This slide will link out once the URL is supplied.
          </p>
        )}
      </div>

      <PendingImage
        src={item.cover}
        width={1080}
        height={1350}
        ratio="aspect-[4/5]"
        label={`${item.title} Instagram post cover`}
      />
    </div>
  ));

  return (
    <section id="writing" className={`${LAYOUT.section} border-t border-line`}>
      <div className={LAYOUT.container}>
        <Reveal>
          <SectionHeading>Writing.</SectionHeading>
        </Reveal>

        {article?.url ? (
          <Reveal delay={0.08} className="mt-12">
            <TrackedLink
              href={article.url}
              event={ANALYTICS_EVENTS.articleOutbound}
              eventProps={{ target: article.id }}
              external
              className="block border-2 border-ink bg-signal p-6 text-on-signal shadow-hard transition-transform duration-200 ease-zine hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_var(--shadow-color)] md:p-10"
            >
              <ul className="flex flex-wrap gap-2">
                <li>
                  <TagChip className="border-on-signal text-on-signal">LinkedIn</TagChip>
                </li>
                <li>
                  <TagChip className="border-on-signal text-on-signal">Bahasa Indonesia</TagChip>
                </li>
              </ul>

              <h3 className="mt-5 text-2xl md:text-4xl">{article.title}</h3>

              <p className="num mt-3 text-xs uppercase tracking-[0.14em]">{article.date}</p>

              <p className="mt-4 max-w-[65ch] text-base">{article.description}</p>
            </TrackedLink>
          </Reveal>
        ) : null}

        <Reveal delay={0.14} className="mt-12">
          <Carousel
            ariaLabel="Instagram series"
            labels={series.map((item) => item.title)}
            slides={slides}
          />
        </Reveal>
      </div>
    </section>
  );
}
