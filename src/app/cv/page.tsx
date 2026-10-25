import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { Icon, type IconName } from "@/components/shared/Icon";
import { SplitFlap } from "@/components/shared/SplitFlap";
import { TrackedLink } from "@/components/shared/TrackedLink";
import { ButtonLink } from "@/components/ui/Button";
import { TagChip } from "@/components/ui/Chip";
import type { TimelineEntry } from "@/content/schema";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { findMissingAssets } from "@/lib/assets.server";
import { LAYOUT, SITE } from "@/lib/constants";
import { getRepos, summarizeRepos } from "@/lib/github.server";
import { formatMonthYear } from "@/lib/utils";
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
 * published, and this repository is public, so email, LinkedIn, GitHub, and the
 * deployed site are the contact routes.
 *
 * Spec 3 originally made /cv a redirect to a PDF. It is a page instead: HTML is
 * searchable and linkable where a PDF is not, and one source of truth cannot
 * drift the way a second document does. The English and Indonesian PDFs sit in
 * public/ and are offered as downloads above; the page also exports itself
 * through the browser print pipeline.
 */
function CvSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: IconName;
  children: ReactNode;
}) {
  return (
    <section className="reveal mt-10 border-t-2 border-ink pt-5">
      <h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
        <Icon name={icon} size={16} className="shrink-0" />
        {title}
      </h2>
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

export default async function CvPage() {
  // Both CVs are optional assets, so each download button appears on its own once
  // someone drops the file into public/. No dead links until then.
  const missing = findMissingAssets([SITE.cvPath, SITE.cvPathId]);
  const downloads = [
    {
      href: SITE.cvPath,
      ready: !missing.includes(SITE.cvPath),
      badge: "EN",
      label: "Download CV, English",
    },
    {
      href: SITE.cvPathId,
      ready: !missing.includes(SITE.cvPathId),
      badge: "ID",
      label: "Download CV, Indonesian",
    },
  ];

  const repos = await getRepos();
  const repoStats = summarizeRepos(repos);

  const contact: { label: string; href: string; external: boolean; icon: IconName }[] = [
    { label: SITE.email, href: `mailto:${SITE.email}`, external: false, icon: "EnvelopeSimple" },
    { label: "LinkedIn", href: SITE.linkedin, external: true, icon: "LinkedinLogo" },
    { label: "GitHub", href: SITE.github, external: true, icon: "GithubLogo" },
    {
      // The CV header carries the deployed site, shown here as a bare domain.
      label: SITE.website.replace(/^https?:\/\//, ""),
      href: SITE.website,
      external: true,
      icon: "Globe",
    },
  ];

  return (
    <div className={`${LAYOUT.section} pb-24`}>
      <div className={`${LAYOUT.container} print-cv max-w-4xl`}>
        {/* Back control. The nav's About entry lands here from Home, so there
            has to be a way back that does not depend on the browser's back
            button, which is not there at all when this page was opened in a new
            tab or reached from a search result. Hidden in print. */}
        <div className="no-print mb-8">
          <Link
            href="/"
            className="group inline-flex min-h-11 items-center gap-2 rounded-pill border-2 border-ink bg-paper px-4 py-2 text-sm font-medium text-ink transition-[background-color,transform,box-shadow] duration-200 ease-zine hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-paper-raised hover:shadow-hard active:translate-x-0 active:translate-y-0 active:shadow-none"
          >
            <Icon name="ArrowLeft" size={18} className="nudge-left" />
            Back to home
          </Link>
        </div>

        {/* Header. Chrome is hidden in print, so the contact details have to be
            part of the document itself. */}
        <header className="reveal flex flex-col gap-4 border-b-2 border-ink pb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1
                aria-label={SITE.name}
                className="text-3xl md:text-4xl"
              >
                <SplitFlap text={SITE.name} />
              </h1>
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
                  <ButtonLink
                    key={item.badge}
                    href={item.href}
                    variant="primary"
                    size="md"
                    /* Without this the accessible name runs the parts together as
                       "Download CVEN", because the language badge is a separate
                       span and text nodes concatenate with no space. */
                    aria-label={item.label}
                  >
                    <Icon name="DownloadSimple" size={18} className="shrink-0" />
                    Download CV
                    <span aria-hidden className="num text-xs uppercase tracking-[0.12em] opacity-80">
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
                    className="touch-target inline-flex items-center gap-1.5 text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4"
                  >
                    <Icon name={item.icon} size={16} className="shrink-0" />
                    {item.label}
                  </TrackedLink>
                ) : (
                  <a
                    href={item.href}
                    className="touch-target inline-flex items-center gap-1.5 text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4"
                  >
                    <Icon name={item.icon} size={16} className="shrink-0" />
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </header>

        <CvSection title="Professional summary" icon="PenNib">
          <p className="max-w-[68ch] text-base text-ink-muted">{summary}</p>
        </CvSection>

        <CvSection title="Professional experience" icon="Briefcase">
          <ol className="flex flex-col gap-6">
            {experienceList.map((entry) => (
              <RoleEntry key={entry.id} entry={entry} />
            ))}
          </ol>
        </CvSection>

        <CvSection title="Leadership and organizational experience" icon="UsersThree">
          <ol className="flex flex-col gap-6">
            {leadershipList.map((entry) => (
              <RoleEntry key={entry.id} entry={entry} />
            ))}
          </ol>
        </CvSection>

        <CvSection title="Education" icon="GraduationCap">
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
                {entry.detail ? (
                  <span className="num text-sm text-ink-muted">{entry.detail}</span>
                ) : null}
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

        <CvSection title="Selected projects" icon="Code">
          <ol className="flex flex-col gap-5">
            {featuredProjects.map((project) => (
              <li key={project.slug} className="flex flex-col gap-2">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <a
                    href={`/work/${project.slug}`}
                    className="touch-target group inline-flex items-center gap-1 text-base font-medium text-ink underline decoration-line decoration-2 underline-offset-4 hover:decoration-signal"
                  >
                    {project.title}
                    <Icon name="ArrowUpRight" size={14} className="nudge shrink-0" />
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

        <CvSection title="Open source" icon="GithubLogo">
          <div className="flex flex-col gap-4">
            <p className="num text-xs uppercase tracking-[0.14em] text-ink-muted">
              {repoStats.total} public repositories on GitHub
            </p>

            <ol className="flex flex-col gap-4">
              {repos.map((repo) => (
                <li
                  key={repo.name}
                  className="flex flex-col gap-1.5 border-t border-line pt-4 first:border-t-0 first:pt-0"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="touch-target group inline-flex items-center gap-1 text-base font-medium text-ink underline decoration-line decoration-2 underline-offset-4 hover:decoration-signal"
                    >
                      {repo.name}
                      <Icon name="ArrowUpRight" size={14} className="nudge shrink-0" />
                    </a>
                    <span className="num text-xs text-ink-muted">
                      {[
                        repo.language,
                        repo.pushedAt ? `updated ${formatMonthYear(repo.pushedAt)}` : undefined,
                      ]
                        .filter(Boolean)
                        .join(" / ")}
                    </span>
                  </div>

                  <p className="max-w-[68ch] text-sm text-ink-muted">{repo.description}</p>

                  {repo.projectSlug ? (
                    <a
                      href={`/work/${repo.projectSlug}`}
                      className="touch-target w-fit text-sm font-medium text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4"
                    >
                      Case study
                    </a>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </CvSection>

        <CvSection title="Certifications" icon="Certificate">
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
                      {/* A certificate with a public verification page links to
                          it, so the claim can be checked rather than trusted. */}
                      {item.credentialUrl ? (
                        <a
                          href={item.credentialUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="touch-target group inline-flex items-center gap-1 text-sm text-ink-muted underline decoration-signal decoration-2 underline-offset-4 hover:text-ink hover:decoration-4"
                        >
                          {item.name}
                          <Icon name="ArrowUpRight" size={12} className="nudge shrink-0" />
                        </a>
                      ) : (
                        <span className="text-sm text-ink-muted">{item.name}</span>
                      )}
                      <span className="num text-xs text-ink-muted">{item.date ?? item.year}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CvSection>

        <CvSection title="Skills" icon="Wrench">
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

        <CvSection title="Awards" icon="Trophy">
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

        <CvSection title="Languages" icon="Globe">
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
            className="touch-target group inline-flex items-center gap-1.5 text-base font-medium text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4"
          >
            <Icon name="ArrowLeft" size={18} className="nudge-left" />
            Back to the portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
