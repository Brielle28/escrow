import type { MarketFreelancer } from "./types";

const wh = (id: string, i: number, title: string, dateRange: string, summary: string) => ({
  id: `${id}-wh-${i}`,
  title,
  dateRange,
  summary,
});

const emp = (id: string, i: number, role: string, company: string, dateRange: string, description: string) => ({
  id: `${id}-em-${i}`,
  role,
  company,
  dateRange,
  description,
});

const cert = (id: string, i: number, name: string, issuer: string, year: string) => ({
  id: `${id}-ce-${i}`,
  name,
  issuer,
  year,
});

const edu = (id: string, i: number, degree: string, school: string, year: string) => ({
  id: `${id}-ed-${i}`,
  degree,
  school,
  year,
});

export const marketFreelancers: MarketFreelancer[] = [
  {
    id: "maya-chen-frontend",
    avatarSrc: "/LandingPage/HS1.jpg",
    displayName: "Maya Chen",
    headline: "React + CCC integration specialist",
    summary:
      "Ships wallet-aware dashboards with crisp empty states, session recovery, and JoyID / MetaMask parity across Chromium and Safari.",
    category: "Development",
    skills: ["React", "TypeScript", "CCC", "Tailwind CSS", "CKB"],
    hourlyMinCkb: 120,
    hourlyMaxCkb: 165,
    experienceLevel: "Expert",
    jobsCompleted: 48,
    successScore: 98,
    responseTimeLabel: "0–2h",
    locationLabel: "Singapore",
    availableNow: true,
    verified: true,
    rating: 4.95,
    reviewCount: 182,
    badgeLabel: "Top Rated",
    totalEarningsLabel: "1.1M+ CKB",
    totalHours: 6840,
    localTimeLabel: "9:12 PM local",
    languagesLabel: "English, Mandarin",
    consultationPriceLabel: "1,200 CKB per 30 min · video call",
    aboutVideoPosterSrc: "/LandingPage/HS1.jpg",
    aboutExtended: `I help teams ship wallet-native React apps on CKB without the rough edges: session recovery when signers disconnect, role-aware routing, and empty states that explain what to do next instead of blaming the user.

My recent work centers on CCC integrations (JoyID, MetaMask, OKX) with strict TypeScript, Tailwind, and accessibility-minded components. I collaborate closely with designers and backend engineers so escrow milestones stay understandable in the UI.

Outside of delivery, I document wallet quirks as we find them and leave the codebase with hooks and patterns your next hire can extend.`,
    workHistory: [
      wh("maya", 0, "CCC dashboard hardening", "Jan 2026 – Mar 2026", "Session-aware routing, wallet reconnect flows, and empty states when the signer drops — shipped for a CKB escrow dashboard on testnet."),
      wh("maya", 1, "Role-based client shell", "Aug 2025 – Dec 2025", "React 19 + Tailwind UI with reusable wallet hooks, strict TypeScript, and parity checks across JoyID, MetaMask, and OKX."),
      wh("maya", 2, "Cross-browser connector QA", "Jun 2025 – Jul 2025", "Structured smoke passes on Chromium + Safari with annotated issues, daily summaries, and sign-off for a two-week release window."),
    ],
    employmentHistory: [
      emp("maya", 0, "Senior Frontend Engineer", "Escrow Labs", "2022 – Present", "Owns wallet connector architecture, dashboard shells, and shared hooks for milestone flows across client and freelancer surfaces."),
      emp("maya", 1, "Software Engineer", "North Axis Labs", "2019 – 2022", "Built internal ops tools and customer dashboards; introduced TypeScript and component testing practices adopted org-wide."),
    ],
    certifications: [
      cert("maya", 0, "CKB developer fundamentals", "Nervos ecosystem program", "2024"),
      cert("maya", 1, "Advanced React patterns", "Frontend Masters", "2023"),
    ],
    education: [edu("maya", 0, "B.S. Computer Science", "National University of Singapore", "2018")],
  },
  {
    id: "harper-nguyen-design",
    avatarSrc: "/LandingPage/HS2.jpg",
    displayName: "Harper Nguyen",
    headline: "Product designer for trust-first marketplaces",
    summary:
      "Design systems, tokens, and motion that feel institutional without going cold — ideal for escrow flows and dispute-safe UI.",
    category: "Design",
    skills: ["Figma", "Design systems", "Accessibility", "Prototyping"],
    hourlyMinCkb: 95,
    hourlyMaxCkb: 140,
    experienceLevel: "Expert",
    jobsCompleted: 36,
    successScore: 100,
    responseTimeLabel: "0–4h",
    locationLabel: "Toronto, CA",
    availableNow: true,
    verified: true,
    rating: 4.98,
    reviewCount: 141,
    badgeLabel: "Top Rated Plus",
    totalEarningsLabel: "920k+ CKB",
    totalHours: 5120,
    localTimeLabel: "8:05 AM local",
    languagesLabel: "English, French",
    consultationPriceLabel: "950 CKB per 30 min · video call",
    aboutVideoPosterSrc: "/LandingPage/HS2.jpg",
    aboutExtended: `I design calm, legible experiences for regulated and escrow-style products — the kind where a misunderstood state can mean lost trust or a dispute.

My work spans Figma libraries, motion specs that respect prefers-reduced-motion, and tight collaboration with engineers on tokens and component APIs. I care about accessible contrast, predictable hierarchy, and flows that read well for first-time freelancers.

Recent engagements focused on milestone review, dispute windows, and wallet-connected chips that feel intentional rather than bolted on.`,
    workHistory: [
      wh("harper", 0, "Escrow marketplace UI kit", "Feb 2026 – Present", "Figma libraries and dev-ready tokens for milestones, disputes, and wallet chips — calm contrast and motion that respects prefers-reduced-motion."),
      wh("harper", 1, "Trust-forward onboarding", "Sep 2025 – Jan 2026", "End-to-end flows for connect-wallet, role selection, and first milestone — tested with first-time freelancers and accessibility audits."),
      wh("harper", 2, "Design QA for dashboard v2", "May 2025 – Aug 2025", "Pixel-level review with engineering, component state matrix, and documentation for edge cases around locked milestones."),
    ],
    employmentHistory: [
      emp("harper", 0, "Lead Product Designer", "Harbor Studio", "2021 – Present", "Runs design system program for fintech clients; partners with engineering on token pipelines and release governance."),
      emp("harper", 1, "Product Designer", "Drift & Anchor", "2018 – 2021", "Marketing and product surfaces for B2B SaaS; introduced research-backed critique rituals for the design team."),
    ],
    certifications: [
      cert("harper", 0, "IAAP CPACC (accessibility)", "IAAP", "2024"),
      cert("harper", 1, "Figma advanced prototyping", "Figma", "2023"),
    ],
    education: [edu("harper", 0, "B.Des Interaction Design", "OCAD University", "2017")],
  },
  {
    id: "eli-okafor-writer",
    avatarSrc: "/LandingPage/HS3.jpg",
    displayName: "Eli Okafor",
    headline: "Technical writer — CKB & escrow explainers",
    summary:
      "Plain-language guides for milestone releases, signature steps, and dispute windows — tested with first-time freelancers.",
    category: "Writing",
    skills: ["Technical writing", "Markdown", "Information architecture"],
    hourlyMinCkb: 55,
    hourlyMaxCkb: 85,
    experienceLevel: "Intermediate",
    jobsCompleted: 29,
    successScore: 96,
    responseTimeLabel: "0–4h",
    locationLabel: "Berlin, DE",
    availableNow: false,
    verified: true,
    rating: 4.9,
    reviewCount: 88,
    badgeLabel: "Top Rated",
    totalEarningsLabel: "310k+ CKB",
    totalHours: 2890,
    localTimeLabel: "2:18 PM local",
    languagesLabel: "English, German",
    consultationPriceLabel: "600 CKB per 30 min · video call",
    aboutVideoPosterSrc: null,
    aboutExtended: `I translate chain and escrow mechanics into guides people actually finish — short sections, clear examples, and cross-links from the product when users get stuck.

I interview PMs and engineers, ship Markdown into your repo, and iterate from support tickets so the docs track reality. Tone stays confident and plain: no jargon walls.

I’m strongest on milestone releases, signature steps, and dispute windows aimed at freelancers who are new to CKB.`,
    workHistory: [
      wh("eli", 0, "CKB escrow help center", "Jan 2026 – Mar 2026", "Article set covering deposits, releases, and dispute windows with annotated screenshots and cross-links from in-app empty states."),
      wh("eli", 1, "Signature explainer series", "Jul 2025 – Nov 2025", "Short guides that walk non-technical readers through why signatures matter for milestones without drowning them in chain jargon."),
      wh("eli", 2, "Support macro refresh", "Mar 2025 – Jun 2025", "Rewrote 40+ support snippets for tone and accuracy; reduced escalations tied to confusing escrow language."),
    ],
    employmentHistory: [
      emp("eli", 0, "Senior Technical Writer", "Escrow Commons", "2020 – Present", "Owns public help center and in-app copy for escrow products; coordinates with legal on sensitive dispute language."),
      emp("eli", 1, "Technical Writer", "Ledger Meadow", "2017 – 2020", "API docs and runbooks for internal finance tooling; introduced style guide adopted by engineering and support."),
    ],
    certifications: [cert("eli", 0, "Certificate in technical writing", "Berlin Writers Guild", "2019")],
    education: [edu("eli", 0, "B.A. English", "University of Ibadan", "2015")],
  },
  {
    id: "sofia-reyes-growth",
    avatarSrc: "/LandingPage/TP1.jpg",
    displayName: "Sofia Reyes",
    headline: "Lifecycle marketing for activation & retention",
    summary:
      "Sequences that respect inbox trust: onboarding after wallet connect, milestone reminders, and win-back without spammy cadence.",
    category: "Marketing",
    skills: ["Email strategy", "Copywriting", "Experiment design"],
    hourlyMinCkb: 70,
    hourlyMaxCkb: 110,
    experienceLevel: "Intermediate",
    jobsCompleted: 22,
    successScore: 94,
    responseTimeLabel: "0–6h",
    locationLabel: "Mexico City, MX",
    availableNow: true,
    verified: true,
    rating: 4.85,
    reviewCount: 64,
    badgeLabel: null,
    totalEarningsLabel: "265k+ CKB",
    totalHours: 1980,
    localTimeLabel: "11:40 AM local",
    languagesLabel: "English, Spanish",
    consultationPriceLabel: "700 CKB per 30 min · video call",
    aboutVideoPosterSrc: "/LandingPage/TP1.jpg",
    aboutExtended: `I build lifecycle programs that respect the inbox: clear onboarding after wallet connect, milestone nudges that feel helpful, and win-back that doesn’t punish people for being busy.

Experiments are hypothesis-led with readable metrics — not vanity charts. I partner with product and data to sequence touchpoints around real escrow states.

I’ve shipped programs for B2B SaaS and marketplace teams; CKB-aware onboarding is my newest focus area.`,
    workHistory: [
      wh("sofia", 0, "Post-connect activation", "Nov 2025 – Feb 2026", "Lifecycle emails and in-product nudges after wallet connect — hypothesis-led experiments with clear activation metrics."),
      wh("sofia", 1, "Milestone reminder program", "Apr 2025 – Oct 2025", "Polite, time-boxed reminders for clients and freelancers around pending approvals — reduced stalled jobs without extra noise."),
      wh("sofia", 2, "Win-back cohort redesign", "Jan 2025 – Mar 2025", "Rebuilt dormant-user sequence with frequency caps and clearer value props; improved reactivation without complaint spikes."),
    ],
    employmentHistory: [
      emp("sofia", 0, "Lifecycle Marketing Lead", "Signal Orchard", "2021 – Present", "Owns email and in-product campaigns for activation, retention, and expansion across self-serve segments."),
      emp("sofia", 1, "Growth Marketer", "Binary Haw Agency", "2018 – 2021", "Managed paid + lifecycle experiments for SMB clients; built reporting templates still in use."),
    ],
    certifications: [cert("sofia", 0, "Google Ads measurement", "Google", "2023")],
    education: [edu("sofia", 0, "B.B.A. Marketing", "ITESM", "2017")],
  },
  {
    id: "jonas-meier-backend",
    avatarSrc: "/LandingPage/TP2.jpg",
    displayName: "Jonas Meier",
    headline: "TypeScript services for on-chain reporting",
    summary:
      "Indexer-friendly pipelines, idempotent writes, and ops-friendly CSV exports — built for CKB testnet today, mainnet tomorrow.",
    category: "Development",
    skills: ["TypeScript", "Node.js", "Postgres", "CKB patterns"],
    hourlyMinCkb: 110,
    hourlyMaxCkb: 155,
    experienceLevel: "Expert",
    jobsCompleted: 31,
    successScore: 97,
    responseTimeLabel: "0–3h",
    locationLabel: "Zurich, CH",
    availableNow: true,
    verified: true,
    rating: 4.92,
    reviewCount: 112,
    badgeLabel: "Top Rated",
    totalEarningsLabel: "780k+ CKB",
    totalHours: 4210,
    localTimeLabel: "6:22 PM local",
    languagesLabel: "English, German",
    consultationPriceLabel: "1,100 CKB per 30 min · video call",
    aboutVideoPosterSrc: null,
    aboutExtended: `I build TypeScript services that ops teams can trust: idempotent writes, clear logs, CSV exports that match what finance expects, and retry behavior that won’t surprise you at 2 a.m.

My recent focus is CKB testnet reporting — indexing deposits and releases, flagging anomalies, and documenting assumptions so non-chain stakeholders stay aligned.

I enjoy pairing with frontend engineers on contract boundaries and error shapes that read well in the UI.`,
    workHistory: [
      wh("jonas", 0, "On-chain escrow event reporter", "Dec 2025 – Mar 2026", "TypeScript service indexing deposits and releases with retries, rate limits, and CSV output plus anomaly flags for ops."),
      wh("jonas", 1, "Testnet reconciliation tool", "Jun 2025 – Nov 2025", "Daily job comparing indexer state to internal ledger with idempotent writes and clear assumptions documented for non-chain ops."),
      wh("jonas", 2, "Ops CSV automation", "Feb 2025 – May 2025", "Scheduled exports and Slack alerts for mismatched milestone states; reduced manual spreadsheet work for support."),
    ],
    employmentHistory: [
      emp("jonas", 0, "Backend Engineer", "Ledger Meadow", "2019 – Present", "Owns reporting services and data pipelines for on-chain events; mentors junior engineers on TypeScript patterns."),
      emp("jonas", 1, "Software Engineer", "Zurich Analytics GmbH", "2016 – 2019", "ETL jobs and internal APIs; introduced Postgres migration discipline and integration tests."),
    ],
    certifications: [cert("jonas", 0, "AWS Certified Developer", "AWS", "2022")],
    education: [edu("jonas", 0, "M.Sc. Computer Science", "ETH Zürich", "2016")],
  },
  {
    id: "amina-hassan-motion",
    avatarSrc: "/LandingPage/TP3.jpg",
    displayName: "Amina Hassan",
    headline: "Motion for marketing surfaces (perf-aware)",
    summary:
      "CSS-first motion with prefers-reduced-motion defaults — hero treatments, trust strips, and subtle dashboard delight.",
    category: "Design",
    skills: ["Motion", "CSS", "After Effects", "Tailwind"],
    hourlyMinCkb: 80,
    hourlyMaxCkb: 125,
    experienceLevel: "Intermediate",
    jobsCompleted: 19,
    successScore: 95,
    responseTimeLabel: "0–4h",
    locationLabel: "Lagos, NG",
    availableNow: true,
    verified: true,
    rating: 4.88,
    reviewCount: 54,
    badgeLabel: null,
    totalEarningsLabel: "198k+ CKB",
    totalHours: 1650,
    localTimeLabel: "7:50 PM local",
    languagesLabel: "English",
    consultationPriceLabel: "800 CKB per 30 min · video call",
    aboutVideoPosterSrc: "/LandingPage/TP3.jpg",
    aboutExtended: `I craft motion that ships: CSS-first where possible, After Effects when we need richer storytelling, and always a reduced-motion path that still feels polished.

I partner with marketing and frontend on performance budgets so hero treatments don’t tank LCP. Trust strips, subtle dashboard delight, and launch-day polish are my sweet spots.

Recent work emphasized escrow-adjacent marketing pages — clear hierarchy, restrained motion, and states that don’t distract from CTAs.`,
    workHistory: [
      wh("amina", 0, "Landing hero motion study", "Jan 2026 – Feb 2026", "CSS-first hero and social proof motion with performance budgets and a reduced-motion path that stays readable and calm."),
      wh("amina", 1, "Dashboard micro-interactions", "Aug 2025 – Dec 2025", "Subtle transitions for milestone state changes and success moments — aligned with an existing Tailwind token set."),
      wh("amina", 2, "Brand refresh motion kit", "Mar 2025 – Jul 2025", "Exported Lottie + CSS notes for engineering handoff; documented timing tokens for reuse."),
    ],
    employmentHistory: [
      emp("amina", 0, "Motion Designer", "Drift & Anchor", "2020 – Present", "Owns hero and campaign motion; collaborates with brand on guidelines for product surfaces."),
      emp("amina", 1, "Junior Motion Designer", "Lagos Creative Collective", "2018 – 2020", "Social ads and short explainers; built foundational After Effects rigging skills."),
    ],
    certifications: [cert("amina", 0, "Motion design professional", "School of Motion", "2022")],
    education: [edu("amina", 0, "B.A. Visual Communication", "University of Lagos", "2018")],
  },
  {
    id: "noah-park-qa",
    avatarSrc: "/Auth/A1.png",
    displayName: "Noah Park",
    headline: "Cross-wallet QA matrices & release notes",
    summary:
      "Structured coverage across JoyID, MetaMask, and OKX with severity tags, screenshots, and daily Slack summaries for squads.",
    category: "Other",
    skills: ["QA", "Browsers", "Wallets", "Documentation"],
    hourlyMinCkb: 45,
    hourlyMaxCkb: 70,
    experienceLevel: "Entry",
    jobsCompleted: 14,
    successScore: 92,
    responseTimeLabel: "0–5h",
    locationLabel: "Seoul, KR",
    availableNow: false,
    verified: true,
    rating: 4.82,
    reviewCount: 41,
    badgeLabel: null,
    totalEarningsLabel: "95k+ CKB",
    totalHours: 890,
    localTimeLabel: "10:15 AM local",
    languagesLabel: "English, Korean",
    consultationPriceLabel: "450 CKB per 30 min · video call",
    aboutVideoPosterSrc: null,
    aboutExtended: `I run structured QA across wallets and browsers so teams ship with fewer surprises — matrices, screenshots, severity tags, and daily summaries that engineers can act on.

I’m comfortable on CKB testnet flows, faucet quirks, and connector edge cases. I document repro steps clearly and chase regressions until sign-off.

I work well embedded in two-week sprints with tight release windows.`,
    workHistory: [
      wh("noah", 0, "Wallet × browser smoke matrix", "Feb 2026 – Mar 2026", "Structured spreadsheet and severity-tagged runs across Chromium and Safari with screenshots attached to each failure cluster."),
      wh("noah", 1, "Release QA for wallet connector", "Sep 2025 – Jan 2026", "Two-week sprint support with daily Slack summaries, regression passes on connect/disconnect, and sign-off checklists for ship."),
      wh("noah", 2, "Exploratory pass — dispute UI", "May 2025 – Jun 2025", "Exploratory testing on dispute states with edge-case notes for design and legal review."),
    ],
    employmentHistory: [
      emp("noah", 0, "QA Specialist", "North Axis Labs", "2022 – Present", "Embedded QA for wallet-heavy web apps; maintains cross-browser test suites."),
      emp("noah", 1, "QA Intern", "Seoul Software House", "2021 – 2022", "Manual testing and bug triage for mobile-first consumer apps."),
    ],
    certifications: [cert("noah", 0, "ISTQB Foundation", "ISTQB", "2023")],
    education: [edu("noah", 0, "B.S. Information Systems", "Yonsei University", "2021")],
  },
  {
    id: "lena-vogel-templates",
    avatarSrc: "/LandingPage/MB.jpg",
    displayName: "Lena Vogel",
    headline: "Freelancer success templates & snippets",
    summary:
      "Proposal shells, milestone updates, and dispute-safe language — tuned for fixed-price escrow with CKB settlement.",
    category: "Writing",
    skills: ["Templates", "CX writing", "Tone guides"],
    hourlyMinCkb: 40,
    hourlyMaxCkb: 65,
    experienceLevel: "Intermediate",
    jobsCompleted: 41,
    successScore: 99,
    responseTimeLabel: "0–8h",
    locationLabel: "Vienna, AT",
    availableNow: true,
    verified: true,
    rating: 4.97,
    reviewCount: 156,
    badgeLabel: "Top Rated",
    totalEarningsLabel: "410k+ CKB",
    totalHours: 3320,
    localTimeLabel: "1:33 PM local",
    languagesLabel: "English, German",
    consultationPriceLabel: "500 CKB per 30 min · video call",
    aboutVideoPosterSrc: null,
    aboutExtended: `I build snippet libraries and tone guides that help freelancers sound professional without sounding robotic — proposals, milestone updates, and dispute-safe phrasing for CKB escrow.

Every template ships with variants for fixed-price vs hourly placeholders and clear “do / don’t” examples from real escalations (anonymized).

I partner with product to wire snippets into the app and measure reductions in confused tickets.`,
    workHistory: [
      wh("lena", 0, "Freelancer success snippet library", "Oct 2025 – Mar 2026", "Reusable Markdown snippets for proposals, milestone updates, and polite escalations — variants for fixed-price vs hourly placeholders."),
      wh("lena", 1, "Dispute-safe messaging guide", "Mar 2025 – Sep 2025", "Tone guide and templates for edge cases around late deliverables and scope changes, aligned with escrow dispute windows."),
      wh("lena", 2, "CX macro audit", "Jan 2025 – Feb 2025", "Reviewed 200+ support macros for tone and policy alignment; delivered prioritized rewrite backlog."),
    ],
    employmentHistory: [
      emp("lena", 0, "Principal CX Writer", "Escrow Commons", "2019 – Present", "Owns freelancer-facing templates and in-product microcopy for marketplace trust."),
      emp("lena", 1, "Content Strategist", "Vienna Digital Co-op", "2016 – 2019", "Editorial calendars and email programs for member organizations."),
    ],
    certifications: [cert("lena", 0, "UX writing certificate", "Nielsen Norman Group", "2021")],
    education: [edu("lena", 0, "M.A. Communication", "University of Vienna", "2015")],
  },
];

export function getMarketFreelancerById(id: string): MarketFreelancer | undefined {
  return marketFreelancers.find((f) => f.id === id);
}

export function formatHourlyRange(min: number, max: number): string {
  const fmt = (n: number) => `${n.toLocaleString()} CKB`;
  return `${fmt(min)} – ${fmt(max)} / hr`;
}
