/**
 * Analytics event names. Spec 6: these names stay stable, never renamed
 * casually, because dashboards and goals are keyed to them.
 */

export const ANALYTICS_EVENTS = {
  cvDownload: "cv_download",
  contactSubmit: "contact_submit",
  projectOutbound: "project_outbound",
  articleOutbound: "article_outbound",
} as const;

export type AnalyticsEvent =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

type PlausibleFn = (event: string, options?: { props?: Record<string, string> }) => void;

declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

/**
 * Cookieless event dispatch. Deliberately a no-op when the analytics script is
 * absent, so the build works on a fresh clone with no secrets and no network.
 */
export function track(event: AnalyticsEvent, props?: Record<string, string>) {
  if (typeof window === "undefined") return;
  window.plausible?.(event, props ? { props } : undefined);
}
