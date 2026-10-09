import type {
  Award,
  CertIssuer,
  PortfolioEvent,
  Skill,
  SkillCategory,
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
    suffix: "",
    qualifier: "/ 4.00",
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
    detail: "Organized, covered, or spoken at, 2022 to 2026",
    method:
      "Counted from the stated totals in content/site.ts: 2 flagship festivals with over 2,000 attendees each (Technology Euphoria Festival 2023 and Pesta Rakyat Sriwijaya 2023), 1 national conference (Sriwijaya Digital Conference 2024), and 20 or more webinars, seminars, and sharing sessions across GDSC and BEM. The last figure is a floor, so the total is a lower bound.",
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
 * The named events, which drive the tick illustration and its tooltips. Only the
 * ones the owner named appear here; the rest of the total is accounted for in
 * `eventTotals` rather than invented as individual rows.
 */
export const events: PortfolioEvent[] = [
  { id: "techporiafest-2023", name: "Technology Euphoria Festival 2023", year: 2023, role: "organizer" },
  { id: "pesta-rakyat-2023", name: "Pesta Rakyat Sriwijaya 2023", year: 2023, role: "coverage" },
  { id: "sdc-2024", name: "Sriwijaya Digital Conference 2024", year: 2024, role: "organizer" },
  { id: "gdsc-sharing-2024", name: "Sharing Session on Media and Creative, GDSC", year: 2024, role: "organizer" },
];

/**
 * The full event count, stated by the owner: two flagship festivals each drawing
 * over 2,000 attendees, one national conference, and more than twenty webinars,
 * seminars, and sharing sessions across GDSC and BEM. The smaller figure is a
 * stated floor rather than a count, so the total is a lower bound.
 */
export const eventTotals = {
  festivals: 2,
  conferences: 1,
  smallerEvents: 20,
} as const;

/* ------------------------------------------------------------------ *
 * Summary. Lifted from the CV's professional summary.                 *
 * ------------------------------------------------------------------ */

export const summary =
  "Information Systems graduate with three years of experience across content, communications, data, and organizational leadership, gained through internships, part-time work, and several student organizations. Comfortable with both the creative side, like writing and planning content, and the analytical side, like tracking performance or thinking through a problem with data. Has led teams as large as nine people, run long-running responsibilities with minimal supervision, and kept picking up new skills through self-driven certifications.";

/* ------------------------------------------------------------------ *
 * Professional experience. Transcribed from the CV.                   *
 * ------------------------------------------------------------------ */

export const experience: TimelineEntry[] = [
  {
    id: "rhetoric-academy",
    title: "Social Media Specialist (Part-Time)",
    org: "Rhetoric Academy",
    location: "Palembang, Indonesia",
    kind: "work",
    start: "2024-07",
    end: "2024-08",
    display: "Jul to Aug 2024",
    bullets: [
      "Planned and ran the Instagram and TikTok content calendar, using performance data to lift engagement 20%, grow followers 15%, and push interaction rates up 25%.",
    ],
  },
  {
    id: "mvSlim",
    title: "Content Producer Intern",
    org: "MVSLIM",
    location: "United Kingdom (Remote)",
    kind: "work",
    start: "2024-02",
    end: "2024-03",
    display: "Feb to Mar 2024",
    bullets: [
      "Ran a digital marketing campaign start to finish across a remote team: set the goals, built the timeline, and evaluated performance data at the end.",
    ],
  },
  {
    id: "pln-op-har",
    title: "Kerja Praktik (Practical Work), Operations and Maintenance (OP-HAR)",
    org: "PT PLN Indonesia Power",
    location: "Indonesia",
    kind: "work",
    start: "2023-12",
    end: "2024-01",
    display: "Dec 2023 to Jan 2024",
    bullets: [
      "Conducted business process analysis within the Operations and Maintenance division, examining existing workflows to identify problem areas and inefficiencies.",
      "Applied several analytical approaches grounded in an Information Systems perspective to diagnose issues from different angles and support recommendations for process improvement.",
    ],
  },
  {
    id: "niagahoster",
    title: "SEO Outreach Intern",
    org: "Niagahoster x Rakamin Academy",
    location: "Indonesia (Remote)",
    kind: "work",
    start: "2023-08",
    end: "2023-09",
    display: "Aug to Sep 2023",
    bullets: [
      "Audited webpages for on-page and off-page SEO, building a grounding in technical SEO analysis and organic growth.",
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Leadership and organizational experience. Transcribed from the CV.  *
 * ------------------------------------------------------------------ */

export const leadership: TimelineEntry[] = [
  {
    id: "palembang-digital",
    title: "Product Development Contributor",
    org: "Palembang Digital",
    location: "Palembang, Indonesia",
    kind: "leadership",
    start: "2024-03",
    end: "2025-10",
    display: "Mar 2024 to Oct 2025",
    bullets: [
      "Worked across teams on digital outreach programs, using participation data to shape what got prioritized.",
      "Supported community tech programs focused on digital literacy and local ecosystem growth.",
    ],
  },
  {
    id: "media-si",
    title: "Staff Humas (Public Relations)",
    org: "MediaSI",
    location: "Palembang, Indonesia",
    kind: "leadership",
    start: "2023-03",
    end: "2025-04",
    display: "Mar 2023 to Apr 2025",
    bullets: [
      "Ran the organization's official Instagram account for two years, writing copy and keeping the brand voice consistent.",
      "Handled how information reached both internal teams and outside audiences.",
    ],
  },
  {
    id: "gdsc-core",
    title: "Core Team, Content Writing Division",
    org: "Google Developer Student Clubs (GDSC), Universitas Sriwijaya",
    location: "Palembang, Indonesia",
    kind: "leadership",
    start: "2023-09",
    end: "2024-09",
    display: "Sep 2023 to Sep 2024",
    bullets: [
      "Led a 9-person content team, setting the content and outreach strategy for the year.",
      "Kept members and audiences engaged through events and a consistent, planned communication.",
    ],
  },
  {
    id: "pesta-rakyat",
    title: "Staff, Social Media Specialist, Pesta Rakyat Sriwijaya 2023",
    org: "Pesta Rakyat Sriwijaya",
    location: "Palembang, Indonesia",
    kind: "leadership",
    start: "2023-08",
    end: "2024-01",
    display: "Aug 2023 to Jan 2024",
    bullets: [
      "Coordinated event content across platforms, growing engagement 30% for an audience of over 1,000 attendees.",
    ],
  },
  {
    id: "techporiafest-pic",
    title: "PIC of Publication, Technology Euphoria Festival 2023",
    org: "Technology Euphoria Festival",
    location: "Palembang, Indonesia",
    kind: "leadership",
    start: "2023-05",
    end: "2023-10",
    display: "May to Oct 2023",
    bullets: [
      "Led the publication team behind event content across Instagram, TikTok, and Twitter, growing engagement 80% for an event with over 1,000 attendees.",
    ],
  },
  {
    id: "gdsc-member",
    title: "Member, Content Writing Division",
    org: "Google Developer Student Clubs (GDSC), Universitas Sriwijaya",
    location: "Palembang, Indonesia",
    kind: "leadership",
    start: "2022-11",
    end: "2023-09",
    display: "Nov 2022 to Sep 2023",
    bullets: [
      "Wrote articles for the GDSC UNSRI Medium publication and produced Instagram content, then was promoted into the Core Team the following term.",
    ],
  },
  {
    id: "bem-fasilkom",
    title: "Staff, Publication Management Division",
    org: "BEM KM Fasilkom, Universitas Sriwijaya",
    location: "Palembang, Indonesia",
    kind: "leadership",
    start: "2022-03",
    end: "2023-01",
    display: "Mar 2022 to Jan 2023",
    bullets: [
      "Handled social media end to end, including publishing, copywriting, and event-planning support.",
    ],
  },
  {
    id: "sdc-concept",
    title: "Event Concept and Session Author",
    org: "Sriwijaya Digital Conference 2024",
    location: "Palembang, Indonesia",
    kind: "leadership",
    start: "2024-10",
    end: "2024-10",
    display: "Oct 2024",
    bullets: [
      "Wrote the event concept name and the session titles and themes for a national conference billed as The Biggest Digital Conference in South Sumatera, held 19 to 20 October 2024 at Hotel Swarna Dwipa.",
      "Sessions included Career Wireframe: Imagining, Designing, and Living Your Dream Career.",
    ],
  },
  {
    id: "gdsc-speaker",
    title: "Speaker, Sharing Session on Media and Creative",
    org: "Google Developer Student Clubs (GDSC), Universitas Sriwijaya",
    location: "Palembang, Indonesia",
    kind: "leadership",
    start: "2024-05",
    end: "2024-05",
    display: "May 2024",
    bullets: [
      "One of the speakers for an internal GDSC sharing session on media and creative work.",
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Education. Spec 4.9 keeps this off Home; it lives on the CV page.    *
 * ------------------------------------------------------------------ */

export const education = [
  {
    id: "unsri",
    institution: "Universitas Sriwijaya",
    degree: "Bachelor of Information Systems",
    detail: "GPA 3.97 / 4.00",
    display: "Apr 2025",
    location: "Palembang, Indonesia",
    bullets: [
      "Built web applications and automated data-processing tools through coursework and extracurricular projects.",
      "Coursework covered system design, digital forensics, machine learning, and data analytics.",
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Awards.                                                             *
 * ------------------------------------------------------------------ */

/**
 * Note on the Redesign Challenge: the CV states "3rd Winner" but the spec
 * (section 9.1, marked resolved) and everything published before this says
 * "2nd Winner". The owner confirmed 2nd is correct and the CV carries the typo,
 * so 2nd is what ships.
 */
export const awards: Award[] = [
  { id: "best-core-team", title: "The Best Core Team", org: "GDSC", year: 2024 },
  { id: "redesign-2nd", title: "2nd Winner, Redesign Challenge", org: "GDSC", year: 2024 },
  { id: "uiux-1st", title: "1st Winner, UI/UX Competition", org: "Technology Euphoria", year: 2023 },
];

/* ------------------------------------------------------------------ *
 * Certifications. All seven are transcribed from the CV.               *
 * ------------------------------------------------------------------ */

export const certifications: CertIssuer[] = [
  {
    issuer: "Coursera",
    items: [
      {
        id: "coursera-bpm",
        name: "Business Analysis and Process Management",
        year: 2025,
        date: "Nov 2025",
      },
      {
        id: "coursera-excel",
        name: "Create a Financial Statement using Microsoft Excel",
        year: 2025,
        date: "Nov 2025",
      },
      {
        id: "coursera-forensics",
        name: "Digital Forensics Concept",
        year: 2023,
        date: "Jul 2023",
      },
      {
        id: "coursera-css3",
        name: "Introduction to CSS3",
        year: 2022,
        date: "Mar 2022",
      },
    ],
  },
  {
    issuer: "Hacktiv8",
    items: [
      {
        id: "hacktiv8-ibm-genai",
        name: "IBM Generative AI and Machine Learning",
        year: 2024,
        date: "Dec 2024",
      },
    ],
  },
  {
    issuer: "IBM",
    items: [
      {
        id: "ibm-data-science",
        name: "Data Science and Machine Learning Course",
        year: 2024,
        date: "Dec 2024",
      },
    ],
  },
  {
    issuer: "Dicoding Indonesia",
    items: [
      {
        id: "dicoding-visualisasi",
        name: "Belajar Dasar Visualisasi Data",
        year: 2022,
        date: "Dec 2022",
      },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Skills, in the CV's own three categories. Used on the CV page.       *
 * ------------------------------------------------------------------ */

export const skillCategories: SkillCategory[] = [
  {
    id: "content",
    label: "Content and Communications",
    items: [
      "Copywriting",
      "Social Media Management",
      "Content Strategy",
      "Public Relations",
      "Community Engagement",
    ],
  },
  {
    id: "data",
    label: "Data and Technical",
    items: [
      "Python",
      "Machine Learning",
      "Data Analysis",
      "Data Visualization",
      "Microsoft Excel",
      "SEO Analysis",
      "AI Prompting",
      "watsonx.ai",
      "Business Process Analysis",
    ],
  },
  {
    id: "leadership",
    label: "Leadership and Operations",
    items: [
      "Team Leadership",
      "Project Management",
      "Event Coordination",
      "Cross-Functional Collaboration",
      "Critical Thinking",
      "Problem Solving",
    ],
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
    cover: "/images/portal-publik.webp",
    language: "id",
    featured: true,
  },
  {
    id: "google-maps",
    platform: "instagram",
    title: "Google Maps",
    description: "Instagram carousel series on practical Google Maps features most people skip",
    url: "https://www.instagram.com/p/Cnja7OeL4j6/",
    date: "18 Jan 2023",
    cover: "/images/ig-maps.webp",
    language: "id",
  },
  {
    id: "google-dorking",
    platform: "instagram",
    title: "Google Dorking",
    description: "Short Instagram explainer on advanced search operators, with examples",
    url: "https://www.instagram.com/p/CpCeneDLa2o",
    date: "24 Feb 2023",
    cover: "/images/ig-dorking.webp",
    language: "id",
  },
  {
    id: "google-lens",
    platform: "instagram",
    title: "Google Lens",
    description: "Instagram post on searching with a camera instead of words",
    url: "https://www.instagram.com/p/CsIFl4brYxQ/",
    date: "12 May 2023",
    cover: "/images/ig-lens.webp",
    language: "id",
  },
  {
    id: "google-translate",
    platform: "instagram",
    title: "Google Translate",
    description: "Instagram post on getting more out of Google Translate",
    url: "https://www.instagram.com/p/C0YCra8LtML/",
    date: "03 Dec 2023",
    cover: "/images/ig-translate.webp",
    language: "id",
  },
];

/* ------------------------------------------------------------------ *
 * Skills map. Spec 4.4.                                               *
 * ------------------------------------------------------------------ */

/**
 * The Broad column. Spec 4.4 listed seven; these are the CV's own Content and
 * Communications plus Leadership and Operations terms, which supersede the
 * looser originals ("IT", "Creativity") with what the CV actually claims.
 */
export const broadSkills = [
  "Project Management",
  "Event Coordination",
  "Team Leadership",
  "Cross-Functional Collaboration",
  "Critical Thinking",
  "Problem Solving",
  "Copywriting",
  "Social Media Management",
  "Content Strategy",
  "Public Relations",
  "Community Engagement",
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
    id: "data-visualization",
    name: "Data Visualization",
    blurb: "Choosing the chart that answers the question rather than the busiest one.",
  },
  {
    id: "watsonx",
    name: "watsonx.ai",
    blurb: "Calling IBM foundation models through their API, from prompt design to a deployed interface.",
  },
  {
    id: "ai-prompting",
    name: "AI Prompting",
    blurb: "Prompt design and output evaluation against a real task, not a demo.",
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
