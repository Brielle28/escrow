export const marketJobsPageCopy = {
  heroEyebrow: "Job market",
  heroTitle: "Find work you care about",
  heroSubtitle:
    "CKB-secured roles from serious clients. Filter by focus, scan budgets in CKB, and open a role to read the full brief before you apply.",
  searchPlaceholder: "Search titles, skills, or client…",
  findWorkButton: "Find work",
  categoriesLabel: "Categories",
  filterAll: "All",
  resultsLabel: (n: number) => (n === 1 ? "1 open role" : `${n} open roles`),
  emptyTitle: "No roles match that search",
  emptyBody: "Try a different keyword or clear filters to see everything on the market.",
  clearFilters: "Clear filters",
} as const;

export const jobDetailCopy = {
  backToMarket: "Back to job market",
  notFoundTitle: "We couldn’t find that job",
  notFoundBody: "It may have been filled or removed. Head back to browse open roles.",
  openRoles: "Browse open roles",
  sectionAbout: "About this project",
  sectionSkills: "Skills & tools",
  sectionClient: "Client",
  experience: "Experience",
  duration: "Timeline",
  proposals: "Proposals",
  budget: "Budget (CKB)",
  ctaTitle: "Ready to apply?",
  ctaBody: "Connect your wallet, pick your role, and sign in. You’ll use this address for escrow on CKB.",
  ctaButton: "Connect & continue",
} as const;
