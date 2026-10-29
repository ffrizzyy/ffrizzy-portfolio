import type {
  Award,
  CertIssuer,
  GrowthAccount,
  GrowthSlide,
  MediumArticle,
  PortfolioEvent,
  Skill,
  SkillCategory,
  Stat,
  TimelineEntry,
  Tool,
  WritingItem,
} from "./schema";

/* ------------------------------------------------------------------ *
 * Stat grid. Spec 4.2.                                                *
 * ------------------------------------------------------------------ */

/**
 * Six accumulated numbers. GPA, followers, and views are typed here with a
 * method and an asOf date. Events, projects, and repositories are computed at
 * load time in lib/content.ts, which is why their `value` is a placeholder.
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
    href: "/cv",
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
    detail: "Build, data, research, design, and public repositories",
    method:
      "Counted automatically from content/projects.ts, plus one entry for each public repository that does not have a written case study yet. A new repository moves the number on the next daily sync.",
    asOf: "2026",
    icon: "Stack",
    viz: "stack",
    href: "#all",
  },
  {
    id: "repos",
    value: 0,
    computedFrom: "repos",
    kind: "exact",
    label: "public repositories",
    detail: "On GitHub, each with a case study where one exists",
    method:
      "Counted from the public GitHub API for @ffrizzyy and cached for a day. When the API is unreachable or rate limited, the count comes from the last committed repository snapshot, so the number never renders as zero.",
    asOf: "2026",
    icon: "GithubLogo",
    viz: "repos",
    href: "#repos",
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
  "Information Systems graduate working across technology, content, and operations. Experience spans web and data tools, content and social media, and leading teams and events. Learns new tools quickly, mostly through self-directed courses in machine learning, SEO, and business process management.";

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
      "Planned and ran the Instagram and TikTok content calendar, using performance data to raise engagement 20%, grow followers 15%, and lift the interaction rate 25%.",
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
      "Ran a Ramadan digital marketing campaign about doing good deeds with a remote team, from setting the goals and building the timeline to reviewing performance data at the end.",
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
      "Analyzed business processes in the Operations and Maintenance (OP-HAR) division to find workflow problems and inefficiencies.",
      "Used questionnaires, interviews, and observations to study the workflows, and applied use cases, user stories, UML diagrams, flowcharts, gap analysis, and prototyping to support recommendations for improvement.",
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
    bullets: ["Audited webpages for on-page and off-page SEO."],
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
      "Coordinated event content across platforms; engagement grew 30% for an audience of 2,000+ attendees.",
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
      "Led the publication team behind event content across Instagram, TikTok, and Twitter; engagement grew 80% for an event with 2,000+ attendees.",
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
    display: "Aug 2021 to Apr 2025",
    location: "Palembang, Indonesia",
    bullets: [
      "Built web applications and automated data-processing tools through coursework and extracurricular projects.",
      "Coursework covered system design, digital forensics, machine learning, and data analytics.",
    ],
  },
  {
    id: "sman1-sungai-penuh",
    institution: "SMAN 1 Sungai Penuh",
    degree: "Senior High School, Mathematics and Natural Sciences (MIPA)",
    display: "Aug 2018 to Aug 2021",
    location: "Sungai Penuh, Indonesia",
    bullets: [
      "Selected in Grade 11 as one of three school representatives for the city-level KSN (National Science Competition) mathematics olympiad.",
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
  /**
   * Topindoku win, from the signed certificate: 162/B/S.Ket/Pan-ITFAIRXIII/
   * HIMATIF/II/2024, awarded to team DEUX TEAM as Juara 1 in the UI/UX design
   * competition at IT Fair XIII, UIN Sunan Gunung Djati Bandung.
   */
  { id: "topindoku-uiux-1st", title: "1st Winner, UI/UX Design Competition", org: "Topindoku, IT Fair XIII", year: 2024 },
  { id: "uiux-1st", title: "1st Winner, UI/UX Competition", org: "Technology Euphoria", year: 2023 },
];

/* ------------------------------------------------------------------ *
 * Certifications. The Coursera, Hacktiv8, IBM and Dicoding entries    *
 * are transcribed from the CV; the Claude Academy badges were earned   *
 * since and are reported here as well.                                *
 * ------------------------------------------------------------------ */

