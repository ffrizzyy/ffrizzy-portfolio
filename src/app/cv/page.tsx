import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Icon } from "@/components/shared/Icon";
import { PrintButton } from "@/components/shared/PrintButton";
import { TrackedLink } from "@/components/shared/TrackedLink";
import { TagChip } from "@/components/ui/Chip";
import { broadSkills } from "@/content/site";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { findMissingAssets } from "@/lib/assets.server";
import { LAYOUT, SITE } from "@/lib/constants";
import {
  awardList,
  certList,
  educationList,
  featuredProjects,
  languages,
  skillsMap,
  timelineList,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "CV",
  description: `Curriculum vitae for ${SITE.name}: experience, education, selected work, and certifications.`,
  alternates: { canonical: "/cv" },
  openGraph: { title: `CV | ${SITE.shortName}`, type: "profile" },
};

/**
 * The CV page.
 *
 * Spec 3 originally made /cv a redirect to a PDF. This replaces that with a
 * real page for three reasons: there is no PDF yet, HTML is searchable and
 * linkable where a PDF is not, and one source of truth cannot drift the way a
 * separate document does. The page offers the browser's print pipeline as the
 * PDF exporter, and links a hosted PDF automatically once one exists.
 *
 * Print rules live in globals.css: nav, footer, texture, and buttons drop out so
 * what comes off the printer is the document itself.
 */
function CvSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10 border-t-2 border-ink pt-5">
      <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function CvPage() {
  // The PDF is an optional asset, so the download button appears on its own
  // once someone drops the file into public/. No dead link until then.
  const pdfMissing = findMissingAssets([SITE.cvPath]).length > 0;

  const contact = [
    { label: SITE.email, href: `mailto:${SITE.email}`, external: false },
    { label: "LinkedIn", href: SITE.linkedin, external: true },
    { label: "GitHub", href: SITE.github, external: true },
  ];

  return (
    <div className={`${LAYOUT.section} pb-24`}>
      <div className={`${LAYOUT.container} print-cv max-w-4xl`}>
        {/* Header. Hidden chrome in print means the contact details have to be
            part of the document itself. */}
        <header className="flex flex-col gap-4 border-b-2 border-ink pb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl">{SITE.name}</h1>
              <p className="mt-2 text-base text-ink-muted">
                {SITE.role} / AI web apps, data dashboards, and content
              </p>
            </div>

            <div className="no-print flex flex-wrap items-center gap-3">
              {pdfMissing ? null : (
                <a
                  href={SITE.cvPath}
                  className="inline-flex h-11 items-center rounded-pill border-2 border-ink px-6 text-[0.95rem] font-medium text-ink transition-colors hover:bg-paper-sunken"
                >
                  Download PDF
                </a>
              )}
              <PrintButton />
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

        <CvSection title="Summary">
          <p className="max-w-[65ch] text-base text-ink-muted">
            Information Systems graduate from Universitas Sriwijaya (GPA 3.97 out of 4.00, Apr
            2025) with three years across content, communications, data, and organizational
            leadership. Comfortable on the creative side and the analytical side, and usually
            working on something that needs both.
          </p>
        </CvSection>

        <CvSection title="Experience">
          <ol className="flex flex-col gap-5">
            {timelineList.map((entry) => (
              <li key={entry.id} className="flex flex-col gap-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <span className="text-base font-medium text-ink">{entry.title}</span>
                  <span className="num text-xs text-ink-muted">{entry.display}</span>
                </div>
                <span className="text-sm text-ink-muted">{entry.org}</span>
                {entry.summary ? (
                  <span className="mt-0.5 max-w-[65ch] text-sm text-ink-muted">{entry.summary}</span>
                ) : null}
              </li>
            ))}
          </ol>
        </CvSection>

        <CvSection title="Education">
          <ol className="flex flex-col gap-5">
            {educationList.map((entry) => (
              <li key={entry.id} className="flex flex-col gap-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <span className="text-base font-medium text-ink">{entry.institution}</span>
                  <span className="num text-xs text-ink-muted">{entry.display}</span>
                </div>
                <span className="text-sm text-ink-muted">{entry.degree}</span>
                <span className="num text-sm text-ink-muted">{entry.detail}</span>
              </li>
            ))}
          </ol>
        </CvSection>

        <CvSection title="Selected work">
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
                  <span className="num text-xs uppercase tracking-[0.14em] text-ink-muted">
                    {project.type}
                  </span>
                </div>
                <p className="max-w-[65ch] text-sm text-ink-muted">{project.outcome}</p>
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

        <CvSection title="Skills">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <p className="num text-xs uppercase tracking-[0.14em] text-ink-muted">Broad</p>
              <ul className="flex flex-wrap gap-2">
                {broadSkills.map((skill) => (
                  <li key={skill}>
                    <TagChip>{skill}</TagChip>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <p className="num text-xs uppercase tracking-[0.14em] text-ink-muted">Deep</p>
              <ul className="flex flex-col gap-1.5">
                {skillsMap.map((entry) => (
                  <li key={entry.skill.id} className="text-sm text-ink-muted">
                    <span className="text-ink">{entry.skill.name}</span>
                    {" / "}
                    {entry.usedIn.length} {entry.usedIn.length === 1 ? "project" : "projects"}
                  </li>
                ))}
              </ul>
            </div>
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

        <CvSection title="Certifications">
          <div className="flex flex-col gap-4">
            {certList.map((group) => (
              <div key={group.issuer} className="flex flex-col gap-1.5">
                <p className="text-sm font-medium text-ink">{group.issuer}</p>
                <ul className="flex flex-col gap-1">
                  {group.items.map((item) => (
                    <li key={item.id} className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <span className="text-sm text-ink-muted">{item.name}</span>
                      <span className="num text-xs text-ink-muted">{item.year}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
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
            className="inline-flex items-center gap-1.5 text-base font-medium text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4"
          >
            <Icon name="ArrowUpRight" size={18} />
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
