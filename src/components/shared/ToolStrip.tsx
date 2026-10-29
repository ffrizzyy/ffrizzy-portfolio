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
 * Spec 4.4 tools strip: logo marks with accessible names and no captions.
 *
 * This used to run as a marquee. A perpetual loop in the middle of a reading
 * page pulled the eye away from the skills panels above it, and the marks are
 * reference material rather than something to watch, so the strip now sits
 * still and wraps into a centred wall. Every tool keeps its accessible name.
 *
 * Most marks come straight from simple-icons. A few brands the strip carries
 * are not in that set (Microsoft Excel, Adobe Photoshop, Visual Studio Code,
 * OpenAI/ChatGPT); those live in lib/brand-icons.ts, copied from other public
 * icon sets rather than hand-drawn, so spec 1.1's rule about not drawing a
 * missing brand is kept. A slug missing from both maps is still dropped
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
 * The marks are reference material, so the wall is static. An eight column grid
 * holds the current 31 tools in four near even rows, and drops to four columns
 * on a phone. A wrapping flex row was tried first and left the last mark alone
 * on a line of its own, which read as an accident rather than a wall.
 */
export function ToolStrip() {
  const available = toolList.filter((tool) => tool.slug in BRAND_ICONS);

  return (
    <div className="border-y-2 border-ink py-8">
      <ul className="grid grid-cols-4 place-items-center gap-x-6 gap-y-7 md:grid-cols-8 md:gap-x-10">
        {available.map((tool) => {
          const brand = BRAND_ICONS[tool.slug];
          if (!brand) return null;
          return (
            <li key={tool.slug} className="text-ink transition-colors hover:text-signal">
              <svg
                viewBox={brand.viewBox}
                role="img"
                aria-label={tool.name}
                className="size-8"
                fill="currentColor"
              >
                <path d={brand.path} />
              </svg>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
