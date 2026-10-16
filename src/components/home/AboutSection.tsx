import { Accordion } from "@/components/shared/Accordion";
import { Icon, type IconName } from "@/components/shared/Icon";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/decor";
import { ExperienceTimeline } from "@/components/home/ExperienceTimeline";
import { aboutTimeline, awardList, certList, languages } from "@/lib/content";
import { LAYOUT } from "@/lib/constants";

/**
 * Spec 4.9 about. Left: three paragraphs, the languages line, and the awards.
 * Right: the experience timeline with a scroll-driven progress rail, then
 * certifications grouped by issuer.
 *
 * Deliberately absent here: a portrait, a separate education block, and a CV
 * button, all of which spec 4.9 excludes.
 *
 * Mobile: the rail is the second tallest thing on the page at 390px, so below
 * md it shows ENTRIES_BEFORE_REVEAL entries and hands the reader a control for
 * the rest. Only the rail is a client leaf; this section stays a Server
 * Component, so the timeline data does not enter the client bundle. The entries
 * are rendered here and passed down, which is the same split WorkList uses.
 */
const KIND_ICON: Record<string, IconName> = {
  work: "Briefcase",
  leadership: "UsersThree",
  award: "Trophy",
};

/** Entries the rail shows before the reader opens it, below md only. */
const ENTRIES_BEFORE_REVEAL = 3;

export function AboutSection() {
  const certItems = certList.map((group) => ({
    id: group.issuer,
    title: group.issuer,
    content: (
      <ul className="flex flex-col gap-2">
        {group.items.map((item) => (
          <li key={item.id} className="flex items-baseline justify-between gap-4">
            {item.credentialUrl ? (
              <a
                href={item.credentialUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="touch-target text-sm text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4"
              >
                {item.name}
              </a>
            ) : (
              <span className="text-sm text-ink">{item.name}</span>
            )}
            <span className="num text-xs text-ink-muted">{item.date ?? item.year}</span>
          </li>
        ))}
      </ul>
    ),
  }));

  // Rendered here and handed down, so the revealed entries are the same
  // markup they always were and the client leaf carries no content data.
  const timelineEntries = aboutTimeline.map((entry) => (
    <li key={entry.id} className="flex flex-col gap-1.5">
      <span className="flex items-center gap-2">
        <Icon name={KIND_ICON[entry.kind] ?? "Briefcase"} size={18} />
        <span className="text-base font-medium text-ink">{entry.title}</span>
      </span>
      <span className="text-sm text-ink-muted">
        {entry.org}
        {entry.location ? `, ${entry.location}` : ""}
      </span>
      <span className="num text-xs text-ink-muted">{entry.display}</span>
      {entry.bullets[0] ? (
        <span className="mt-1 text-sm text-ink-muted">{entry.bullets[0]}</span>
      ) : null}
    </li>
  ));

  return (
    <section id="about" className={`${LAYOUT.section} border-t border-line`}>
      <div className={LAYOUT.container}>
        <Reveal>
          <SectionHeading>About.</SectionHeading>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16">
          <Reveal className="flex flex-col gap-8">
            <div className={`flex flex-col gap-4 ${LAYOUT.measure} text-base text-ink-muted`}>
              <p>
                Information Systems graduate from Universitas Sriwijaya, GPA 3.97 out of 4.00,
                graduating Apr 2025, with three years across content, communications, data, and
                organizational leadership.
              </p>
              <p>
                Comfortable on the creative side and the analytical side, and usually working on
                something that needs both.
              </p>
              <p>Keeps learning through self-driven certifications.</p>
            </div>

            <p className="num text-xs text-ink-muted">
              {languages.map((language) => `${language.name} (${language.level})`).join(", ")}
            </p>

            <div className="flex flex-col">
              <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
                Awards
              </h3>
              <ul className="mt-4 flex flex-col">
                {awardList.map((award) => (
                  <li
                    key={award.id}
                    className="flex flex-col gap-1 border-t-2 border-ink py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                  >
                    <span className="font-display text-lg font-extrabold tracking-tight text-ink">
                      {award.title}
                    </span>
                    <span className="num text-xs text-ink-muted">
                      {award.org} {award.year}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
                Experience
              </h3>

              <ExperienceTimeline
                entries={timelineEntries}
                visibleCount={ENTRIES_BEFORE_REVEAL}
              />
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
                Certifications
              </h3>
              <Accordion items={certItems} ariaLabel="Certifications by issuer" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
