import type { JobCategory } from "../MarketJobs/types";
import type { MarketFreelancer } from "./types";

export function filterMarketFreelancers(
  people: readonly MarketFreelancer[],
  query: string,
  category: JobCategory | "all",
): MarketFreelancer[] {
  const q = query.trim().toLowerCase();
  return people.filter((person) => {
    if (category !== "all" && person.category !== category) return false;
    if (!q) return true;
    const blob = [
      person.displayName,
      person.headline,
      person.summary,
      person.aboutExtended,
      person.locationLabel,
      person.experienceLevel,
      person.languagesLabel,
      ...person.skills,
      ...person.workHistory.flatMap((w) => [w.title, w.summary, w.dateRange]),
      ...person.employmentHistory.flatMap((e) => [e.role, e.company, e.description, e.dateRange]),
      ...person.certifications.flatMap((c) => [c.name, c.issuer, c.year]),
      ...person.education.flatMap((e) => [e.degree, e.school, e.year]),
    ]
      .join(" ")
      .toLowerCase();
    return blob.includes(q);
  });
}
