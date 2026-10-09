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
  /**
   * OWASP A05. `X-Powered-By: Next.js` advertises the framework and version to
   * anyone probing the site, and nothing depends on it. Suppress it.
   */
  poweredByHeader: false,

  /**
   * OWASP A05, applied to every response. This is the OWASP Secure Headers
   * baseline. The Content-Security-Policy is deliberately NOT here: it needs a
   * per-request nonce, so it is set in src/middleware.ts. Two CSP headers would
   * both be enforced and their intersection would break the site.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // A02: every request is forced onto TLS for two years.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
          // A05: never let a browser guess a content type.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // A01/A05: do not leak the path to third parties.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // A05: belt and braces alongside the frame-ancestors directive.
          { key: "X-Frame-Options", value: "DENY" },
          // Defence in depth for browsers that predate frame-ancestors.
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
          // A05: nothing on this site needs a device API.
          {
            key: "Permissions-Policy",
            value: [
              "camera=()",
              "microphone=()",
              "geolocation=()",
              "payment=()",
              "usb=()",
              "magnetometer=()",
              "gyroscope=()",
              "accelerometer=()",
            ].join(", "),
          },
          // A05: isolate the browsing context, and block cross-site embedding of
          // resources. same-site rather than same-origin so social crawlers can
          // still read the share cards.
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-site" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      { source: "/work", destination: "/#all", permanent: true },
      { source: "/content", destination: "/#content", permanent: true },
      { source: "/writing", destination: "/#writing", permanent: true },
      { source: "/about", destination: "/#about", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
    ];
  },
};

export default nextConfig;
