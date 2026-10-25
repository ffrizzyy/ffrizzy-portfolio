"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import type { CSSProperties } from "react";

import { CoverImage } from "@/components/shared/CoverImage";
import { Icon, type IconName } from "@/components/shared/Icon";
import { IconTile } from "@/components/shared/decor";
import { TagChip } from "@/components/ui/Chip";
import type { ProjectType } from "@/content/schema";

/**
 * Selected work as an accordion gallery: a numbered row per project, opening
 * into its cover and the one-paragraph case.
 *
 * This replaces the bento. The bento showed five covers at once, which meant
 * five images competing above the fold of the section and the text squeezed into
 * whatever was left. A row that opens gives the cover a full column when it is
 * asked for, and the closed state is a list a reader can scan in one pass.
 *
 * Consistency with the rest of the page: 2px ink borders, radius 0, mono index,
 * a `+` that rotates 45 degrees, signal on hover, tag chips, the same type icon
 * each project already carries in the full work index.
 *
 * The disclosure animation is Radix's height custom property plus CSS, so
 * nothing measures in JavaScript. Rows enter with the site's own reveal, offset
 * by 60ms each.
 */

export type WorkGalleryItem = {
  slug: string;
  title: string;
  type: ProjectType;
  period: string;
  role: string;
  outcome: string;
  stack: string[];
  cover: string;
};

const TYPE_ICON: Record<ProjectType, IconName> = {
  build: "Code",
  data: "ChartBar",
  research: "Flask",
  design: "PenNib",
  content: "PencilSimpleLine",
};

export function WorkGalleryList({ items }: { items: WorkGalleryItem[] }) {
  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      defaultValue={items[0]?.slug}
      aria-label="Selected work"
      className="flex flex-col gap-3"
    >
      {items.map((item, index) => (
        <AccordionPrimitive.Item
          key={item.slug}
          value={item.slug}
          style={{ animationDelay: `${index * 0.06}s` } as CSSProperties}
          className="reveal border-2 border-ink bg-paper-raised data-[state=open]:bg-paper"
        >
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="group flex w-full items-center gap-3 p-4 text-left text-ink transition-colors hover:bg-signal hover:text-on-signal md:gap-5 md:p-5">
              <span className="num w-6 shrink-0 text-xs text-ink-muted group-hover:text-on-signal">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* The same family the work index uses for type, so a build reads
                  as a build here and there. */}
              <IconTile className="hidden transition-colors group-hover:border-on-signal group-hover:bg-on-signal group-hover:text-signal sm:grid">
                <Icon name={TYPE_ICON[item.type]} size={20} />
              </IconTile>

              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="font-display text-xl font-extrabold tracking-tight md:text-2xl">
                  {item.title}
                </span>
                <span className="hidden text-sm text-ink-muted group-hover:text-on-signal sm:line-clamp-1">
                  {item.outcome}
                </span>
              </span>

              <span className="num hidden shrink-0 text-xs text-ink-muted group-hover:text-on-signal md:block">
                {item.period}
              </span>

              <span
                aria-hidden
                className="grid size-8 shrink-0 place-items-center transition-transform duration-300 ease-zine group-data-[state=open]:rotate-45"
              >
                <Icon name="Plus" size={18} />
              </span>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>

          <AccordionPrimitive.Content className="gallery-content">
            <div className="gallery-inner grid border-t-2 border-ink md:grid-cols-[1.15fr_1fr]">
              <div className="relative aspect-[16/10] border-b-2 border-ink md:aspect-auto md:min-h-[19rem] md:border-b-0 md:border-r-2">
                <CoverImage
                  src={item.cover}
                  alt={`${item.title} cover`}
                  sizes="(min-width: 768px) 55vw, 100vw"
                />
              </div>

              <div className="flex flex-col gap-4 p-5 md:p-6">
                <dl className="flex flex-col gap-2 text-sm">
                  <div className="flex gap-3">
                    <dt className="num w-16 shrink-0 text-xs uppercase tracking-[0.14em] text-ink-muted">
                      Role
                    </dt>
                    <dd className="text-ink-muted">{item.role}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="num w-16 shrink-0 text-xs uppercase tracking-[0.14em] text-ink-muted">
                      Year
                    </dt>
                    <dd className="num text-ink-muted">{item.period}</dd>
                  </div>
                </dl>

                <ul className="flex flex-wrap gap-2">
                  {item.stack.slice(0, 4).map((tool) => (
                    <li key={tool}>
                      <TagChip>{tool}</TagChip>
                    </li>
                  ))}
                </ul>

                <a
                  href={`/work/${item.slug}`}
                  className="touch-target group/link mt-auto inline-flex w-fit items-center gap-1.5 text-base font-medium text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4"
                >
                  Read the case study
                  <Icon
                    name="ArrowRight"
                    size={18}
                    className="transition-transform duration-200 ease-zine group-hover/link:translate-x-1"
                  />
                </a>
              </div>
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
