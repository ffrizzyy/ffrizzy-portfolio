// Spec 2.10 enforcement: the site bans em-dashes and en-dashes in visible copy.
// A rule that is only checked by eye stops being true after the tenth edit, so
// the build fails here instead.
//
// The characters are written as escapes so this file cannot flag itself.
import { readdir, readFile } from "node:fs/promises";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const EM_DASH = "\u2014";
const EN_DASH = "\u2013";

// Resolved from this file, not from process.cwd(), so the check behaves the
// same whether it is run from the project root, from a workspace root, or by a
// CI step that happens to use a different working directory.
const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ROOT = join(PROJECT_ROOT, "src");
const EXTS = new Set([".ts", ".tsx", ".css"]);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (EXTS.has(extname(entry.name))) yield full;
  }
}

const offenders = [];
let scanned = 0;

for await (const file of walk(ROOT)) {
  scanned += 1;
  const lines = (await readFile(file, "utf8")).split(/\r?\n/);

  lines.forEach((line, index) => {
    const kind = line.includes(EM_DASH) ? "em-dash" : line.includes(EN_DASH) ? "en-dash" : null;
    if (kind) offenders.push(`${relative(PROJECT_ROOT, file)}:${index + 1}  ${kind}`);
  });
}

if (offenders.length > 0) {
  console.error("Copy check failed. Spec 2.10 bans em-dashes and en-dashes.\n");
  for (const offender of offenders) console.error(`  ${offender}`);
  console.error(
    `\n${offenders.length} offending line(s). Use a hyphen, comma, colon, or period. ` +
      "Ranges use a hyphen, for example 1993-2020.",
  );
  process.exit(1);
}

console.log(`Copy check passed: no em-dash or en-dash across ${scanned} source files.`);
