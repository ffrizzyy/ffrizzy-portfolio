import {
  siClaude,
  siDeepseek,
  siDocker,
  siFigma,
  siGit,
  siGithub,
  siGithubcopilot,
  siGo,
  siGoogle,
  siGooglegemini,
  siGooglesheets,
  siJira,
  siJavascript,
  siMeta,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siNotion,
  siPostgresql,
  siPython,
  siReact,
  siSqlite,
  siStreamlit,
  siTailwindcss,
  siTrello,
  siTypescript,
  siVercel,
} from "simple-icons";

import { EXTRA_BRAND_ICONS } from "@/lib/brand-icons";
import { toolList } from "@/lib/content";

/**
 * Spec 4.4 tools strip: logo marks with accessible names and no captions, in a
 * 30s linear loop that pauses on hover and on focus. This is the only infinite
 * loop on the site.
 *
 * Most marks come straight from simple-icons. A few brands the strip now
 * carries are not in that set (Microsoft Excel, Adobe Photoshop, Visual Studio
 * Code, OpenAI/ChatGPT); those live in lib/brand-icons.ts, copied from other
 * public icon sets rather than hand-drawn, so spec 1.1's rule about not drawing
 * a missing brand is kept. A slug missing from both maps is still dropped
 * silently, which is what lets the tools list carry a name before its mark
 * exists.
 *
 * Colour note: spec 2.2 exempts third-party logos from the single-accent rule,
 * but spec 4.4 specifically asks the strip to turn signal on hover. The more
 * specific rule wins, so marks render in ink at rest and signal on hover, and
 * every mark, including the sourced ones, is reduced to a single colour so the
 * row reads as one family.
 */
type BrandMark = { title: string; viewBox: string; path: string };

const SIMPLE_ICON_MARKS: Record<string, { title: string; path: string }> = {
  python: siPython,
  go: siGo,
  typescript: siTypescript,
  javascript: siJavascript,
  react: siReact,
  nextdotjs: siNextdotjs,
  nodedotjs: siNodedotjs,
  tailwindcss: siTailwindcss,
  docker: siDocker,
  git: siGit,
  github: siGithub,
  vercel: siVercel,
  notion: siNotion,
  googlesheets: siGooglesheets,
  jira: siJira,
  mysql: siMysql,
  postgresql: siPostgresql,
  sqlite: siSqlite,
  streamlit: siStreamlit,
  trello: siTrello,
  meta: siMeta,
  google: siGoogle,
  figma: siFigma,
  claude: siClaude,
  deepseek: siDeepseek,
  googlegemini: siGooglegemini,
  githubcopilot: siGithubcopilot,
};

/** simple-icons marks are all on the 24x24 grid. */
const BRAND_ICONS: Record<string, BrandMark> = {
  ...Object.fromEntries(
    Object.entries(SIMPLE_ICON_MARKS).map(([slug, mark]) => [
      slug,
      { ...mark, viewBox: "0 0 24 24" },
    ]),
  ),
  ...EXTRA_BRAND_ICONS,
};

/**
 * The track is duplicated and translated by exactly -50%, so the loop is
 * seamless only while half the track is at least as wide as the viewport.
 *
 * That is why this is six copies and not two. With two, the whole track came to
 * roughly 1230px against a container of about 1216px, so half of it was barely
 * one viewport wide: as the animation ran, the track ran out and left a few
 * hundred pixels of empty space at the trailing edge. Six copies put half the
 * track well past the widest the container can get, with room for the marks
 * added since.
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
                      viewBox={brand.viewBox}
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
