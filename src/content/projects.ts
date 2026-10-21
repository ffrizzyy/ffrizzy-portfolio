import type { Project } from "./schema";
import { kitoArticleUrl } from "./site";

/**
 * The seventeen project records. Spec 7 inventory, with the outcome lines from
 * spec 10.2. `tags` values must match a skill name in site.ts, and the build
 * fails if a skill resolves to no project (spec 7.1 invariant 1).
 *
 * The first three are the newest public repositories: Prepo, Joevix, and
 * KerinciLang. They were added when the Open source section began reading the
 * GitHub API, so every public repository now has a case study rather than only a
 * card.
 */
export const projects: Project[] = [
  {
    slug: "prepo",
    title: "Prepo",
    type: "build",
    featured: false,
    role: "Solo build: product, data model, app, extraction, follow-ups, and desktop shell",
    period: "Oct 2026",
    outcome:
      "An AI project manager that turns a meeting into assigned, grounded tickets, mirrors them into Linear, and chases the work until it is done.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Drizzle", "Tauri 2", "OpenRouter"],
    tags: [],
    links: [{ label: "GitHub", href: "https://github.com/ffrizzyy/prepo" }],
    cover: "/images/prepo.webp",
    caseStudy: {
      summary:
        "Prepo is a proxy project manager. A meeting goes in as a recording, a transcript, or pasted minutes, and comes out as minutes, decisions, open questions, and assigned tickets. It then follows up on those tickets and syncs them with Linear.",
      problem:
        "Action items usually die in a notes document. The meeting ends with a list of things somebody said they would do, and the list is never assigned, never scheduled, and never checked again. The gap is not note taking but the follow-through after the notes.",
      approach:
        "A pnpm monorepo with a Next.js app, a Tauri 2 desktop shell, shared Zod schemas, and a Postgres schema of 25 tables behind row-level security. Extraction is one model call per meeting through OpenRouter. The transcript is sent as untrusted JSON, the reply has to match a JSON Schema, and every action item must cite a segment token that resolves to a real row. An item that cannot be resolved is dropped, not repaired. Owners resolve only against workspace members, dates land at 17:00 in the owner's timezone, and writes run as a non-owner database role inside a workspace-scoped transaction.",
      outcome:
        "The app records or imports a meeting, transcribes it, extracts minutes and action items, and puts them through a review screen with the source quote. Approved items become tickets with an escalation ladder. Tickets mirror into Linear through a queue that never makes a local write wait on the network, and Linear changes come back through a signed webhook.",
      limitations:
        "There is no verified Resend sending domain, so email follow-ups only reach the account's own address; refused sends are recorded with Resend's reason. Deepgram is wired but unconfigured, so import-by-transcript is the working path. The Tauri desktop shell is compiled and tested but not packaged or published. Push notifications, PII redaction before the model call, and automated extraction quality evals are not implemented.",
      bullets: [
        {
          label: "Grounding before storage",
          text: "The model's reply has to pass the same Zod schema the prompt describes. Every action item cites a transcript segment, and the quote shown in review is read from the transcript rather than from the model's prose.",
        },
        {
          label: "Tenant boundary in the database",
          text: "Row-level security and a non-owner application role enforce the workspace boundary, so a cross-tenant read returns nothing and a cross-tenant write is rejected. Signing in as the second seeded owner and opening the first workspace returns 404.",
        },
        {
          label: "A queue between local and Linear",
          text: "Local ticket writes commit first. A separate queue performs the Linear call, backs off and retries on failure, and reports sync status on the ticket page.",
        },
        {
          label: "Honest gaps",
          text: "The README records what is wired but unconfigured, what is built but unpublished, and what is deliberately not implemented, so a demo cannot be mistaken for a finished product.",
        },
      ],
    },
  },
  {
    slug: "joevix",
    title: "Joevix",
    type: "build",
    featured: false,
    role: "Solo build: extension, theming engine, layout editor, and release",
    period: "Oct 2026",
    outcome:
      "A local-only browser extension that restyles and rearranges any page on your own screen, with themes, per-site layout, and no network code.",
    stack: ["TypeScript", "WXT", "Preact", "Manifest V3", "Playwright"],
    tags: [],
    links: [
      { label: "GitHub", href: "https://github.com/ffrizzyy/joevix" },
      { label: "Latest release", href: "https://github.com/ffrizzyy/joevix/releases/latest" },
    ],
    cover: "/images/joevix.webp",
    caseStudy: {
      summary:
        "Joevix is a Manifest V3 browser extension for Chrome, Edge, Brave, and Firefox that changes how a page looks and reads without touching the page for anyone else. Themes, custom colors, and per-site layout live in the browser, not on a server.",
      problem:
        "Most reading modes make one decision for every site, and most theming extensions ask for broad access up front. A reader who wants a warmer theme on one site, a wider column on another, and no change anywhere else has to trust a permission prompt that grants more than the job needs.",
      approach:
        "The extension declares no content scripts and no host permissions at install. A site is enabled one origin at a time, and the content script is registered at runtime. Theming is CSS custom properties applied through a constructed stylesheet, and layout editing writes CSS order, hidden state, and a reading width per site, so no DOM node is moved or rewritten. The content script never touches storage or permissions; typed, Zod-validated messages go through the service worker.",
      outcome:
        "Version 1.0.1 ships packaged Chrome and Firefox builds, built-in and custom themes, a contrast matrix, per-site layout editing with a 20-step undo history, import and export, a privacy panel, and a global off switch. The release passes type checking, lint, unit and E2E tests, axe audits, CodeQL, a manifest policy check, and a size budget.",
      limitations:
        "Layout presets and the spacing half of the reading-width work are not in this build. Firefox is tested by the automated suite rather than by hand, and the Firefox add-on is a temporary build because store publication is out of scope for v1.0. Theme sync between devices and the persistent diagnostic buffer are deferred.",
      bullets: [
        {
          label: "No standing access",
          text: "The manifest keeps content_scripts and web_accessible_resources empty and requests only storage, activeTab, and scripting, so a site is reachable only after the reader enables it.",
        },
        {
          label: "No network code",
          text: "ESLint bans fetch, XMLHttpRequest, WebSocket, EventSource, sendBeacon, dynamic Image, eval, and string timers. The end-to-end suite also asserts that the extension issues no request outside the page's own origin.",
        },
        {
          label: "Layout without moving nodes",
          text: "Reorder and hide are written as CSS order and display rules against adapter container sections. A reset removes one stylesheet and one attribute.",
        },
        {
          label: "Release checks",
          text: "Package and content-script size budgets, manifest policy checks, SHA-256 checksums, and a rollback document are part of the release script rather than an afterthought.",
        },
      ],
    },
  },
  {
    slug: "kerinci-lang",
    title: "KerinciLang",
    type: "build",
    featured: false,
    role: "Solo build: language design, interpreter, tests, and tutorial",
    period: "Oct 2026",
    outcome:
      "A small programming language whose keywords come from Kerinci (Siulak), with a dependency-free Python interpreter and a 13-lesson tutorial.",
    stack: ["Python", "Language Design", "Parsing", "Interpreters"],
    tags: [],
    links: [{ label: "GitHub", href: "https://github.com/ffrizzyy/kerinci-lang" }],
    cover: "/images/kerinci-lang.webp",
    caseStudy: {
      summary:
        "KerinciLang is a programming language built from Kerinci vocabulary. Variables are barang, functions are guno, printing is nyetak, and the whole interpreter is a single Python file with no dependencies.",
      problem:
        "A language is one of the clearest ways to show that a vocabulary can carry modern work. Kerinci has speakers and a dictionary, but almost no presence in software, and a learner who wants to write a first program has to leave the language behind at the door.",
      approach:
        "The language was designed around a small set of words reviewed by Kerinci speakers, with a grammar that covers variables, constants, numbers, text, lists, maps, conditionals, loops, functions, recursion, closures, file input and output, error handling, and multi-file programs. The interpreter is a single Python file with no third-party dependencies, so a learner can read the implementation as well as use it. Every tutorial code block runs in the test suite.",
      outcome:
        "Version 0.5.0 has 26 special words, 6 comparison words, and 24 built-in functions, with 271 language tests and 550 tutorial code blocks passing. It ships a 13-lesson tutorial in English and Indonesian, a glossary, a krc command, a packaged .pyz, and a REPL.",
      limitations:
        "Two vocabulary questions are still open: a Kerinci word for the boolean type, and the reserved word kelihu. Interpreter error messages are still in Indonesian rather than Kerinci. The dictionary title, authors, and speaker credits have to be completed before publication.",
      bullets: [
        {
          label: "Reviewed by speakers",
          text: "The vocabulary was reviewed and approved by Kerinci speakers, and the worksheet they worked through is in the repository rather than in a private document.",
        },
        {
          label: "Tests as documentation",
          text: "The 550 tutorial code blocks are executed by the test suite, so an example that stops working fails the build instead of sitting in the tutorial as a broken promise.",
        },
        {
          label: "Small enough to read",
          text: "The interpreter is one Python file with no dependencies. That is a design constraint, not a shortcut: the point is a language a learner can open and follow.",
        },
        {
          label: "Two languages of explanation",
          text: "The tutorial exists in English and Indonesian, with the code in Kerinci either way.",
        },
      ],
    },
  },
  {
    slug: "azzifa",
    title: "Azzifa",
    type: "build",
    featured: true,
    role: "Solo build: product, frontend, API, deployment",
    period: "Sep 2026",
    outcome:
      "A private journal that spots mood patterns every week, with shared streaks. Works with Anthropic, OpenAI, or any compatible model.",
    stack: ["Express", "SQLite", "Vanilla JS", "Multi-provider AI"],
    tags: ["SQL"],
    links: [
      { label: "Live app", href: "https://azzifa.up.railway.app" },
      { label: "GitHub", href: "https://github.com/ffrizzyy/azzifa" },
    ],
    cover: "/images/azzifa.webp",
    caseStudy: {
      summary:
        "Azzifa is a journaling app that treats a mood log as data worth reading back. Entries are private by default, insights are generated weekly, and the AI provider is swappable through an environment variable.",
      problem:
        "Most journaling apps store entries and stop there. The value in a journal is the pattern across weeks, and reading back through dozens of entries to find that pattern is work nobody does.",
      approach:
        "A vanilla HTML, CSS, and JavaScript frontend keeps the client small and the behavior explicit. An Express API in front of SQLite holds the data. A single provider abstraction lets the deployment point at Anthropic, OpenAI, or any OpenAI-compatible endpoint by changing one environment variable, so the app is never locked to a vendor.",
      outcome:
        "Daily and check-up journaling, a mood dashboard, weekly AI pattern insights, shared streaks with invite codes, tags, favorites, photo notes, JSON backup and restore, a guided feature tour, and account recovery through a personal question.",
      limitations:
        "Signup is open, so the live deployment is shared rather than invite-only. The weekly insight quality depends entirely on the configured model, and there is no offline mode. The live link is the source of truth for current behavior.",
      bullets: [
        {
          label: "Security and quality",
          text: "scrypt password hashing, HttpOnly session cookies, rate limits, sanitized input, CSP headers, and HTTP-level integration tests.",
        },
        {
          label: "Deployment",
          text: "Docker, with guides for Fly.io, Railway, and Render.",
        },
        {
          label: "Data ownership",
          text: "Full JSON export and restore, so an entry list is never trapped in the app.",
        },
      ],
    },
  },
  {
    slug: "portal-publik",
    title: "KITO Portal Publik",
    type: "build",
    featured: true,
    role: "Public portal. The Telegram bot, AI agent, officer dashboard, and database are team work.",
    period: "Sep 2026",
    outcome:
      "The public face of KITO: residents see reports on a map, check status by tracking code, and compare how fast each agency responds.",
    stack: ["Next.js", "TypeScript", "Tailwind", "SWR", "Leaflet", "Recharts"],
    tags: [],
    links: [
      { label: "GitHub", href: "https://github.com/Gedegok23/portal-publik" },
      {
        label: "LinkedIn article",
        // Shared with the writing section so the two cannot drift apart again.
        href: kitoArticleUrl,
      },
    ],
    cover: "/images/portal-publik.webp",
    caseStudy: {
      interactive: "kito-report-map",
      summary:
        "KITO is a citizen complaint system for Palembang. Residents describe a problem to a Telegram bot in everyday language, an AI agent sorts and redacts it, officers verify and close it, and the public portal shows what happened next. This case study covers the public portal, which is the part I built.",
      problem:
        "Ombudsman RI recorded 23,596 complaints in 2025. Among reports closed in 2024, the two most common maladministration types were delayed handling at 33.86% and no service given at 30.31%, over 64% combined. All of them end at the same point: a resident spoke up and could not tell whether anyone heard. In Palembang the channels are split by agency, so a resident has to know the category and the agency before they can even report.",
      approach:
        "The portal has four jobs: a report map, a status check by tracking code, an agency speed scorecard, and category trends over time. Data is filtered at the database query level, so internal officer notes and handler names are never requested in the first place, which means they cannot leak to the public or even back to the reporter.",
      outcome:
        "A server-rendered first paint with SWR handling the interactive filters after that, a Leaflet map centered on Palembang with category-colored pins, and a trend chart built from the same data.",
      limitations:
        "There is no public live URL, so no Live button is offered here. The map demo on this page runs on sample data and says so. The agent and dashboard repositories are still in development and are not linked.",
      bullets: [
        {
          label: "Safeguards",
          text: "The agent's database account has INSERT rights only, and DELETE and SELECT attempts were tested and rejected by the database itself. Tracking codes are generated by the server, not the model.",
        },
        {
          label: "Field evidence",
          text: "One-time links use a random token stored as a hash, valid for one report, with an expiry. Photo GPS is compared against the reported location and a large distance raises a flag for officers.",
        },
        {
          label: "Pre-launch tests",
          text: "A duplicated Telegram webhook yields one row, an OpenRouter outage still stores the report, another person's tracking code is rejected, and prompt-injection reports cannot override system rules.",
        },
        {
          label: "Why it is built this way",
          text: "The Public Service Law and the Personal Data Protection Law drove the design: redact before storage, keep the database role tiny, and let a human make the final decision.",
        },
      ],
    },
  },
  {
    slug: "aid-dashboard",
    title: "Aid Distribution Dashboard",
    type: "data",
    featured: true,
    role: "Data preparation and dashboard build",
    period: "2024",
    outcome:
      "An interactive Tableau dashboard that makes social aid distribution data easy to read for the public.",
    stack: ["Tableau", "Excel"],
    tags: ["Microsoft Excel", "Data Analytics", "Data Visualization"],
    links: [],
    cover: "/images/aid-dashboard.webp",
    caseStudy: {
      summary:
        "A public-transparency dashboard for social aid distribution in Musi Banyuasin Regency, built in Tableau on data prepared in Excel.",
      problem:
        "Aid distribution data existed but was not readable by the people it described. The goal was a view a non-analyst could interpret without a briefing.",
      approach:
        "Clean and reshape the source data in Excel, then model it in Tableau around the questions a reader actually asks: where the aid went, to how many households, and how that compares across areas.",
      outcome:
        "An interactive dashboard published for public viewing.",
      limitations:
        "The dashboard reflects the source data as supplied at the time. It is not a live feed.",
    },
  },
  {
    slug: "watsonx-genai-app",
    title: "watsonx.ai Generative AI App",
    type: "build",
    featured: false,
    role: "Solo build during the program",
    period: "Sep 2024 to Dec 2024",
    outcome:
      "A generative AI app on IBM watsonx.ai, from local API calls to a deployed Streamlit interface.",
    stack: ["Python", "IBM watsonx.ai", "Streamlit"],
    tags: ["Python", "watsonx.ai", "AI Prompting"],
    links: [{ label: "GitHub", href: "https://github.com/ffrizzyy/H8-test-genai" }],
    cover: "/images/watsonx-genai-app.webp",
    caseStudy: {
      summary:
        "A hands-on project from the IBM Generative AI and Machine Learning program with Hacktiv8, MSIB Batch 7. It covers calling a foundation model through its API from a local machine and then wrapping that in a Streamlit interface.",
      approach:
        "Prompt design and API integration first, verified locally, then a Streamlit front end deployed on top of the same calls.",
      limitations:
        "The repository currently has no README, which is a known gap and a planned cleanup.",
    },
  },
  {
    slug: "imdb-sentiment-bilstm",
    title: "IMDB Sentiment Capstone",
    type: "research",
    featured: false,
    role: "Team of five. My part: data cleaning and feature engineering, plus contributions across the project.",
    period: "2024",
    outcome:
      "Team capstone: a Bidirectional LSTM that classifies IMDB review sentiment with 88% accuracy, recall, and F1.",
    stack: ["Python", "Bidirectional LSTM", "NLP"],
    tags: ["Python", "Machine Learning"],
    links: [
      { label: "Presentation video", href: "https://youtu.be/xWDXvl7IerM" },
    ],
    cover: "/images/imdb-sentiment-bilstm.webp",
    caseStudy: {
      summary:
        "A five-person capstone from the IBM Generative AI and Machine Learning program, Batch 7. The model classifies the sentiment of an IMDB review from its text.",
      problem:
        "Star ratings can be biased and do not always reflect what the review text actually says, so a rating alone is a weak label for sentiment.",
      approach:
        "Data cleaning, a word tokenizer, word embeddings, a Bidirectional LSTM architecture, and then evaluation. The dataset is TensorFlow Datasets `imdb_reviews`.",
      outcome:
        "Accuracy, recall, and F1 all reached 88%, balanced across the positive and negative classes.",
      limitations:
        "The 88% figure is reported on the evaluation split. It is not confirmed as a held-out test-set result, so it is not described as one.",
    },
  },
  {
    slug: "rice-clustering",
    title: "Rice Production Clustering",
    type: "research",
    featured: true,
    role: "Research and analysis",
    period: "2024",
    outcome:
      "K-Means clustering of 27 years of Sumatra rice production data (1993-2020) into three productivity clusters.",
    stack: ["RapidMiner", "K-Means"],
    tags: ["Machine Learning", "Data Analytics"],
    links: [],
    cover: "/images/rice-clustering.webp",
    caseStudy: {
      summary:
        "A clustering study over 27 years of rice production data for Sumatra, from 1993 to 2020.",
      approach:
        "K-Means clustering in RapidMiner, with the cluster count chosen to keep the groups interpretable for a policy reader.",
      outcome: "Three productivity clusters that separate the region's production behaviour over time.",
      limitations: "Clusters describe the historical record. They are not a forecast.",
    },
  },
  {
    slug: "topsis-smart",
    title: "TOPSIS vs SMART",
    type: "research",
    featured: false,
    role: "Research and analysis",
    period: "2024",
    outcome:
      "Compared TOPSIS and SMART to find the best regions for rice growth. SMART was more sensitive and stable.",
    stack: ["TOPSIS", "SMART"],
    tags: ["Information Systems"],
    links: [],
    cover: "/images/topsis-smart.webp",
    caseStudy: {
      summary:
        "A comparative study of two multi-criteria decision methods applied to the same regional rice-growth question.",
      approach:
        "Run both methods on the same criteria and weights, then compare the rankings and test how each responds when the weights move.",
      outcome: "SMART showed higher sensitivity and greater stability in its ranking.",
      limitations:
        "The result is specific to this criteria set and weighting. It is not a general claim that SMART beats TOPSIS.",
    },
  },
  {
    slug: "cobit-audit",
    title: "COBIT 2019 Hospital Audit",
    type: "research",
    featured: false,
    role: "Audit and analysis",
    period: "2024",
    outcome:
      "COBIT 2019 audit of a hospital's DSS06 process: Level 2 capability, 92.8% fully achieved, with a roadmap to Level 3.",
    stack: ["COBIT 2019 (DSS06)"],
    tags: ["Information Systems"],
    links: [],
    cover: "/images/cobit-audit.webp",
    caseStudy: {
      summary:
        "A COBIT 2019 capability assessment of the DSS06 process at a hospital, followed by a roadmap.",
      approach:
        "Assess DSS06 against the COBIT capability levels, score each practice area, and identify the gaps that hold the process below the next level.",
      outcome: "Level 2 capability, with 92.8% of the assessed practice fully achieved, and a roadmap toward Level 3.",
      limitations:
        "The assessment covers one process domain at one organisation, so it does not generalise to the hospital's whole IT governance.",
    },
  },
  {
    slug: "sat-set",
    title: "SAT SET",
    type: "design",
    featured: true,
    role: "UI and UX design",
    period: "2024",
    outcome:
      "A Figma dashboard design for real-time asset monitoring and predictive maintenance at PT PLN Indonesia.",
    stack: ["Figma"],
    tags: ["Information Systems"],
    links: [],
    cover: "/images/sat-set.webp",
    caseStudy: {
      summary:
        "A dashboard design for real-time asset monitoring and predictive maintenance, produced for PT PLN Indonesia.",
      approach:
        "Start from the maintenance team's decisions, then design the screens that support them rather than the screens that show the most data.",
      outcome: "A high-fidelity Figma prototype covering monitoring and maintenance views.",
      limitations: "The design was never handed to an engineering team, so it is unvalidated in production.",
    },
  },
  {
    slug: "redesign-challenge",
    title: "Redesign Challenge Backend",
    type: "build",
    featured: false,
    role: "Backend. 2nd place, GDSC Redesign Challenge 2024.",
    period: "2024",
    outcome:
      "The Go backend I built for our GDSC Redesign Challenge entry, which placed 2nd. Controller, service, and repository layers.",
    stack: ["Go"],
    tags: ["Backend Development with Go"],
    links: [{ label: "GitHub", href: "https://github.com/ffrizzyy/redesign" }],
    cover: "/images/redesign-challenge.webp",
    caseStudy: {
      summary:
        "The backend for a GDSC Redesign Challenge team entry that placed 2nd in 2024. My part was the backend.",
      approach:
        "A layered Go service: controller, service, and repository, with middleware in front. The layering kept request handling separate from business rules and from persistence, which made the API testable without a database.",
      limitations:
        "The repository name is vague and it has no README yet. Both are known cleanup items.",
    },
  },
  {
    slug: "sdc-2024",
    title: "Sriwijaya Digital Conference 2024",
    type: "design",
    featured: false,
    role: "Event concept and session author",
    period: "Oct 2024",
    outcome:
      "Named the concept Generating Digital Understanding and wrote four session titles and themes for a national conference answering South Sumatra's falling digital rank.",
    stack: ["Event Concept", "Copywriting", "Data Storytelling"],
    tags: ["Content Writing", "Data Analytics"],
    links: [],
    cover: "/images/sdc-2024.webp",
    caseStudy: {
      interactive: "sdc-ev-dci",
      summary:
        "Sriwijaya Digital Conference 2024 was a national conference in Palembang, billed as The Biggest Digital Conference in South Sumatera. I wrote the event concept and the session titles and themes.",
      problem:
        "The East Ventures Digital Competitiveness Index for 2024 placed South Sumatra 22nd, down two places from the year before, with a score of 36.4 that had itself fallen from 37.6. The conference existed to answer that: to build digital understanding among young people in the province, especially university students and fresh graduates.",
      approach:
        "The concept was Generating Digital Understanding, shortened to GENDING, and it set the mission the sessions had to serve. Each session then carried a name that explains itself, so the programme reads as an argument rather than a list.",
      outcome:
        "Four sessions: Sriwij AI a, on artificial intelligence in modern society; Career Wireframe, on imagining, designing, and living a working life; Speak Up, on presence and voice; and Mind Your Business, on turning ideas into income.",
      limitations:
        "I wrote the concept and the sessions, not the whole event, and the execution belonged to the organising team. I have no attendance figure for the conference itself, so none is claimed here. The ranking figures are quoted from the index rather than reproduced in full.",
      bullets: [
        {
          label: "The name does work",
          text: "Generating Digital Understanding abbreviates to GENDING, so the concept is memorable as a word rather than only as a phrase.",
        },
        {
          label: "Sriwij AI a",
          text: "Sriwijaya means glorious victory, which is where the session name comes from: an AI session that reads as the city's own.",
        },
        {
          label: "Speak Up",
          text: "Chosen because up is a synonym of elevate, so the title and the theme carry each other.",
        },
        {
          label: "Mind Your Business",
          text: "A familiar English phrase that also reads as think about your business, which is why it fits an entrepreneurship session.",
        },
        {
          label: "Who it was for",
          text: "Minimum age 17, across the general public, school students, university students, employees, professionals, and communities.",
        },
      ],
    },
  },
  {
    slug: "frizzy-store-system",
    title: "Frizzy Store System",
    type: "build",
    featured: false,
    role: "Solo build: data model, point of sale, cash engine, and interface",
    period: "Oct 2026",
    outcome:
      "A phone shop's sales, stock, and cash in one place, plus a Cash Recovery Engine that computes runway, flags leaks, and sets open-to-buy.",
    stack: ["Next.js", "TypeScript", "Tailwind", "Zustand", "Recharts"],
    tags: [],
    links: [{ label: "GitHub", href: "https://github.com/ffrizzyy/frizzy-store-system" }],
    cover: "/images/frizzy-store-system.webp",
    caseStudy: {
      summary:
        "A store system for a phone counter: sales, stock and cash in one place. On top of the usual point of sale sits a Cash Recovery Engine, which reads the same numbers and answers the question the owner actually has, which is how long the cash lasts and what to spend it on. The sales are real, taken from an export of the counter's WhatsApp sales chat.",
      problem:
        "A phone counter runs on cash and stock that turn over quickly, and a cashier app answers the wrong question. It reports today's takings but not how fast the cash is burning, where it is leaking, or how much stock it is safe to buy next week. Those answers are already in the data, but not in a form anyone reads.",
      approach:
        "Sales come from the real records, extracted row by row from the shop's WhatsApp sales group. Stock is an append-only ledger, so a sale never overwrites a stock figure, it writes a new line. Money is always integer rupiah, never a float. The Cash Recovery Engine is built on top: True Burn, runway, a Leak Detector, reorder suggestions, open-to-buy, a What-If slider and a playbook. Two roles differ in what they can see, so as staff the cost prices and the profit disappear and a sensitive action asks for the owner's PIN.",
      outcome:
        "Nineteen pages, a point of sale with IMEI selection, a margin guard, layered discounts and mixed payments, a catalogue of 24 reports with CSV export, shift and cash reconciliation, and an AI analyst that computes its answers with tools instead of letting the model guess.",
      limitations:
        "The supporting records the chat export does not contain, such as stock, cash, overheads and shifts, are generated deterministically so every feature can be exercised. The app is not deployed, so the repository is the whole of it, and a real deployment would replace the generated data with the counter's own.",
      bullets: [
        {
          label: "The cash engine",
          text: "True Burn and runway estimate how long the cash lasts, the Leak Detector points at where it goes, and open-to-buy sets a safe purchasing ceiling. A What-If slider re-runs the forecast against a change before it is made.",
        },
        {
          label: "Tested in a real browser",
          text: "An end-to-end script drives the running app through the DevTools protocol: it adds a product, completes a payment, rejects a wrong PIN, approves with the owner's PIN, moves the What-If slider, switches theme and opens every page. The last run passed 34 checks with none failing.",
        },
        {
          label: "Why a ledger",
          text: "Stock as an append-only ledger means a correction is another entry, so the history of a number is never lost. Every stock change also writes an audit line.",
        },
      ],
    },
  },
  {
    slug: "she-aint-allat",
    title: "she aint allat",
    type: "build",
    featured: false,
    role: "Solo build: matcher, interruption levels, and interface",
    period: "Oct 2026",
    outcome:
      "A browser extension that intervenes when your own browsing touches an ex, covering the page with something you chose in advance. Local first, no account.",
    stack: ["JavaScript", "Manifest V3", "WebExtensions API"],
    tags: [],
    links: [{ label: "GitHub", href: "https://github.com/ffrizzyy/she-aint-allat" }],
    cover: "/images/she-aint-allat.webp",
    caseStudy: {
      summary:
        "A browser extension that interrupts the urge to look someone up. You keep a list of your own triggers, a name, a handle, a place or a link pattern, and allow the sites you want watched. When one fires, the page is covered by something you chose in advance: a picture that makes you laugh, a line that calms you, or a reminder of why it ended.",
      problem:
        "Looking up an ex is a one second impulse, and by the time a decision arrives the page is already open. Willpower loses that race because it is asked to act at the exact moment it is weakest. The fix is to decide in advance, while calm, what should happen instead.",
      approach:
        "Everything runs and stays on the device. Matching happens in memory against the page address, its title, search boxes, visible text, image descriptions and links, and nothing about the page is stored. Three levels escalate: a nudge that closes itself, a blur with a card, and a full pause with a timer. The same trigger firing three times in half an hour steps up one level, never past the highest. App lock, night mode, snooze and a pool of pop-up items keep the tool usable without making it weaker.",
      outcome:
        "Three interruption levels with automatic escalation, a 24 hour delay before a trigger can be removed, insights that read detours by hour and by site, unsent letters that lock for a chosen number of days, an optional reality check list of reasons it ended, and a support page with crisis lines for four countries. No account, no server, no analytics.",
      limitations:
        "Chrome, Edge and Brave are the tested target. The Firefox build is new and checked by tests rather than by hand, and there is no Safari build. Only the top frame of each page is watched, there is no text recognition inside images or video, and there is no sync between devices. The app lock is a gate, not encryption, and a hostile page can detect the overlay.",
      bullets: [
        {
          label: "The commitment device",
          text: "Removing a trigger takes 24 hours and asks for confirmation a second time, so a decision made at one in the morning cannot undo a list written when things were clear. A trigger added by mistake can still be removed at once within fifteen minutes.",
        },
        {
          label: "Local first",
          text: "No network requests, no analytics and no remote configuration. The toolbar icon and badge are always visible so the extension cannot hide on someone's computer, and the settings page can export or delete everything.",
        },
        {
          label: "A tool, not treatment",
          text: "The extension says plainly that it is self-help and not therapy or medical care, and points to local helplines.",
        },
      ],
    },
  },
  {
    slug: "loopnote",
    title: "Loopnote",
    type: "build",
    featured: false,
    role: "Solo build: API, client, and study scheduling",
    period: "Sep 2026",
    outcome:
      "Photograph a whiteboard or a page of notes and get a summary plus flashcards on an SM-2 schedule. Expo app, Express API, mocked model calls.",
    stack: ["TypeScript", "Expo", "Express", "SQLite", "SM-2"],
    tags: [],
    links: [{ label: "GitHub", href: "https://github.com/ffrizzyy/loopnote" }],
    cover: "/images/loopnote.webp",
    caseStudy: {
      summary:
        "Loopnote turns photos of notes, whiteboards and journal pages into searchable summaries and flashcards. A photo is imported from a phone, the server runs it through a pipeline, and the result is organised into topics with spaced repetition scheduling on top.",
      problem:
        "Notes photographed on a phone are easy to capture and almost impossible to use again. They sit in the camera roll in the order they were taken, unsearchable, and turning them into something studyable is the step that never happens.",
      approach:
        "A monorepo with an Expo client and an Express API. An upload runs through a pipeline of resize, detect and a summarisation gate, then lands as topics, notes and flashcards. Scheduling is a pure SM-2 implementation and grouping across notes is a tag-similarity match, both written as plain functions with their own tests, so the study logic does not depend on the framework. Invites, a waitlist and feedback collection are part of the same build.",
      outcome:
        "An in-app import flow with a queue, visible upload progress and retry, automatic categorisation across notes, SM-2 scheduling with a due queue, a review step to keep, merge or discard what came in, a beta invite flow, and a framework-free review interface.",
      limitations:
        "Both model calls are still mocked, so summaries and flashcards come from a stub rather than a real model. The native share sheet, the share to Loopnote action inside the photo library, is stubbed and needs a real Xcode or Android Studio project. Nothing is deployed, so the repository is the whole of it.",
      bullets: [
        {
          label: "Study logic as plain functions",
          text: "The SM-2 scheduler and the topic matcher take plain inputs and return plain outputs, with no framework in the way, so both are tested on their own rather than through the app.",
        },
        {
          label: "The upload path",
          text: "A picker with multi-select feeds a queue that uploads with visible progress and retries failures, and the queue reducer is framework-agnostic and tested.",
        },
        {
          label: "Where it stops",
          text: "Phase 0 is complete and three Phase 1 issues are done. The model calls and the native share sheet are the known gaps, both recorded in the repository.",
        },
      ],
    },
  },
];

/** The five bento cells, in the exact order spec 4.3 requires. */
export const FEATURED_ORDER = [
  "prepo",
  "portal-publik",
  "aid-dashboard",
  "rice-clustering",
  "sat-set",
] as const;

/**
 * The filter vocabulary lives in src/lib/work-filters.ts. It moved out of this
 * file because a Client Component importing it from here pulled this whole
 * catalogue into the client bundle.
 */
