import { Icon, type IconName } from "@/components/shared/Icon";
import { TrackedLink } from "@/components/shared/TrackedLink";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { SITE } from "@/lib/constants";

/**
 * The owner's public accounts, in one place so the navbar, the hero, and the
 * footer cannot drift apart. Each entry carries its own accessible name; the
 * marks are icon-only because a reader recognises them faster than the words.
 *
 * The navbar only shows the two work accounts. The hero and the footer show all
 * four, because that is where a visitor looks for a way to reach the owner.
 */
export const SOCIAL_LINKS = [
  { key: "github", label: "GitHub", href: SITE.github, icon: "GithubLogo" },
  { key: "linkedin", label: "LinkedIn", href: SITE.linkedin, icon: "LinkedinLogo" },
  { key: "instagram", label: "Instagram", href: SITE.instagram, icon: "InstagramLogo" },
  { key: "whatsapp", label: "WhatsApp", href: SITE.whatsapp, icon: "WhatsappLogo" },
] as const satisfies ReadonlyArray<{
  key: string;
  label: string;
  href: string;
  icon: IconName;
}>;

export function SocialIconLink({
  link,
  className,
}: {
  link: (typeof SOCIAL_LINKS)[number];
  className?: string;
}) {
  return (
    <TrackedLink
      href={link.href}
      event={ANALYTICS_EVENTS.projectOutbound}
      eventProps={{ target: link.key }}
      external
      ariaLabel={link.label}
      className={className}
    >
      <Icon name={link.icon} size={18} />
    </TrackedLink>
  );
}
