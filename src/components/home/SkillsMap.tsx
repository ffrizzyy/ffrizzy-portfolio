import { Accordion } from "@/components/shared/Accordion";
import { SectionHeading } from "@/components/shared/decor";
import { Reveal } from "@/components/shared/Reveal";
import { ToolStrip } from "@/components/shared/ToolStrip";
import { TagChip } from "@/components/ui/Chip";
import { broadSkills } from "@/content/site";
import { skillsMap } from "@/lib/content";
import { LAYOUT } from "@/lib/constants";

/**
 * Spec 4.4 skills map, drawn as the T-shaped skill profile it describes.
 *
 * The crossbar is the breadth: everything the work touches, as labels. The stem
 * is the depth: the tools and methods worth opening, with "Used in" links back
 * to the work that proves them. The stem is narrower and centred under the bar,
 * and a two-pixel rule joins the two, so the shape is read before the headings
 * are. The counts in each header come from the arrays, so the figure can never
 * claim a number the page does not show.
 *
 * Depth is one open row at a time (spec 2.7), and the "Used in" lists are
 * derived from project tags in lib/content.ts, so adding a project updates them
 * automatically.
 */
export function SkillsMap() {
  const deepItems = skillsMap.map((entry) => ({
    id: entry.skill.id,
    title: (
      <span className="flex flex-col gap-1">
        <span className="font-medium">{entry.skill.name}</span>
        <span className="text-xs font-normal text-ink-muted">{entry.skill.blurb}</span>
      </span>
    ),
    content: (
      <div className="flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">Used in</p>
        <ul className="flex flex-col gap-1">
          {entry.usedIn.map((usage) => (
            <li key={`${entry.skill.id}-${usage.label}`}>
              <a
                href={usage.href}
                className="touch-target text-sm text-ink underline decoration-line decoration-2 underline-offset-4 transition-colors hover:decoration-signal"
              >
                {usage.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    ),
  }));

  return (
    <section id="skills" className={`${LAYOUT.section} border-t border-line`}>
      <div className={LAYOUT.container}>
        <Reveal>
          <SectionHeading>Broad reach, deep tools.</SectionHeading>
        </Reveal>

        <div className="mt-12 flex flex-col">
          {/* The crossbar. Full width, because breadth is the widest claim on
              the page and the shape has to start wide. */}
          <Reveal className="border-2 border-ink bg-paper-raised p-5 md:p-7">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
                Breadth
              </h3>
              <p className="num text-xs text-ink-muted">{broadSkills.length} areas</p>
            </div>

            <ul className="mt-5 flex flex-wrap gap-2.5">
              {broadSkills.map((skill) => (
                <li key={skill}>
                  {/* These are labels, not controls, so they render as a span.
                      The previous version used a button with pointer-events-none,
                      which silently disabled the hover state it declared. */}
                  <TagChip className="h-9 gap-2 px-4 font-sans text-sm font-medium text-ink-muted transition-colors duration-200 ease-zine hover:border-ink hover:bg-signal hover:text-on-signal">
                    {skill}
                  </TagChip>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* The join. It only reads as one figure if the rule touches both
              panels, so it is its own block with no gap above or below it. It
              draws downward as the stem enters, where the browser has scroll
              timelines, and is simply already drawn everywhere else.

              No `overflow-hidden` on this wrapper: an overflow-clipped ancestor
              becomes the subject's scroll container, so the view timeline would
              be measured against this 48px box and the rule would snap to full
              instead of drawing. */}
          <div aria-hidden className="mx-auto h-8 w-0.5 md:h-12">
            <span className="t-stem block h-full w-full bg-signal" />
          </div>

          {/* The stem. Narrower and centred, so the T is legible at a glance. */}
          <Reveal
            delay={0.1}
            className="mx-auto w-full max-w-[40rem] border-2 border-ink bg-paper"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line p-4 md:px-5">
              <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
                Depth
              </h3>
              <p className="num text-xs text-ink-muted">{skillsMap.length} tools and methods</p>
            </div>

            {/* Flush in the panel, so the outer border is the only frame: the
                accordion's own top rule and the last row's bottom rule would
                sit a pixel away from it and read as a double line. */}
            <Accordion
              items={deepItems}
              ariaLabel="Deep skills"
              defaultValue={skillsMap[0]?.skill.id}
              className="border-t-0 [&>*:last-child]:border-b-0"
            />
          </Reveal>
        </div>

        <div className="mt-14">
          <ToolStrip />
        </div>
      </div>
    </section>
  );
}
