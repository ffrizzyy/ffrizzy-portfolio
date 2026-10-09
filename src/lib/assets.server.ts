import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Asset check. Spec 7.1 invariant 2: a broken image path must be reported
 * rather than rendering an empty box.
 *
 * This module uses node:fs, so it must only ever be imported from a server
 * component. Importing it from a client component is a build error, which is
 * the guard we want.
 */
export function findMissingAssets(paths: string[]): string[] {
  const publicDir = join(process.cwd(), "public");
  const unique = [...new Set(paths)];
  return unique.filter((assetPath) => !existsSync(join(publicDir, assetPath)));
}

/**
 * Logs a single, readable warning listing every pending asset. It warns rather
 * than throws on purpose: the asset manifest in spec 14 is expected to be
 * incomplete at first, and spec 2.9 defines an honest placeholder frame for
 * exactly this state.
 */
export function reportMissingAssets(paths: string[], label: string): void {
  const missing = findMissingAssets(paths);
  if (missing.length === 0) return;

  console.warn(
    `[assets] ${missing.length} ${label} asset(s) are not in public/ yet and will render the ` +
      `pending frame from spec 2.9:\n  ${missing.join("\n  ")}`,
  );
}
