import type {
  Award,
  CertIssuer,
  PortfolioEvent,
  Skill,
  Stat,
  TimelineEntry,
  Tool,
  WritingItem,
} from "./schema";
import type { z } from "zod";
import { growthSlideSchema } from "./schema";

/* ------------------------------------------------------------------ *
 * Stat grid. Spec 4.2.                                                *
 * ------------------------------------------------------------------ */

/**
 * Five accumulated numbers. GPA, followers, and views are typed here with a
 * method and an asOf date. Events and projects are computed at load time in
 * lib/content.ts, which is why their `value` is a placeholder.
 */
export const stats: Stat[] = [
  {
    id: "gpa",
    value: 3.97,
    kind: "exact",
    decimals: 2,
    suffix: " / 4.00",
    label: "GPA",
    detail: "Information Systems, Universitas Sriwijaya",
    method: "Final GPA at graduation, Apr 2025.",
    asOf: "2025",
    icon: "GraduationCap",
    viz: "ring",
    href: "#about",
  },
  {
    id: "events",
    value: 0,
    computedFrom: "events",
    kind: "lower-bound",
    label: "events",
    detail: "Organized or covered, 2022 to 2026",
    method:
      "Counted from the events list in content/site.ts. That list is still being completed, so the count is shown as a lower bound. Flagship events: Technology Euphoria Festival 2023 and Pesta Rakyat Sriwijaya 2023.",
    asOf: "2026",
    icon: "CalendarCheck",
    viz: "ticks",
    href: "#content",
  },
  {
    id: "projects",
    value: 0,
    computedFrom: "projects",
    kind: "exact",
    label: "projects delivered",
    detail: "Build, data, research, and design",
    method: "Counted automatically from content/projects.ts. It goes up when a project is added.",
    asOf: "2026",
    icon: "Stack",
    viz: "stack",
    href: "#work",
  },
  {
    id: "followers",
    value: 100_000,
    kind: "lower-bound",
    decimals: 0,
    suffix: "K",
    label: "followers combined",
    detail: "Across 10+ managed accounts",
    method:
      "Sum of followers across the 10+ Instagram, X, and TikTok accounts managed. As of 2026.",
    asOf: "2026",
    icon: "UserPlus",
    viz: "platforms",
    href: "#content",
  },
  {
    id: "views",
    value: 1_000_000,
    kind: "lower-bound",
    decimals: 0,
    suffix: "M",
    label: "views combined",
    detail: "From 500+ published posts",
    method:
      "Reels and TikTok views combined. Campaign lifts: +80% (Technology Euphoria 2023), +30% (Pesta Rakyat Sriwijaya 2023), +20% (Rhetoric Academy). As of 2026.",
    asOf: "2026",
    icon: "Eye",
    viz: "phone",
    href: "#content",
  },
];

/* ------------------------------------------------------------------ *
 * Events. Feeds the events stat and its tick illustration.            *
 * ------------------------------------------------------------------ */

/**
 * Honest and incomplete on purpose. Only two events can be named from the
 * source material, so the stat is rendered as a lower bound until this list is
 * filled in. See spec 9.2 item 3.
 */
export const events: PortfolioEvent[] = [
  { id: "techporiafest-2023", name: "Technology Euphoria Festival 2023", year: 2023, role: "organizer" },
  { id: "pesta-rakyat-2023", name: "Pesta Rakyat Sriwijaya 2023", year: 2023, role: "coverage" },
];

export const eventsListIsPartial = true;

/* ------------------------------------------------------------------ *
 * Timeline, awards, certifications. Spec 4.9.                         *
 * ------------------------------------------------------------------ */

export const timeline: TimelineEntry[] = [
  {
    id: "palembang-digital",
    title: "Product Development Contributor",
    org: "Palembang Digital",
    kind: "work",
    start: "2024-03",
    end: "2025-10",
    display: "Mar 2024 to Oct 2025",
    summary: "Contributed to product development across the community's digital projects.",
  },
  {
    id: "media-si",
    title: "Staff Humas",
    org: "MediaSI",
    kind: "leadership",
    start: "2023-03",
    end: "2025-04",
    display: "Mar 2023 to Apr 2025",
    summary: "Public relations and communications for the organisation.",
  },
  {
    id: "ibm-genai",
    title: "IBM Generative AI and Machine Learning",
    org: "Hacktiv8, MSIB Batch 7",
    kind: "work",
    start: "2024-09",
    end: "2024-12",
    display: "9 Sep to 31 Dec 2024",
    summary: "Intensive program covering generative AI and applied machine learning.",
  },
  {
    id: "gdsc-content",
    title: "Core Team, Content Writing",
    org: "GDSC UNSRI",
    kind: "leadership",
    start: "2023-09",
    end: "2024-09",
    display: "Sep 2023 to Sep 2024",
    summary: "Set the content and outreach strategy for the year.",
  },
  {
    id: "rhetoric-academy",
    title: "Social Media Specialist",
    org: "Rhetoric Academy",
    kind: "work",
    start: "2024-07",
    end: "2024-08",
    display: "Jul to Aug 2024",
  },
  {
    id: "pln-kerja-praktik",
    title: "Kerja Praktik",
    org: "PT PLN Indonesia Power",
    kind: "work",
    start: "2023-12",
    end: "2024-01",
    display: "Dec 2023 to Jan 2024",
  },
];

