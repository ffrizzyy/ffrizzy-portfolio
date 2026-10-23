import type { Repo } from "./schema";
import { repoSnapshot } from "./repos.snapshot";

/**
 * Curated copy for the public repositories.
 *
 * The list itself is discovered from GitHub, so adding a repository to the
 * account is enough for it to appear on the site. This module only holds the
 * editorial layer: the description that reads better than the repository's own
 * About field, the topics worth showing, the live deployment when there is one,
 * and the case study slug that lets a card link across to its write-up.
 *
 * Everything here is applied over `repoSnapshot`, which `pnpm sync:repos`
 * refreshes from the API. Re-running the sync cannot overwrite these fields.
 */
export type RepoOverride = Partial<
  Pick<Repo, "description" | "homepage" | "language" | "topics" | "license">
> & {
  projectSlug?: string;
};

export const repoOverrides: Record<string, RepoOverride> = {
  joevix: {
    description:
      "Local-only browser extension that restyles any page on your own screen, with themes, custom colors, and per-site layout",
    projectSlug: "joevix",
  },
  prepo: {
    description:
      "AI agent that turns a meeting into assigned tickets, mirrors them into Linear, and follows up until the work is done",
    topics: ["ai", "project-management", "nextjs", "postgres", "tauri"],
    projectSlug: "prepo",
  },
  "she-aint-allat": {
    description:
      "Browser extension that interrupts the urge to look someone up, with pop-ups you choose in advance. Local first, no account, no tracking",
    projectSlug: "she-aint-allat",
  },
  "kerinci-lang": {
    description:
      "A programming language built from Kerinci (Siulak) vocabulary, with a single-file Python interpreter and a 13-lesson tutorial",
    topics: ["programming-language", "kerinci", "python", "language-preservation"],
    projectSlug: "kerinci-lang",
  },
  "frizzy-store-system": {
    description:
      "Stock, sales, and cash system for a phone counter, with a cash recovery engine covering true burn, runway, and open-to-buy",
    topics: ["point-of-sale", "inventory", "cash-flow", "typescript"],
    projectSlug: "frizzy-store-system",
  },
  djournl: {
    description:
      "Full-stack journaling app with an Express API, SQLite, scrypt auth, a provider-agnostic AI layer, and Docker",
    homepage: "https://djournl.up.railway.app",
    language: "JavaScript",
    topics: ["journaling", "express", "sqlite", "ai"],
    projectSlug: "djournl",
  },
  loopnote: {
    description:
      "Photograph a whiteboard and get a summary plus flashcards scheduled with SM-2, as an Expo app on an Express API",
    topics: ["expo", "express", "spaced-repetition", "ai"],
    projectSlug: "loopnote",
  },
  "H8-test-genai": {
    description:
      "Streamlit app on IBM watsonx.ai, built during the Hacktiv8 IBM Generative AI and Machine Learning program",
    topics: ["watsonx", "streamlit", "generative-ai"],
    projectSlug: "watsonx-genai-app",
  },
  redesign: {
    description:
      "Go backend with a layered structure: controller, service, repository, model, and middleware, for the GDSC UNSRI Redesign Challenge",
    topics: ["go", "rest-api", "layered-architecture"],
    projectSlug: "redesign-challenge",
  },
};

/** Applies the editorial layer to one repository record. */
export function applyRepoOverrides(repo: Repo): Repo {
  const override = repoOverrides[repo.name];
  if (!override) return repo;

  return {
    ...repo,
    ...override,
    // A spread would let an absent homepage overwrite the snapshot's value with
    // undefined, so the fallback is explicit.
    homepage: override.homepage ?? repo.homepage,
  };
}

/**
 * The committed list, used when the GitHub API is unavailable. It is also the
 * set that `lib/content.ts` validates at import time, so an invalid record fails
 * the build even before a request is made.
 */
export const repoFallback: Repo[] = repoSnapshot.map(applyRepoOverrides);