export const certifications: CertIssuer[] = [
  {
    issuer: "Claude Academy",
    items: [
      {
        id: "claude-code-101",
        name: "Claude Code 101",
        year: 2026,
        date: "Oct 2026",
        // Each badge has a public verification page, so the credential itself
        // can be checked rather than taken on trust.
        credentialUrl: "https://academy.claude.com/verify/0d998f2cb6f5e6e1544649275aaf2645",
      },
      {
        id: "claude-code-in-action",
        name: "Claude Code in action",
        year: 2026,
        date: "Oct 2026",
        credentialUrl: "https://academy.claude.com/verify/9d2b7dc3986fe851f19d16431e78dc03",
      },
    ],
  },
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
      "Go",
      "JavaScript",
      "TypeScript",
      "Next.js",
      "SQL",
      "Tableau",
      "Microsoft Excel",
      "Machine Learning",
      "Data Analysis",
      "Data Visualization",
      "SEO Analysis",
      "AI Prompting",
      "watsonx.ai",
      "Business Process Analysis",
    ],
  },
  {
    id: "tools",
    label: "Tools and Platforms",
    items: [
      "Adobe Photoshop",
      "Visual Studio Code",
      "Git and GitHub",
      "Docker",
      "Google Sheets",
      "Notion",
      "Trello",
      "Jira",
      "Figma",
      "Claude",
      "ChatGPT",
      "DeepSeek",
      "Gemini",
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

export const growthSlides: GrowthSlide[] = [
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

export const growthAccounts: GrowthAccount[] = [
  {
    id: "gdsc-unsri",
    handle: "@gdgunsri",
    org: "GDSC UNSRI",
    url: "https://www.instagram.com/gdgunsri/",
  },
  {
    id: "technology-euphoria",
    handle: "@techporiafest",
    org: "Technology Euphoria",
    url: "https://www.instagram.com/techporiafest/",
  },
  {
    id: "pesta-rakyat-sriwijaya",
    handle: "@bhawasenasriwijaya",
    org: "Pesta Rakyat Sriwijaya",
    url: "https://www.instagram.com/bhawasenasriwijaya/",
  },
  {
    id: "sriwijaya-digital",
    handle: "@sriwijaya.digital",
    org: "Sriwijaya Digital",
    url: "https://www.instagram.com/sriwijaya.digital/",
  },
  {
    id: "mvs-lim",
    handle: "@mvslim",
    org: "MVS LIM",
    url: "https://www.instagram.com/mvslim/",
  },
];

/* ------------------------------------------------------------------ *
 * Writing. Spec 4.8 and 5.4.                                          *
 * ------------------------------------------------------------------ */

/**
 * The LinkedIn article describing KITO, published 30 Sep 2026.
 *
 * Defined once, here, because it is referenced from two places: this writing
 * entry and the portal-publik project's link list. It was written out twice
 * before, one copy was corrected and the other was not, which left a link to the
 * LinkedIn homepage sitting in the writing section.
 */
export const kitoArticleUrl =
  "https://www.linkedin.com/pulse/ai-engineer-muhammad-farrel-al-wafi-frizzy-ixuyf";

export const writing: WritingItem[] = [
  {
    id: "kito-article",
    platform: "linkedin",
    title: "KITO: Kanal Informasi, Transparansi & Observasi",
    description:
      "How a Telegram bot, an AI agent, and a public portal give Palembang residents one simple place to report problems and track what happens next.",
    url: kitoArticleUrl,
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

/**
 * Medium stories, mirrored from https://ffrizzy.medium.com/feed.
 *
 * The feed carries the whole post body, which the writing section does not
 * need, so the titles, dates, and URLs are copied here rather than fetched at
 * build time. Add a story by reading the feed and appending one entry.
 */
export const mediumArticles: MediumArticle[] = [
  {
    id: "knowledgekeeper-prologue",
    title: "The Knowledgekeeper (prologue)",
    description:
      "A speculative fiction prologue that asks what the world would look like if nothing ever learned was forgotten.",
    url: "https://ffrizzy.medium.com/the-knowledgekeeper-1a3ab2ec2fc0",
    date: "27 Oct 2026",
  },
  {
    id: "art-of-acronyms",
    title: "The Art of Acronyms",
    description:
      "An essay on why we turn names, event themes, and ideas into initials, and what those shortcuts give us.",
    url: "https://ffrizzy.medium.com/the-art-of-acronyms-81a6fe8aebb4",
    date: "01 Sep 2023",
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
    id: "sql",
    name: "SQL",
    blurb: "Querying and shaping relational data, most recently on SQLite.",
  },
  {
    id: "photoshop",
    name: "Adobe Photoshop",
    blurb: "Visual editing for covers, cards, and social assets.",
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
  photoshop: [{ label: "Instagram series", href: "#writing" }],
};

/**
 * Spec 4.4: the tools strip. The strip renders a mark for every slug that
 * resolves in ToolStrip's icon maps and silently drops the rest, so this list
 * is the problem statement rather than the render: a slug with no mark simply
 * does not appear.
 *
 * Most slugs are simple-icons entries, all on the 24x24 grid. Excel, Adobe
 * Photoshop, Visual Studio Code, and ChatGPT are not in the installed
 * simple-icons set, so their marks come from other public icon sets through
 * lib/brand-icons.ts, generated by scripts/gen-brand-icons.mjs. Spec 1.1's rule
 * against hand-drawing a missing brand still holds: those marks are sourced,
 * not drawn.
 */
export const tools: Tool[] = [
  { slug: "claude", name: "Claude" },
  { slug: "chatgpt", name: "ChatGPT" },
  { slug: "deepseek", name: "DeepSeek" },
  { slug: "googlegemini", name: "Gemini" },
  { slug: "githubcopilot", name: "GitHub Copilot" },
  { slug: "python", name: "Python" },
  { slug: "go", name: "Go" },
  { slug: "typescript", name: "TypeScript" },
  { slug: "javascript", name: "JavaScript" },
  { slug: "react", name: "React" },
  { slug: "nextdotjs", name: "Next.js" },
  { slug: "nodedotjs", name: "Node.js" },
  { slug: "tailwindcss", name: "Tailwind CSS" },
  { slug: "docker", name: "Docker" },
  { slug: "git", name: "Git" },
  { slug: "github", name: "GitHub" },
  { slug: "vercel", name: "Vercel" },
  { slug: "mysql", name: "MySQL" },
  { slug: "postgresql", name: "PostgreSQL" },
  { slug: "sqlite", name: "SQLite" },
  { slug: "excel", name: "Microsoft Excel" },
  { slug: "googlesheets", name: "Google Sheets" },
  { slug: "notion", name: "Notion" },
  { slug: "jira", name: "Jira" },
  { slug: "streamlit", name: "Streamlit" },
  { slug: "trello", name: "Trello" },
  { slug: "figma", name: "Figma" },
  { slug: "photoshop", name: "Adobe Photoshop" },
  { slug: "vscode", name: "Visual Studio Code" },
  { slug: "meta", name: "Meta" },
  { slug: "google", name: "Google" },
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
