import { CvLink, TrackedLink } from "@/components/shared/TrackedLink";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { LAYOUT, SITE } from "@/lib/constants";

/**
 * Spec 2.7 footer: copyright line left, LinkedIn, GitHub, and Download CV
 * right, single row with a hairline top border. No version string, no locale or
 * time strip.
 */
export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className={`${LAYOUT.container} flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between`}>
        <p className="text-sm text-ink-muted">{SITE.copyright}</p>

        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <li>
            <TrackedLink
              href={SITE.linkedin}
              event={ANALYTICS_EVENTS.projectOutbound}
              eventProps={{ target: "linkedin" }}
              external
              className="text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4"
            >
              LinkedIn
            </TrackedLink>
          </li>
          <li>
            <TrackedLink
              href={SITE.github}
              event={ANALYTICS_EVENTS.projectOutbound}
              eventProps={{ target: "github" }}
              external
              className="text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4"
            >
              GitHub
            </TrackedLink>
          </li>
          <li>
            <CvLink className="text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4">
              Download CV
            </CvLink>
          </li>
        </ul>
      </div>
    </footer>
  );
}
