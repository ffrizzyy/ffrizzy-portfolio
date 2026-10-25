import { siGo, siHtml5, siJavascript, siPython, siTypescript } from "simple-icons";
import type { CSSProperties } from "react";

import { Icon } from "@/components/shared/Icon";
import type { Repo } from "@/content/schema";
import { cn } from "@/lib/utils";

/**
 * The repositories as a ring.
 *
 * Each node is the mark of the repository's primary language, or its initial
 * when the language has no entry in simple-icons. The ring turns slowly and the
 * marks counter-rotate, so they read upright the whole way round. Pure CSS: two
 * animations at the same duration in opposite directions, no state, no frame
 * loop.
 *
 * It is decoration over data that is already on the page in full below, so the
 * whole thing is `aria-hidden` and every node carries a `title` for a mouse.
 * Hovering the ring holds it still, which is also how a reader can read a mark
 * without chasing it. Under reduced motion the ring does not turn.
 */
const LANGUAGE_MARK: Record<string, { path: string; name: string }> = {
  TypeScript: { path: siTypescript.path, name: "TypeScript" },
  JavaScript: { path: siJavascript.path, name: "JavaScript" },
  Python: { path: siPython.path, name: "Python" },
  Go: { path: siGo.path, name: "Go" },
  HTML: { path: siHtml5.path, name: "HTML" },
};

export function RepoOrbit({ repos, className }: { repos: Repo[]; className?: string }) {
  const nodes = repos.slice(0, 10);
  const count = Math.max(nodes.length, 1);

  return (
    <div aria-hidden className={cn("orbit", className)}>
      <span className="orbit-ring" />
      <span className="orbit-ring-inner" />

      <div className="orbit-spin">
        {nodes.map((repo, index) => {
          const mark = repo.language ? LANGUAGE_MARK[repo.language] : undefined;

          return (
            <span
              key={repo.name}
              className="orbit-node"
              style={{ "--i": index, "--n": count } as CSSProperties}
            >
              <span className="orbit-node-inner" title={`${repo.name}${repo.language ? ` / ${repo.language}` : ""}`}>
                {mark ? (
                  <svg viewBox="0 0 24 24" className="size-4 fill-ink">
                    <path d={mark.path} />
                  </svg>
                ) : (
                  <span className="font-display text-xs font-extrabold uppercase text-ink">
                    {repo.name.slice(0, 2)}
                  </span>
                )}
              </span>
            </span>
          );
        })}
      </div>

      <span className="absolute inset-0 grid place-items-center">
        <span className="grid size-12 place-items-center rounded-full border-2 border-ink bg-signal text-on-signal shadow-hard">
          <Icon name="GithubLogo" size={22} />
        </span>
      </span>
    </div>
  );
}
