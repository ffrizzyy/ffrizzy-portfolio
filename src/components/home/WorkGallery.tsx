import { Icon } from "@/components/shared/Icon";
import { featuredProjects } from "@/lib/content";
import { LAYOUT } from "@/lib/constants";

import { WorkGalleryList, type WorkGalleryItem } from "./WorkGalleryList";

/**
 * Spec 4.3 selected work, now an accordion gallery. The bento is gone; the five
 * featured projects are unchanged, and the section still carries no visible
 * heading because the hero's "View work" control lands here.
 *
 * Only the fields the rows draw are handed to the client component. The case
 * study prose stays on the server, which is the same reason the full work index
 * receives prepared rows rather than the catalogue.
 */
export function WorkGallery() {
  const items: WorkGalleryItem[] = featuredProjects.map((project) => ({
    slug: project.slug,
    title: project.title,
    type: project.type,
    period: project.period,
    role: project.role,
    outcome: project.outcome,
    stack: project.stack,
    cover: project.cover,
  }));

  return (
    <section id="work" className={LAYOUT.section}>
      <div className={LAYOUT.container}>
        <h2 className="sr-only">Selected work</h2>

        <WorkGalleryList items={items} />

        <div className="mt-10">
          <a
            href="#all"
            className="touch-target group inline-flex items-center gap-1.5 text-base font-medium text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4"
          >
            Work
            <Icon name="ArrowUpRight" size={18} className="nudge" />
          </a>
        </div>
      </div>
    </section>
  );
}
