import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Icon } from "@/components/shared/Icon";
import { TrackedLink } from "@/components/shared/TrackedLink";
import { ButtonLink } from "@/components/ui/Button";
import { TagChip } from "@/components/ui/Chip";
import type { TimelineEntry } from "@/content/schema";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { findMissingAssets } from "@/lib/assets.server";
import { LAYOUT, SITE } from "@/lib/constants";
import {
  awardList,
  certList,
  educationList,
  experienceList,
  featuredProjects,
  leadershipList,
  skillCategoryList,
  summary,
  languages,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "CV",
  description: `Curriculum vitae for ${SITE.name}: experience, education, selected work, and certifications.`,
  alternates: { canonical: "/cv" },
  openGraph: { title: `CV | ${SITE.shortName}`, type: "profile" },
};

/**
 * The CV page, structured to mirror the CV document itself: professional
 * experience and leadership experience as two separate sections, then
 * education, selected work, certifications, skills, awards, and languages.
 *
 * All of this content is transcribed from the CV. The one deliberate omission
 * is the phone number in the CV header: the spec (section 9.1) says it is not
 * published, and this repository is public, so email and LinkedIn are the
 * contact routes.
 *
 * Spec 3 originally made /cv a redirect to a PDF. It is a page instead: there is
 * no PDF yet, HTML is searchable and linkable where a PDF is not, and one source
 * of truth cannot drift the way a second document does. The browser's print
 * pipeline is the exporter, and a hosted PDF is linked automatically once one
 * exists.
 */
function CvSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10 border-t-2 border-ink pt-5">
      <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** One role: title and dates on a line, org and place beneath, then the bullets. */
