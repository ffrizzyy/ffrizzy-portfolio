import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import { ThemeProvider } from "next-themes";
import type { CSSProperties, ReactNode } from "react";

import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { Nav } from "@/components/layout/Nav";
import { FrostIntro } from "@/components/shared/FrostIntro";
import { IconProvider } from "@/components/shared/Icon";
import { LAYOUT, SITE } from "@/lib/constants";
import "@/styles/globals.css";

/**
 * Spec 2.3 and 2.14: three fonts, self-hosted at build by next/font, each
 * exposing a CSS variable that the @theme block maps to a Tailwind family.
 * The deck fonts (Poppins, Montserrat) are intentionally not used.
 */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE.name} - Information Systems graduate`,
    template: `%s | ${SITE.shortName}`,
  },
  description:
    "Information Systems graduate shipping AI web apps, data dashboards, and content that grows audiences.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: `${SITE.name} - Information Systems graduate`,
    description:
      "Information Systems graduate shipping AI web apps, data dashboards, and content that grows audiences.",
    siteName: SITE.name,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  alternateName: SITE.shortName,
  jobTitle: SITE.role,
  email: `mailto:${SITE.email}`,
  url: siteUrl,
  sameAs: [SITE.linkedin, SITE.github],
};

/**
 * Escapes a JSON-LD payload before it goes into dangerouslySetInnerHTML.
 *
 * `</script>` inside any string would otherwise close the block and let the
 * remainder be parsed as markup, and U+2028/U+2029 are literal line terminators
 * in JavaScript. Every value here is currently authored in-repo, so this is
 * defence in depth rather than a live bug, but it is the difference between a
 * safe pattern and a landmine for whoever adds a user-supplied field later
 * (OWASP A03: injection).
 */
function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  // The nonce issued by src/middleware.ts. Next stamps its own script tags from
  // the request's CSP header, but a raw <script> written here has to be handed
  // the nonce explicitly.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    // suppressHydrationWarning is required: next-themes writes the theme
    // attribute before React hydrates, so the server cannot know the value.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bricolage.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: safeJsonLd(personJsonLd) }}
        />

        {/* Cookieless analytics, loaded only when a domain is configured, so a
            clone without secrets makes no third-party request at all. */}
        {plausibleDomain ? (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        ) : null}

        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          // Load-bearing under the nonce policy. next-themes injects its
          // pre-paint theme script as a raw <script> with no nonce, and CSP
          // blocks a parser-inserted inline script that has neither a nonce nor
          // a hash. Without this the theme attribute is not set until React
          // hydrates, which reintroduces exactly the flash the script exists to
          // prevent. Verified: the served HTML has 20 of 20 script tags
          // carrying the nonce only when this prop is present.
          nonce={nonce}
          // Spec 2.8 asks for a 300ms theme transition, so next-themes must not
          // suppress it. The provider's pre-paint script means it never fires on
          // load, so there is still no flash.
          disableTransitionOnChange={false}
        >
          <IconProvider>
            {/* One-pixel sentinel. The fixed nav watches this to decide whether
                the page has moved, which avoids a scroll listener entirely. */}
            <div id="nav-sentinel" aria-hidden className="h-px w-full" />

            {/* Spec 2.11: skip link is the first focusable element. */}
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-pill focus:border-2 focus:border-ink focus:bg-signal focus:px-4 focus:py-2 focus:text-on-signal"
            >
              Skip to content
            </a>

            {/* Spec 2.6: the texture is a fixed, pointer-events-none layer
                behind everything. It is never applied to a scrolling container. */}
            <div aria-hidden className="texture-layer" />

            {/* The opening freeze: a fixed, pointer-events-none frost layer plus
                the one attribute write that starts it. It is display:none until
                that attribute lands, and it is removed from the layout the
                moment the run is over, so it never sits over a control. It takes
                no pointer events at any point, and it sits below the fixed bars
                in the z scale, so neither of them is frozen or tinted. */}
            <div aria-hidden className="frost-overlay" />
            <FrostIntro />

            <Nav />

            {/* The nav floats over the page, so content starts below it. The
                offset comes from the same constant the nav itself uses.

                --mobile-nav-h is read by the mobile block in globals.css, which
                pads this element's bottom by the bar height plus the safe-area
                inset. The constant lives here, the media query lives in the
                stylesheet, and neither has to restate the other's numbers. */}
            <main
              id="main"
              style={{ paddingTop: LAYOUT.navTotal, "--mobile-nav-h": `${LAYOUT.mobileNavHeight}px` } as CSSProperties}
            >
              {children}
            </main>

            <Footer />

            {/* The mobile section bar is fixed to the bottom edge, so below md
                the page has to reserve its height or the last line of the footer
                sits underneath it. The padding that does it is keyed off the
                custom property set on <main> above; from md up the bar is hidden
                and that padding does not apply, which is what keeps the desktop
                render exactly what it was. */}
            <MobileNav />
          </IconProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
