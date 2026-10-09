import {
  siFigma,
  siGo,
  siGoogle,
  siMeta,
  siPython,
  siStreamlit,
  siTrello,
} from "simple-icons";

import { toolList } from "@/lib/content";

/**
 * Spec 4.4 tools strip: logo marks with accessible names and no captions, in a
 * 30s linear loop that pauses on hover and on focus. This is the only infinite
 * loop on the site.
 *
 * Spec 1.1 says to drop any brand missing from simple-icons rather than
 * hand-draw it. As of simple-icons 16, Microsoft Excel, Tableau, Canva, and
 * RapidMiner have no entry at all, so they are dropped from the strip. Those
 * capabilities are still listed on the page as stack chips and in the Deep
 * skills accordion, so nothing is lost but the logo.
 *
 * Colour note: spec 2.2 exempts third-party logos from the single-accent rule,
 * but spec 4.4 specifically asks the strip to turn signal on hover. The more
 * specific rule wins, so marks render in ink at rest and signal on hover.
 */
const BRAND_ICONS: Record<string, { title: string; path: string }> = {
  python: siPython,
  go: siGo,
  trello: siTrello,
  meta: siMeta,
  streamlit: siStreamlit,
  google: siGoogle,
  figma: siFigma,
};

/**
 * The track is duplicated and translated by exactly -50%, so the loop is
 * seamless only while half the track is at least as wide as the viewport.
 *
 * That is why this is six copies and not two. With two, the whole track came to
 * roughly 1230px against a container of about 1216px, so half of it was barely
 * one viewport wide: as the animation ran, the track ran out and left a few
 * hundred pixels of empty space at the trailing edge. Six copies put half the
 * track at about 1850px, which clears the widest the container can get.
 */
const COPIES = 6;

export function ToolStrip() {
  const available = toolList.filter((tool) => tool.slug in BRAND_ICONS);

  return (
    /* Borders sit on the outer element and the mask on the inner one, so the
       fade applies to the logos but not to the rules above and below them. */
    <div className="border-y-2 border-ink">
      <div className="strip-viewport strip-mask overflow-hidden py-7">
        <div className="strip-track">
          {Array.from({ length: COPIES }, (_, copy) => (
            <ul
              key={copy}
              // Only the first copy is exposed to assistive tech, so the tool
              // names are announced once rather than six times.
              aria-hidden={copy > 0}
              className="flex shrink-0 items-center gap-14 pr-14"
            >
              {available.map((tool) => {
                const brand = BRAND_ICONS[tool.slug];
                if (!brand) return null;
                return (
                  <li key={tool.slug} className="text-ink transition-colors hover:text-signal">
                    <svg
                      viewBox="0 0 24 24"
                      role={copy === 0 ? "img" : undefined}
                      aria-label={copy === 0 ? tool.name : undefined}
                      aria-hidden={copy > 0 ? true : undefined}
                      className="size-8"
                      fill="currentColor"
                    >
                      <path d={brand.path} />
                    </svg>
                  </li>
                );
              })}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
