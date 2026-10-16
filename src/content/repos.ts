import type { Repo } from "./schema";

/**
 * Every public repository on the GitHub account, newest first.
 *
 * This is a typed module rather than a runtime fetch, so the section builds
 * offline and its copy is reviewable in a diff. When a repository also has a
 * case study on this site, `projectSlug` points at it so the card can link
 * across to the write-up. A repository without one still appears here: the
 * point of the list is that it is complete, not that it is curated.
 *
 * Descriptions are condensed from each repository's own GitHub description.
 */
export const repos: Repo[] = [
  {
    name: "frizzy-store-system",
    description:
      "Stock, sales, and cash system for a phone counter, with a cash recovery engine covering true burn, runway, and open-to-buy",
    url: "https://github.com/ffrizzyy/frizzy-store-system",
    language: "TypeScript",
  },
  {
    name: "she-aint-allat",
    description:
      "Browser extension that interrupts the urge to look someone up, with pop-ups you choose in advance. Local first, no account, no tracking",
    url: "https://github.com/ffrizzyy/she-aint-allat",
    language: "JavaScript",
  },
  {
    name: "loopnote",
    description:
      "Photograph a whiteboard and get a summary plus flashcards scheduled with SM-2, as an Expo app on an Express API",
    url: "https://github.com/ffrizzyy/loopnote",
    language: "TypeScript",
  },
  {
    name: "azzifa",
    description:
      "Full-stack journaling app with an Express API, SQLite, scrypt auth, a provider-agnostic AI layer, and Docker",
    url: "https://github.com/ffrizzyy/azzifa",
    language: "HTML",
    homepage: "https://azzifa.up.railway.app",
    projectSlug: "azzifa",
  },
  {
    name: "H8-test-genai",
    description:
      "Streamlit app on IBM watsonx.ai, built during the Hacktiv8 IBM Generative AI and Machine Learning program",
    url: "https://github.com/ffrizzyy/H8-test-genai",
    language: "Python",
    projectSlug: "watsonx-genai-app",
  },
  {
    name: "redesign",
    description:
      "Go backend with a layered structure: controller, service, repository, model, and middleware, for the GDSC UNSRI Redesign Challenge",
    url: "https://github.com/ffrizzyy/redesign",
    language: "Go",
    projectSlug: "redesign-challenge",
  },
];
