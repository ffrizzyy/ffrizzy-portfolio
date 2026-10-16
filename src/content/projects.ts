import type { Project } from "./schema";
import { kitoArticleUrl } from "./site";

/**
 * The ten project records. Spec 7 inventory, with the outcome lines from
 * spec 10.2. `tags` values must match a skill name in site.ts, and the build
 * fails if a skill resolves to no project (spec 7.1 invariant 1).
 */
export const projects: Project[] = [
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
];

/** The five bento cells, in the exact order spec 4.3 requires. */
export const FEATURED_ORDER = [
  "azzifa",
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
