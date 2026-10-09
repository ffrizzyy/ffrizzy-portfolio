import { Accordion } from "@/components/shared/Accordion";
import { SectionHeading } from "@/components/shared/decor";
import { Reveal } from "@/components/shared/Reveal";
import { ToolStrip } from "@/components/shared/ToolStrip";
import { Chip } from "@/components/ui/Chip";
import { broadSkills } from "@/content/site";
import { skillsMap } from "@/lib/content";
import { LAYOUT } from "@/lib/constants";

/**
 * Spec 4.4 skills map. Two columns: Broad as pill chips, Deep as an accordion,
 * with the tools strip full width beneath both. The "Used in" lists are
 * derived from the project tags in lib/content.ts, so adding a project updates
 * them automatically.
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
                className="text-sm text-ink underline decoration-line decoration-2 underline-offset-4 transition-colors hover:decoration-signal"
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

        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
          <Reveal className="flex flex-col gap-5">
            <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">Broad</h3>
            <ul className="flex flex-wrap gap-2.5">
              {broadSkills.map((skill) => (
                <li key={skill}>
                  <Chip className="pointer-events-none hover:border-ink hover:bg-signal hover:text-on-signal">
                    {skill}
                  </Chip>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-5">
            <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">Deep</h3>
            <Accordion items={deepItems} ariaLabel="Deep skills" defaultValue={skillsMap[0]?.skill.id} />
          </Reveal>
        </div>

        <div className="mt-14">
          <ToolStrip />
        </div>
      </div>
    </section>
  );
}
