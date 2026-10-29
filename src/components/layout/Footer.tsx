import { Icon } from "@/components/shared/Icon";
import { SOCIAL_LINKS, SocialIconLink } from "@/components/shared/SocialLinks";
import { CvLink, TrackedLink } from "@/components/shared/TrackedLink";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { LAYOUT, SITE } from "@/lib/constants";

/**
 * Spec 2.7 footer: copyright line left, the contact routes right, single row
 * with a hairline top border. No version string, no locale or time strip.
 *
 * The email address lives here rather than in the contact section, so every
 * route to reach the owner sits in one place: a mail icon with the address,
 * then GitHub, LinkedIn, Instagram, and WhatsApp as icon-only links, then the
 * CV. The social links are icon-only because a reader recognises the marks
 * faster than the words, and each carries an aria-label so the name is still
 * announced. The email and the CV keep their text: an address a reader may want
 * to copy, and an action an icon alone would not explain.
 */
export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className={`${LAYOUT.container} flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between`}>
        <p className="text-sm text-ink-muted">{SITE.copyright}</p>

        <ul className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
          <li>
            <TrackedLink
              href={`mailto:${SITE.email}`}
              event={ANALYTICS_EVENTS.projectOutbound}
              eventProps={{ target: "email" }}
              ariaLabel={`Email ${SITE.email}`}
              className="touch-target group inline-flex items-center gap-2 text-ink transition-colors duration-200 ease-zine hover:text-signal"
            >
              <Icon name="EnvelopeSimple" size={18} />
              <span className="underline decoration-signal decoration-2 underline-offset-4 group-hover:decoration-4">
                {SITE.email}
              </span>
            </TrackedLink>
          </li>
          {SOCIAL_LINKS.map((link) => (
            <li key={link.key}>
              <SocialIconLink
                link={link}
                className="touch-target grid size-9 place-items-center rounded-pill border-2 border-ink text-ink transition-colors duration-200 ease-zine hover:bg-signal hover:text-on-signal"
              />
            </li>
          ))}
          <li>
            <CvLink
              ariaLabel="Download CV"
              className="touch-target group inline-flex items-center gap-2 text-ink transition-colors duration-200 ease-zine hover:text-signal"
            >
              <Icon name="DownloadSimple" size={18} />
              <span className="underline decoration-signal decoration-2 underline-offset-4 group-hover:decoration-4">
                Download CV
              </span>
            </CvLink>
          </li>
        </ul>
      </div>
    </footer>
  );
}
