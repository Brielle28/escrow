import type { JobCategory, MarketJob } from "./types";

const paragraphs = (parts: string[]) => parts.join("\n\n");

export const marketJobs: MarketJob[] = [
  {
    id: "ckb-wallet-integration",
    title: "CKB wallet connector for React dashboard",
    clientLabel: "North Axis Labs",
    category: "Development",
    budgetMinCkb: 45000,
    budgetMaxCkb: 72000,
    postedAtIso: "2026-05-08T10:00:00Z",
    summary:
      "Wire @ckb-ccc into our escrow dashboard with session-aware routing and clear empty states for disconnected users.",
    description: paragraphs([
      "We’re shipping a client/freelancer dashboard on CKB testnet and need the connector flow polished end-to-end: connect, role selection, signature-backed session, and graceful handling when the signer disappears mid-flow.",
      "You’ll work beside our frontend engineer—Tailwind, React 19, and strict TS. Deliver reusable hooks where it makes sense and document wallet quirks you encounter.",
      "Bonus if you’ve already shipped JoyID / MetaMask / OKX flows against CCC.",
    ]),
    skills: ["React", "TypeScript", "CKB", "CCC", "Tailwind CSS"],
    experienceLevel: "Intermediate",
    durationLabel: "3–5 weeks",
    proposalsCount: 14,
  },
  {
    id: "escrow-ui-brand-system",
    title: "Escrow product UI — components & brand polish",
    clientLabel: "Harbor Studio",
    category: "Design",
    budgetMinCkb: 28000,
    budgetMaxCkb: 44000,
    postedAtIso: "2026-05-07T14:30:00Z",
    summary:
      "Define tokens, type ramp, and component specs for a trust-forward escrow marketplace — landing, auth, and dashboards.",
    description: paragraphs([
      "We want the experience to feel calm and institutional without feeling corporate-grey: clarity first, subtle motion, accessible contrast.",
      "Deliver Figma libraries + dev-ready tokens (we use Tailwind @theme). Include states for wallet-connected chips, role cards, and dashboard KPI shells.",
    ]),
    skills: ["Figma", "Design systems", "Accessibility", "Tailwind"],
    experienceLevel: "Expert",
    durationLabel: "4–6 weeks",
    proposalsCount: 9,
  },
  {
    id: "technical-copy-help-center",
    title: "Technical writer — escrow & CKB help center",
    clientLabel: "Escrow Commons",
    category: "Writing",
    budgetMinCkb: 12000,
    budgetMaxCkb: 22000,
    postedAtIso: "2026-05-06T09:15:00Z",
    summary:
      "Produce concise guides for milestone escrow, dispute windows, and wallet signatures — aimed at freelancers new to CKB.",
    description: paragraphs([
      "You’ll interview our PM twice weekly and ship Markdown into our docs repo. Tone: confident, plain language, no jargon walls.",
      "Include annotated screenshots placeholders and cross-links from in-app empty states.",
    ]),
    skills: ["Technical writing", "Markdown", "CKB basics"],
    experienceLevel: "Intermediate",
    durationLabel: "2–3 weeks",
    proposalsCount: 21,
  },
  {
    id: "growth-loop-email",
    title: "Lifecycle email — activation & milestone reminders",
    clientLabel: "Signal Orchard",
    category: "Marketing",
    budgetMinCkb: 9500,
    budgetMaxCkb: 18000,
    postedAtIso: "2026-05-05T16:45:00Z",
    summary:
      "Design sequences for post-wallet-connect onboarding and milestone nudges without feeling spammy.",
    description: paragraphs([
      "We use a headless ESP and need copy + experiments framework (hypothesis, metric). Prior B2B SaaS or marketplace experience preferred.",
    ]),
    skills: ["Email strategy", "Copywriting", "Analytics"],
    experienceLevel: "Intermediate",
    durationLabel: "2 weeks",
    proposalsCount: 7,
  },
  {
    id: "ledger-reconciliation-script",
    title: "Reconcile on-chain escrow events — reporting script",
    clientLabel: "Ledger Meadow",
    category: "Development",
    budgetMinCkb: 32000,
    budgetMaxCkb: 51000,
    postedAtIso: "2026-05-04T11:20:00Z",
    summary:
      "TypeScript service that indexes deposits/releases and outputs CSV + anomaly flags for our ops desk.",
    description: paragraphs([
      "Must handle rate limits, retries, and idempotent writes. Document assumptions clearly — ops isn’t deep on CKB internals.",
    ]),
    skills: ["TypeScript", "Node.js", "CKB indexer patterns"],
    experienceLevel: "Expert",
    durationLabel: "3–4 weeks",
    proposalsCount: 6,
  },
  {
    id: "motion-marketing-landing",
    title: "Landing motion study — hero & social proof",
    clientLabel: "Drift & Anchor",
    category: "Design",
    budgetMinCkb: 14000,
    budgetMaxCkb: 26000,
    postedAtIso: "2026-05-03T08:00:00Z",
    summary:
      "Lightweight motion for hero globe, floating CTAs, and trust strip — export as CSS prefers-reduced-motion safe.",
    description: paragraphs([
      "Deliver Lottie or CSS-first prototypes aligned with our Tailwind setup. Partner with frontend for perf budgets.",
    ]),
    skills: ["Motion", "CSS", "After Effects"],
    experienceLevel: "Intermediate",
    durationLabel: "10–14 days",
    proposalsCount: 18,
  },
  {
    id: "support-playbook",
    title: "Freelancer success playbook (templates)",
    clientLabel: "Escrow Commons",
    category: "Writing",
    budgetMinCkb: 7500,
    budgetMaxCkb: 13000,
    postedAtIso: "2026-05-02T13:10:00Z",
    summary:
      "Short templates for proposals, milestone updates, and polite dispute escalations — freelance-first tone.",
    description: paragraphs([
      "We’ll plug these into the product as snippets. Include variants for fixed-price vs hourly escrow placeholders.",
    ]),
    skills: ["Templates", "CX writing"],
    experienceLevel: "Entry",
    durationLabel: "1–2 weeks",
    proposalsCount: 26,
  },
  {
    id: "qa-matrix-cross-wallet",
    title: "QA matrix — wallet × browser smoke suite",
    clientLabel: "North Axis Labs",
    category: "Other",
    budgetMinCkb: 8000,
    budgetMaxCkb: 15000,
    postedAtIso: "2026-05-01T15:00:00Z",
    summary:
      "Document flows across JoyID, MetaMask, OKX on Chromium + Safari with screenshots and severity tags.",
    description: paragraphs([
      "Structured spreadsheet + daily Slack summary during two-week sprint. CKB testnet faucet familiarity helps.",
    ]),
    skills: ["QA", "Browsers", "Wallets"],
    experienceLevel: "Entry",
    durationLabel: "2 weeks",
    proposalsCount: 11,
  },
];

const categories: JobCategory[] = ["Development", "Design", "Writing", "Marketing", "Other"];

export function categoryFilters(): { key: JobCategory | "all"; label: string }[] {
  return [{ key: "all", label: "All" }, ...categories.map((c) => ({ key: c, label: c }))];
}

export function getMarketJobById(id: string): MarketJob | undefined {
  return marketJobs.find((j) => j.id === id);
}

export function formatBudgetRange(min: number, max: number): string {
  const fmt = (n: number) =>
    n >= 1000 ? `${(n / 1000).toLocaleString(undefined, { maximumFractionDigits: n % 1000 === 0 ? 0 : 1 })}k` : `${n}`;
  return `${fmt(min)} – ${fmt(max)} CKB`;
}

export function formatPostedRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const days = Math.floor((now - then) / (86400 * 1000));
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