function RoleEntry({ entry }: { entry: TimelineEntry }) {
  return (
    <li className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <span className="text-base font-medium text-ink">{entry.title}</span>
        <span className="num text-xs text-ink-muted">{entry.display}</span>
      </div>
      <span className="text-sm text-ink-muted">
        {entry.org}
        {entry.location ? `, ${entry.location}` : ""}
      </span>
      {entry.bullets.length > 0 ? (
        <ul className="mt-1 flex flex-col gap-1">
          {entry.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2.5 text-sm text-ink-muted">
              <span aria-hidden className="mt-2 size-1 shrink-0 bg-signal" />
              <span className="max-w-[68ch]">{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export default function CvPage() {
  // Both CVs are optional assets, so each download button appears on its own once
  // someone drops the file into public/. No dead links until then.
  const missing = findMissingAssets([SITE.cvPath, SITE.cvPathId]);
  const downloads = [
    { href: SITE.cvPath, ready: !missing.includes(SITE.cvPath), badge: "EN" },
    { href: SITE.cvPathId, ready: !missing.includes(SITE.cvPathId), badge: "ID" },
  ];

  const contact = [
    { label: SITE.email, href: `mailto:${SITE.email}`, external: false },
    { label: "LinkedIn", href: SITE.linkedin, external: true },
    { label: "GitHub", href: SITE.github, external: true },
  ];

  return (
    <div className={`${LAYOUT.section} pb-24`}>
      <div className={`${LAYOUT.container} print-cv max-w-4xl`}>
        {/* Header. Chrome is hidden in print, so the contact details have to be
            part of the document itself. */}
        <header className="flex flex-col gap-4 border-b-2 border-ink pb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl">{SITE.name}</h1>
              <p className="mt-2 text-base text-ink-muted">
                {SITE.role} / AI web apps, data dashboards, and content
              </p>
              <p className="num mt-1 text-sm text-ink-muted">{SITE.location}</p>
            </div>

            {/* The downloads now carry the primary treatment the print button
                used to own. With real English and Indonesian documents there is
                nothing left for a browser-generated PDF to add. */}
            <div className="no-print flex flex-wrap items-center gap-3">
              {downloads.map((item) =>
                item.ready ? (
                  <ButtonLink key={item.badge} href={item.href} variant="primary" size="md">
                    Download CV
                    <span className="num text-xs uppercase tracking-[0.12em] opacity-80">
                      {item.badge}
                    </span>
                  </ButtonLink>
                ) : null,
              )}
            </div>
          </div>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            {contact.map((item) => (
              <li key={item.href}>
                {item.external ? (
                  <TrackedLink
                    href={item.href}
                    event={ANALYTICS_EVENTS.projectOutbound}
                    eventProps={{ target: "cv-contact" }}
                    external
                    className="text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4"
                  >
                    {item.label}
                  </TrackedLink>
                ) : (
                  <a
                    href={item.href}
                    className="text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4"
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </header>

        <CvSection title="Professional summary">
          <p className="max-w-[68ch] text-base text-ink-muted">{summary}</p>
        </CvSection>

        <CvSection title="Professional experience">
          <ol className="flex flex-col gap-6">
            {experienceList.map((entry) => (
              <RoleEntry key={entry.id} entry={entry} />
            ))}
          </ol>
        </CvSection>

        <CvSection title="Leadership and organizational experience">
          <ol className="flex flex-col gap-6">
            {leadershipList.map((entry) => (
              <RoleEntry key={entry.id} entry={entry} />
            ))}
          </ol>
        </CvSection>

        <CvSection title="Education">
          <ol className="flex flex-col gap-6">
            {educationList.map((entry) => (
              <li key={entry.id} className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <span className="text-base font-medium text-ink">{entry.institution}</span>
                  <span className="num text-xs text-ink-muted">{entry.display}</span>
                </div>
                <span className="text-sm text-ink-muted">
                  {entry.degree}
                  {entry.location ? `, ${entry.location}` : ""}
                </span>
                <span className="num text-sm text-ink-muted">{entry.detail}</span>
                {entry.bullets.length > 0 ? (
                  <ul className="mt-1 flex flex-col gap-1">
                    {entry.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2.5 text-sm text-ink-muted">
                        <span aria-hidden className="mt-2 size-1 shrink-0 bg-signal" />
                        <span className="max-w-[68ch]">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>
        </CvSection>

        <CvSection title="Selected projects">
          <ol className="flex flex-col gap-5">
            {featuredProjects.map((project) => (
              <li key={project.slug} className="flex flex-col gap-2">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <a
                    href={`/work/${project.slug}`}
                    className="text-base font-medium text-ink underline decoration-line decoration-2 underline-offset-4 hover:decoration-signal"
                  >
                    {project.title}
                  </a>
                  <span className="num text-xs text-ink-muted">{project.period}</span>
                </div>
                <p className="max-w-[68ch] text-sm text-ink-muted">{project.outcome}</p>
                <ul className="flex flex-wrap gap-2">
                  {project.stack.slice(0, 4).map((item) => (
                    <li key={item}>
                      <TagChip>{item}</TagChip>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </CvSection>

        <CvSection title="Certifications">
          <div className="flex flex-col gap-4">
            {certList.map((group) => (
              <div key={group.issuer} className="flex flex-col gap-1.5">
                <p className="text-sm font-medium text-ink">{group.issuer}</p>
                <ul className="flex flex-col gap-1">
                  {group.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-wrap items-baseline justify-between gap-x-4"
                    >
                      <span className="text-sm text-ink-muted">{item.name}</span>
                      <span className="num text-xs text-ink-muted">{item.date ?? item.year}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CvSection>

        <CvSection title="Skills">
          <div className="flex flex-col gap-5">
            {skillCategoryList.map((category) => (
              <div key={category.id} className="flex flex-col gap-2">
                <p className="num text-xs uppercase tracking-[0.14em] text-ink-muted">
                  {category.label}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <li key={item}>
                      <TagChip>{item}</TagChip>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CvSection>

        <CvSection title="Awards">
          <ol className="flex flex-col">
            {awardList.map((award) => (
              <li
                key={award.id}
                className="flex flex-wrap items-baseline justify-between gap-x-4 border-t border-line py-3 first:border-t-0"
              >
                <span className="text-base text-ink">{award.title}</span>
                <span className="num text-xs text-ink-muted">
                  {award.org} {award.year}
                </span>
              </li>
            ))}
          </ol>
        </CvSection>

        <CvSection title="Languages">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
            {languages.map((language) => (
              <li key={language.name}>
                <span className="text-ink">{language.name}</span> ({language.level})
              </li>
            ))}
          </ul>
        </CvSection>

        <div className="no-print mt-12 flex flex-wrap items-center gap-6 border-t border-line pt-6">
          <a
            href="/"
            className="group inline-flex items-center gap-1.5 text-base font-medium text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4"
          >
            <Icon name="ArrowUpRight" size={18} className="nudge" />
            Back to the portfolio
          </a>
          <span className="font-mono text-xs text-ink-muted">
            Source: content modules in src/content, validated at build time.
          </span>
        </div>
      </div>
    </div>
  );
}
