import { CoverImage } from "@/components/shared/CoverImage";
import { Reveal } from "@/components/shared/Reveal";
import { Icon } from "@/components/shared/Icon";
import { TagChip } from "@/components/ui/Chip";
import { featuredProjects } from "@/lib/content";
import { LAYOUT } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Spec 4.3 selected work: a bento of exactly five cells. Row 1 is 7 + 5
 * columns, row 2 is 4 + 5 + 3, so both rows total 12 and there is no gap.
 *
 * Cell D is the only signal-filled surface on the Home page, which is what
 * makes the accent mean something. Cell E is paper-sunken. The rest are
 * paper-raised.
 */
const CELL_LAYOUT = [
  { span: "md:col-span-7", tone: "raised" },
  { span: "md:col-span-5", tone: "raised" },
  { span: "md:col-span-4", tone: "raised" },
  { span: "md:col-span-5", tone: "signal" },
  { span: "md:col-span-3", tone: "sunken" },
] as const;

export function WorkBento() {
  return (
    <section id="work" className={LAYOUT.section}>
      <div className={LAYOUT.container}>
        <h2 className="sr-only">Selected work</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
          {featuredProjects.map((project, index) => {
            const layout = CELL_LAYOUT[index] ?? CELL_LAYOUT[0];
            const isSignal = layout.tone === "signal";
            const isSunken = layout.tone === "sunken";

            return (
              <Reveal key={project.slug} delay={index * 0.08} className={cn("group", layout.span)}>
                <a
                  href={`/work/${project.slug}`}
                  className={cn(
                    "flex h-full flex-col border-2 border-ink transition-[transform,box-shadow] duration-200 ease-zine",
                    "hover:-translate-y-0.5 hover:shadow-hard focus-visible:shadow-hard",
                    isSignal ? "bg-signal text-on-signal" : isSunken ? "bg-paper-sunken text-ink" : "bg-paper-raised text-ink",
                  )}
                >
                  {/* The cover artwork now exists, so the cell shows an image
                      rather than an empty placeholder frame. A real screenshot
                      dropped over the same path replaces it with no code change. */}
                  <div className="relative aspect-[16/10] overflow-hidden border-b-2 border-ink">
                    <CoverImage
                      src={project.cover}
                      alt={`${project.title} cover`}
                      sizes="(min-width: 768px) 45vw, 100vw"
                      className="transition-transform duration-700 ease-zine group-hover:scale-[1.04]"
                    />
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <h3 className="text-xl md:text-2xl">{project.title}</h3>
                    <p className={cn("text-sm", isSignal ? "text-on-signal" : "text-ink-muted")}>
                      {project.outcome}
                    </p>

                    <ul className="mt-auto flex flex-wrap gap-2 pt-2">
                      {project.stack.slice(0, 3).map((item) => (
                        <li key={item}>
                          <TagChip
                            className={cn(
                              isSignal && "border-on-signal text-on-signal",
                              isSunken && "border-ink-muted",
                            )}
                          >
                            {item}
                          </TagChip>
                        </li>
                      ))}
                    </ul>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>

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
