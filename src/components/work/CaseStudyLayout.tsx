import { existsSync } from "node:fs";
import path from "node:path";

import { Icon } from "@/components/shared/Icon";
import { CoverImage } from "@/components/shared/CoverImage";
import { Reveal } from "@/components/shared/Reveal";
import { TrackedLink } from "@/components/shared/TrackedLink";
import { EvDciPanelDeferred } from "@/components/work/EvDciPanelDeferred";
import { ReportMap } from "@/components/work/ReportMap";
import { TagChip } from "@/components/ui/Chip";
import type { Project } from "@/content/schema";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { LAYOUT } from "@/lib/constants";

/**
 * Whether an extra gallery shot is actually on disk.
 *
 * The route is dynamic, so reading the filesystem here is safe, and it is what
 * lets the gallery show a real screenshot when one exists without inventing a
 * filename that would 404.
 */
function galleryAssetExists(src: string): boolean {
  return existsSync(path.join(process.cwd(), "public", src));
}

/**
 * Spec 5.1 case study template. Every section is optional in the data, so a
 * featured project renders the full eight-part structure while a smaller
 * project renders the short variant from the same component.
 */
export function CaseStudyLayout({ project, next }: { project: Project; next: Project }) {
  const detail = project.caseStudy;

  const sections: { label: string; body?: string }[] = [
    { label: "Summary", body: detail?.summary },
    { label: "Problem", body: detail?.problem },
    { label: "Approach", body: detail?.approach },
    { label: "Outcome", body: detail?.outcome },
    { label: "Honest limitations", body: detail?.limitations },
  ].filter((section) => Boolean(section.body));

  return (
    <article className={LAYOUT.section}>
      <div className={LAYOUT.container}>
        {/* 1. Header */}
        <Reveal className="flex flex-col gap-5 border-b-2 border-ink pb-10">
          <p className="num text-xs uppercase tracking-[0.16em] text-ink-muted">
            {project.type} · {project.period}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl">{project.title}</h1>
          <p className="max-w-[65ch] text-base text-ink-muted">{project.role}</p>

          <ul className="flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <li key={item}>
                <TagChip>{item}</TagChip>
              </li>
            ))}
          </ul>

          {project.links.length > 0 ? (
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {project.links.map((link) => (
                <li key={link.href}>
                  <TrackedLink
                    href={link.href}
                    event={ANALYTICS_EVENTS.projectOutbound}
                    eventProps={{ project: project.slug, label: link.label }}
                    external={link.href.startsWith("http")}
                    className="touch-target inline-flex items-center gap-1.5 text-base font-medium text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4"
                  >
                    {link.label}
                    {link.href.startsWith("http") ? <Icon name="ArrowUpRight" size={18} /> : null}
                  </TrackedLink>
                </li>
              ))}
            </ul>
          ) : null}
        </Reveal>

        {/* 2 to 6. Summary, problem, approach, outcome, limitations */}
        <div className="mt-12 flex flex-col gap-12">
          {sections.map((section, index) => (
            <Reveal key={section.label} delay={index * 0.05} className="max-w-[65ch]">
              <h2 className="text-xl md:text-2xl">{section.label}</h2>
              <p className="mt-3 text-base text-ink-muted">{section.body}</p>
            </Reveal>
          ))}

          {detail?.bullets && detail.bullets.length > 0 ? (
            <Reveal className="max-w-[65ch]">
              <h2 className="text-xl md:text-2xl">Detail</h2>
              <dl className="mt-4 flex flex-col gap-4">
                {detail.bullets.map((bullet) => (
                  <div key={bullet.label} className="border-t border-line pt-4">
                    <dt className="font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">
                      {bullet.label}
                    </dt>
                    <dd className="mt-2 text-base text-ink-muted">{bullet.text}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ) : null}

          {/* Interactive pieces are declared by name in the content module and
              resolved here, so the content stays data and the heavy libraries
              load only on the case study that asks for them.
              Both are wrapped: ReportMap for Leaflet and EvDciPanelDeferred for
              Recharts, because a Server Component cannot call next/dynamic with
              ssr: false itself. Rendering them directly would put the library in
              every work route's first load, which is what EvDciPanel used to do. */}
          {detail?.interactive === "kito-report-map" ? (
            <Reveal>
              <h2 className="text-xl md:text-2xl">The map, on sample data</h2>
              <ReportMap />
            </Reveal>
          ) : null}

          {detail?.interactive === "sdc-ev-dci" ? (
            <Reveal>
              <h2 className="text-xl md:text-2xl">The data behind the concept</h2>
              <EvDciPanelDeferred />
            </Reveal>
          ) : null}
        </div>

        {/* 7. Gallery, scroll-snap */}
        <Reveal className="mt-16">
          <h2 className="text-xl md:text-2xl">Gallery</h2>
          <div className="mt-5 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4">
            {/* The cover always leads the row. */}
            <div className="relative aspect-[16/10] w-[min(85vw,520px)] shrink-0 snap-start border border-line">
              <CoverImage
                src={project.cover}
                alt={`${project.title} cover artwork`}
                sizes="520px"
              />
            </div>
            {/* Extra shots are read from disk rather than assumed. A slot renders
                a real image the moment one is dropped at <slug>-2.webp or
                <slug>-3.webp; while the file is absent the slot renders nothing
                at all, so the row is the cover plus only the shots that exist
                rather than a row of pending frames. */}
            {[2, 3].map((slot) => {
              const src = project.cover.replace(".webp", `-${slot}.webp`);
              if (!galleryAssetExists(src)) return null;
              return (
                <div
                  key={slot}
                  className="relative aspect-[16/10] w-[min(85vw,520px)] shrink-0 snap-start border border-line"
                >
                  <CoverImage
                    src={src}
                    alt={`${project.title} screenshot ${slot}`}
                    sizes="520px"
                  />
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* 8. Next project */}
        <div className="mt-16 border-t-2 border-ink pt-8">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">Next project</p>
          <a
            href={`/work/${next.slug}`}
            className="group mt-3 inline-flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4 md:text-3xl"
          >
            {next.title}
            <Icon name="ArrowUpRight" size={22} className="nudge" />
          </a>
        </div>
      </div>
    </article>
  );
}
