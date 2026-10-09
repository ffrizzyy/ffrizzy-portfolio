import type { NextConfig } from "next";

/**
 * Spec 6: /work, /content, /writing, /about, and /contact redirect to the
 * matching anchor on the one long Home page.
 *
 * Note on hashes: verify each redirect by hand after deploying. A hash-only
 * redirect that lands at the top of the page looks identical to a broken link
 * from the reader's side.
 */
const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/work", destination: "/#all", permanent: true },
      { source: "/content", destination: "/#content", permanent: true },
      { source: "/writing", destination: "/#writing", permanent: true },
      { source: "/about", destination: "/#about", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
    ];
  },

  async headers() {
    const headers = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];

    // The CSP is production only, and that is deliberate: Next's dev server and
    // the Turbopack HMR client need eval and a websocket, so a strict policy
    // breaks local development while telling you nothing about production.
    //
    // script-src carries 'unsafe-inline' because the App Router inlines its
    // bootstrap scripts. A nonce-based policy would be stricter; move to that
    // when there is a reason to, and re-test the Turnstile widget when you do.
    if (process.env.NODE_ENV === "production") {
      const csp = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://plausible.io",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob: https://*.tile.openstreetmap.org",
        "font-src 'self' data:",
        "connect-src 'self' https://challenges.cloudflare.com https://plausible.io",
        "frame-src https://challenges.cloudflare.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join("; ");

      headers.push({ key: "Content-Security-Policy", value: csp });
    }

    return [{ source: "/:path*", headers }];
  },
};

export default nextConfig;
