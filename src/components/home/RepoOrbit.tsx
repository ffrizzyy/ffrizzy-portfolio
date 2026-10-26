"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import OrbitImages from "@/components/reactbits/OrbitImages";
import { cn } from "@/lib/utils";

export type OrbitRepo = {
  name: string;
  language?: string | null;
  stars: number;
};

type Palette = {
  paper: string;
  ink: string;
  muted: string;
  line: string;
  signal: string;
};

/**
 * The palette is duplicated here because an SVG loaded through `<img src>` is
 * its own document: the page's custom properties do not cross into it. The
 * values are the light and dark tokens from globals.css.
 */
const PALETTE: Record<"light" | "dark", Palette> = {
  light: {
    paper: "#f5f6f6",
    ink: "#111214",
    muted: "#4a4d52",
    line: "#c4c7ca",
    signal: "#e2683a",
  },
  dark: {
    paper: "#17181b",
    ink: "#e9eaea",
    muted: "#a3a6ab",
    line: "#2a2c30",
    signal: "#e2683a",
  },
};

const CARD = 240;

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Break a repository name into at most three lines at its own separators, so a
 * long slug reads as words rather than as a clipped run. A single segment wider
 * than the card is split at the character limit; anything past the third line is
 * dropped and marked with an ellipsis, because the full name is already on the
 * card below the orbit.
 */
function wrapName(name: string, maxChars = 12, maxLines = 3) {
  const words = name.split(/[-_. ]+/).filter(Boolean);
  const lines: string[] = [];

  for (const word of words) {
    const chunks: string[] = [];
    for (let i = 0; i < word.length; i += maxChars) chunks.push(word.slice(i, i + maxChars));

    for (const chunk of chunks) {
      const last = lines[lines.length - 1];
      if (last && last.length + 1 + chunk.length <= maxChars) {
        lines[lines.length - 1] = `${last} ${chunk}`;
      } else {
        lines.push(chunk);
      }
    }
  }

  if (lines.length <= maxLines) return lines;

  const kept = lines.slice(0, maxLines);
  const lastIndex = kept.length - 1;
  kept[lastIndex] = `${(kept[lastIndex] ?? "").slice(0, maxChars - 1)}...`;
  return kept;
}

/** One repository as a square paper card, encoded as an image source. */
function cardSource(repo: OrbitRepo, palette: Palette) {
  const lines = wrapName(repo.name);
  const name = lines
    .map(
      (line, index) =>
        `<text x="18" y="${92 + index * 34}" font-family="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="27" font-weight="700" letter-spacing="-0.4" fill="${palette.ink}">${escapeXml(line)}</text>`,
    )
    .join("");

  const meta = [repo.language, repo.stars > 0 ? `${repo.stars} star${repo.stars === 1 ? "" : "s"}` : "public repo"]
    .filter(Boolean)
    .map((value) => escapeXml(String(value).toUpperCase()))
    .join(" / ");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD}" height="${CARD}" viewBox="0 0 ${CARD} ${CARD}"><rect x="2" y="2" width="${CARD - 4}" height="${CARD - 4}" fill="${palette.paper}" stroke="${palette.ink}" stroke-width="4"/><rect x="18" y="20" width="10" height="10" fill="${palette.signal}"/><text x="36" y="30" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11" letter-spacing="1.6" fill="${palette.muted}">REPO</text>${name}<line x1="18" y1="190" x2="222" y2="190" stroke="${palette.line}" stroke-width="1"/><text x="18" y="214" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11" letter-spacing="1.1" fill="${palette.muted}">${meta}</text></svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * The repositories as an orbit, using the React Bits component.
 *
 * This replaced the language-mark ring: the thing that turns is now the
 * repositories themselves, each drawn as a small paper card with its name, its
 * primary language, and its stars. There is no centre mark, which is what
 * removes the spinning GitHub logo.
 *
 * The grid below carries the same repositories in full, so the orbit is
 * decorative and `OrbitImages` marks it `aria-hidden` when no click handler is
 * supplied. The cards are generated per theme because an SVG image cannot read
 * the page's CSS variables.
 */
export function RepoOrbit({ repos, className }: { repos: OrbitRepo[]; className?: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const dark = resolvedTheme !== "light";
  const palette = dark ? PALETTE.dark : PALETTE.light;
  const cards = repos.slice(0, 10).map((repo) => cardSource(repo, palette));

  return (
    <div
      className={cn(
        "repo-orbit hidden h-[26rem] w-full items-center overflow-hidden lg:flex xl:h-[30rem]",
        className,
      )}
      aria-hidden
    >
      {mounted && cards.length > 1 ? (
        <OrbitImages
          images={cards}
          shape="ellipse"
          baseWidth={1400}
          radiusX={660}
          radiusY={220}
          itemSize={176}
          itemRadius={0}
          rotation={-6}
          duration={58}
          direction="normal"
          fill
          showPath={false}
          shadow={0.16}
          depth={0.24}
          hoverScale={1.03}
          hoverSpeed={0.16}
          draggable={false}
          clickToFront={false}
          intro
          width="100%"
          height="100%"
        />
      ) : null}
    </div>
  );
}
