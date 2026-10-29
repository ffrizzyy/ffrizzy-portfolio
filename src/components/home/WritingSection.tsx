import { Carousel } from "@/components/shared/Carousel";
import { CoverImage } from "@/components/shared/CoverImage";
import { Icon } from "@/components/shared/Icon";
import { SectionHeading } from "@/components/shared/decor";
import { Reveal } from "@/components/shared/Reveal";
import { TrackedLink } from "@/components/shared/TrackedLink";
import { TagChip } from "@/components/ui/Chip";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { getFeaturedWriting, getInstagramSeries, mediumArticleList } from "@/lib/content";
import { LAYOUT, SITE } from "@/lib/constants";

/**
 * Spec 4.8 writing. A signal-filled article band that is one whole link target,
 * the Medium stories mirrored from the owner's feed, then the Instagram series
 * reusing the same carousel component as content growth.
 *
 * The two account pills at the top are where the writing actually publishes.
 * Substack and Medium are text pills rather than icon buttons because neither
 * mark is in the installed icon sets, and a label is clearer than a borrowed
 * glyph.
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
        {item.date ? (
          <p className="num text-xs uppercase tracking-[0.14em] text-ink-muted">{item.date}</p>
        ) : null}
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

      <div className="relative aspect-[4/5] border border-line">
        <CoverImage
          src={item.cover}
          alt={`${item.title} Instagram post card`}
          sizes="(min-width: 768px) 45vw, 100vw"
        />
      </div>
    </div>
  ));

  return (
    <section id="writing" className={`${LAYOUT.section} border-t border-line`}>
      <div className={LAYOUT.container}>
        <Reveal>
          <SectionHeading>Writing.</SectionHeading>
        </Reveal>

        <Reveal delay={0.05} className="mt-6 flex flex-wrap items-center gap-3">
          <TrackedLink
            href={SITE.substack}
            event={ANALYTICS_EVENTS.articleOutbound}
            eventProps={{ target: "substack" }}
            external
            className="group inline-flex h-10 items-center gap-2 rounded-pill border-2 border-ink px-4 text-sm font-medium text-ink transition-colors duration-200 ease-zine hover:bg-signal hover:text-on-signal"
          >
            Substack
            <Icon name="ArrowUpRight" size={16} className="nudge" />
          </TrackedLink>
          <TrackedLink
            href={SITE.medium}
            event={ANALYTICS_EVENTS.articleOutbound}
            eventProps={{ target: "medium" }}
            external
            className="group inline-flex h-10 items-center gap-2 rounded-pill border-2 border-ink px-4 text-sm font-medium text-ink transition-colors duration-200 ease-zine hover:bg-signal hover:text-on-signal"
          >
            Medium
            <Icon name="ArrowUpRight" size={16} className="nudge" />
          </TrackedLink>
        </Reveal>

        {article?.url ? (
          <Reveal delay={0.08} className="mt-10">
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

        <Reveal delay={0.12} className="mt-10">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
            Also on Medium
          </p>

          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {mediumArticleList.map((medium) => (
              <li key={medium.id}>
                <TrackedLink
                  href={medium.url}
                  event={ANALYTICS_EVENTS.articleOutbound}
                  eventProps={{ target: medium.id }}
                  external
                  className="group flex h-full flex-col justify-between gap-6 border-2 border-ink bg-paper-raised p-6 transition-colors duration-200 ease-zine hover:bg-paper-sunken"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">
                        Medium
                      </span>
                      <Icon
                        name="ArrowUpRight"
                        size={18}
                        className="shrink-0 transition-transform duration-200 ease-zine group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </div>
                    <h3 className="mt-4 text-xl md:text-2xl">{medium.title}</h3>
                    <p className="mt-3 text-sm text-ink-muted">{medium.description}</p>
                  </div>

                  <p className="num text-xs uppercase tracking-[0.14em] text-ink-muted">
                    {medium.date}
                  </p>
                </TrackedLink>
              </li>
            ))}
          </ul>
        </Reveal>

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
