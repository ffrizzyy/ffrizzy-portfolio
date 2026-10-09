"use client";

import type { ReactNode } from "react";

import { ANALYTICS_EVENTS, track, type AnalyticsEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Links that fire one of the four stable analytics events from spec 6 before
 * navigating. Kept as a client leaf so the surrounding layout stays a Server
 * Component.
 */
export function TrackedLink({
  href,
  event,
  eventProps,
  children,
  className,
  external = false,
  ariaLabel,
}: {
  href: string;
  event: AnalyticsEvent;
  eventProps?: Record<string, string>;
  children: ReactNode;
  className?: string;
  external?: boolean;
  ariaLabel?: string;
}) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={cn(className)}
      onClick={() => track(event, eventProps)}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
    >
      {children}
    </a>
  );
}

/** Spec 6: /cv redirects to the PDF and fires cv_download. */
export function CvLink({
  children,
  className,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <TrackedLink
      href="/cv"
      event={ANALYTICS_EVENTS.cvDownload}
      className={className}
      ariaLabel={ariaLabel}
    >
      {children}
    </TrackedLink>
  );
}