export const awards: Award[] = [
  { id: "best-core-team", title: "The Best Core Team", org: "GDSC", year: 2024 },
  { id: "redesign-2nd", title: "2nd Winner, Redesign Challenge", org: "GDSC", year: 2024 },
  { id: "uiux-1st", title: "1st Winner, UI/UX Competition", org: "Technology Euphoria", year: 2023 },
];

/** Drives the Education block on the CV page, which spec 4.9 keeps off Home. */
export const education = [
  {
    id: "unsri",
    institution: "Universitas Sriwijaya",
    degree: "Information Systems",
    detail: "GPA 3.97 out of 4.00",
    display: "Graduated Apr 2025",
  },
];

export const certifications: CertIssuer[] = [
  {
    issuer: "IBM",
    items: [
      { id: "ibm-genai", name: "Generative AI and Machine Learning", year: 2024 },
      { id: "ibm-watsonx", name: "watsonx.ai Foundations", year: 2024 },
    ],
  },
  {
    issuer: "Hacktiv8",
    items: [{ id: "hacktiv8-msib", name: "MSIB Batch 7 Program", year: 2024 }],
  },
  {
    issuer: "Coursera",
    items: [{ id: "coursera-data", name: "Data analysis coursework", year: 2024 }],
  },
  {
    issuer: "Dicoding",
    items: [{ id: "dicoding-fundamentals", name: "Information Systems fundamentals", year: 2023 }],
  },
];

export const languages = [
  { name: "Bahasa Indonesia", level: "native" },
  { name: "English", level: "professional" },
] as const;

/* ------------------------------------------------------------------ *
 * Content growth carousel. Spec 4.5.                                  *
 * ------------------------------------------------------------------ */

export const growthSlides: z.infer<typeof growthSlideSchema>[] = [
  {
    id: "technology-euphoria",
    org: "Technology Euphoria 2023",
    role: "Publication lead",
    peak: 3400,
    peakLabel: "3,400+",
    start: 0,
    startLabel: "0",
    subLine: "followers, up from zero. 190 posts.",
    sentence:
      "Led the publication team behind event content on Instagram, TikTok, and Twitter. Engagement grew 80%.",
    posts: 190,
  },
  {
    id: "gdsc-unsri",
    org: "GDSC UNSRI",
    role: "Content writing core team",
    peak: 2400,
    peakLabel: "2,400+",
    start: 1800,
    startLabel: "1,800+",
    subLine: "followers, up from 1,800+ in 3 months. 263 posts.",
    sentence: "Set the content and outreach strategy for the year.",
    posts: 263,
  },
  {
    id: "pesta-rakyat",
    org: "Pesta Rakyat Sriwijaya 2023",
    role: "Social media specialist",
    peak: 15300,
    peakLabel: "15.3k",
    start: 13100,
    startLabel: "13.1k",
    subLine: "followers, up from 13.1k. 160+ posts.",
    sentence: "Coordinated event content across platforms. Engagement grew 30%.",
    posts: 160,
  },
];

/* ------------------------------------------------------------------ *
 * Writing. Spec 4.8 and 5.4.                                          *
 * ------------------------------------------------------------------ */

export const writing: WritingItem[] = [
  {
    id: "kito-article",
    platform: "linkedin",
    title: "KITO: Kanal Informasi, Transparansi & Observasi",
    description:
      "How a Telegram bot, an AI agent, and a public portal give Palembang residents one simple place to report problems and track what happens next.",
    url: "https://www.linkedin.com/",
    date: "30 Sep 2026",
    cover: "/images/portal-map.webp",
    language: "id",
    featured: true,
  },
  {
    id: "google-maps",
    platform: "instagram",
    title: "Google Maps",
    description: "Instagram carousel series on practical Google Maps features most people skip",
    cover: "/images/ig-maps.webp",
    language: "id",
  },
  {
    id: "google-dorking",
    platform: "instagram",
    title: "Google Dorking",
    description: "Short Instagram explainer on advanced search operators, with examples",
    cover: "/images/ig-dorking.webp",
    language: "id",
  },
  {
    id: "google-lens",
    platform: "instagram",
    title: "Google Lens",
    description: "Instagram post on searching with a camera instead of words",
    url: "https://www.instagram.com/p/CsIFl4brYxQ/",
    cover: "/images/ig-lens.webp",
    language: "id",
  },
  {
    id: "google-translate",
    platform: "instagram",
    title: "Google Translate",
    description: "Instagram post on getting more out of Google Translate",
    url: "https://www.instagram.com/p/C0YCra8LtML/",
    cover: "/images/ig-translate.webp",
    language: "id",
  },
];

