import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
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

export default function RootLayout({ children }: { children: ReactNode }) {
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
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

            <Nav />

            {/* The nav floats over the page, so content starts below it. The
                offset comes from the same constant the nav itself uses. */}
            <main id="main" style={{ paddingTop: LAYOUT.navTotal }}>
              {children}
            </main>

            <Footer />
          </IconProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
