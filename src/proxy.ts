import { NextResponse, type NextRequest } from "next/server";

/**
 * Content Security Policy with a per-request nonce.
 *
 * This is the file Next.js 16 calls `proxy`; it was `middleware` in earlier
 * versions and the two names are functionally identical. The convention matters
 * though: Next throws if both a `middleware` and a `proxy` file exist, and a
 * `proxy` file must export `proxy` (a named `middleware` export does not
 * satisfy it).
 *
 * Why this exists: the previous policy allowed `script-src 'unsafe-inline'`,
 * which is the single finding a security scanner will always flag, and it makes
 * CSP nearly useless as an XSS control. A nonce removes the need for it.
 *
 * How the nonce reaches Next's own scripts: Next reads the
 * `Content-Security-Policy` header off the *request*
 * (see next/dist/server/route-modules/app-page/parse-request-headers.js),
 * extracts the nonce, and stamps it onto every script tag it emits. So the
 * header has to be set on both the forwarded request and the response.
 *
 * `'strict-dynamic'` is what keeps third-party widgets working. Under CSP3 a
 * script trusted by nonce may load further scripts, so the Cloudflare Turnstile
 * widget and anything `next/script` injects are allowed without naming their
 * hosts. The explicit host allowlist is kept only for browsers that do not
 * implement `strict-dynamic`, since CSP3 browsers ignore it.
 *
 * CONSEQUENCE, and it is a real one: a nonce changes on every request, so these
 * pages can no longer be statically prerendered. Rendering moves from static to
 * per-request. That is the trade for dropping `unsafe-inline`, and it was
 * accepted deliberately. Deleting this file restores static rendering and also
 * restores the weaker policy.
 */
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV !== "production";

  // Only allow the analytics origin when analytics is actually configured, so a
  // deployment without it has no third-party script origin in its policy.
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ? "https://plausible.io" : "";

  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    "https://challenges.cloudflare.com",
    plausible,
    // Turbopack and the React refresh runtime need eval in development only.
    isDev ? "'unsafe-eval'" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const connectSrc = [
    "'self'",
    "https://challenges.cloudflare.com",
    plausible,
    // The dev server talks to its own websocket over plain HTTP.
    isDev ? "ws: http://localhost:* http://127.0.0.1:*" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const csp = [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    // Style attributes cannot carry a nonce, so inline styles stay allowed.
    // This is the documented Next.js recommendation and does not permit
    // arbitrary script execution.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://*.tile.openstreetmap.org",
    "font-src 'self' data:",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src https://challenges.cloudflare.com",
    "manifest-src 'self'",
    "worker-src 'self' blob:",
    `connect-src ${connectSrc}`,
    // Forces http subresources to https. Excluded in development, where it
    // would break http://localhost.
    isDev ? "" : "upgrade-insecure-requests",
  ]
    .filter(Boolean)
    .join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("content-security-policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("content-security-policy", csp);
  return response;
}

export const config = {
  /**
   * Every document and route handler, but not the immutable build assets, which
   * never contain a script tag of their own. Prefetches are skipped so a
   * prefetch cannot consume a nonce and leave the real navigation with a stale
   * one.
   */
  matcher: [
    {
      source: "/((?!_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