/* ------------------------------------------------------------------ *
 * Skills map. Spec 4.4.                                               *
 * ------------------------------------------------------------------ */

export const broadSkills = [
  "Project Management",
  "Event Coordination",
  "Team Leadership",
  "IT",
  "Critical Thinking",
  "Strategic Planning",
  "Creativity",
] as const;

/**
 * The Deep accordion. "Used in" lists are derived from project `tags` in
 * lib/content.ts; only the two skills that point at content work rather than a
 * project file need an explicit entry.
 */
export const deepSkills: Skill[] = [
  {
    id: "excel",
    name: "Microsoft Excel",
    blurb: "Data cleaning, reshaping, and analysis before anything reaches a dashboard.",
  },
  {
    id: "content-writing",
    name: "Content Writing",
    blurb: "Publication strategy, editorial calendars, and copy that grows a following.",
  },
  {
    id: "python",
    name: "Python",
    blurb: "Model calls, data preparation, and small applications end to end.",
  },
  {
    id: "go-backend",
    name: "Backend Development with Go",
    blurb: "Layered REST services split into controller, service, and repository.",
  },
  {
    id: "ml",
    name: "Machine Learning",
    blurb: "Clustering and text classification, from data preparation to evaluation.",
  },
  {
    id: "data-analytics",
    name: "Data Analytics",
    blurb: "Turning a raw dataset into a view a non-analyst can read.",
  },
  {
    id: "osint",
    name: "OSINT",
    blurb: "Open-source research with search operators and visual lookup tools.",
  },
  {
    id: "information-systems",
    name: "Information Systems",
    blurb: "Process auditing, decision modelling, and system design.",
  },
];

/** Skills that resolve to content work instead of a project file. */
export const extraSkillUsage: Record<string, { label: string; href: string }[]> = {
  "content-writing": [
    { label: "Audience growth stories", href: "#content" },
    { label: "Writing", href: "#writing" },
  ],
  osint: [{ label: "Google Dorking and Lens series", href: "#writing" }],
};

/**
 * Spec 4.4: the tools strip. Spec 1.1 says to drop any brand missing from
 * simple-icons rather than hand-draw it. As of simple-icons 16, Excel, Tableau,
 * Canva, and RapidMiner have no entry, so they are not listed here. Excel is
 * still covered in the Deep skills accordion.
 */
export const tools: Tool[] = [
  { slug: "python", name: "Python" },
  { slug: "go", name: "Go" },
  { slug: "trello", name: "Trello" },
  { slug: "meta", name: "Meta" },
  { slug: "streamlit", name: "Streamlit" },
  { slug: "google", name: "Google" },
  { slug: "figma", name: "Figma" },
];

/* ------------------------------------------------------------------ *
 * KITO section. Spec 4.6.                                             *
 * ------------------------------------------------------------------ */

export const kitoStats = [
  { value: 23596, label: "complaints recorded by Ombudsman RI in 2025" },
  {
    value: 64,
    suffix: "%+",
    label: "of reports closed in 2024 were delayed handling or no service",
  },
] as const;

export const kitoFlow = [
  {
    id: "resident",
    title: "Resident writes",
    text: "In everyday language, to a Telegram bot.",
    owned: false,
  },
  {
    id: "agent",
    title: "AI agent sorts",
    text: "Redacts personal data, suggests category, agency, and urgency.",
    owned: false,
  },
  {
    id: "officers",
    title: "Officers decide",
    text: "They verify and close. The model never does.",
    owned: false,
  },
  {
    id: "portal",
    title: "Public portal",
    text: "Map, status by tracking code, agency scorecard.",
    owned: true,
  },
] as const;

export const kitoSafeguards = [
  "The agent's database account can only insert.",
  "Tracking codes come from the server, not the model.",
  "Field teams get one-time links stored as hashes.",
  "Photo GPS is checked against the reported location.",
] as const;

export const kitoStack = ["Next.js", "TypeScript", "Tailwind", "SWR", "Leaflet", "Recharts"] as const;

export const kitoBotStatus = {
  handle: "t.me/Palembang_lapor_bot",
  url: "https://t.me/Palembang_lapor_bot",
  status: "not active right now",
} as const;
