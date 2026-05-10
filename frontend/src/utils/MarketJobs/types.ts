export type JobCategory = "Development" | "Design" | "Writing" | "Marketing" | "Other";

export type ExperienceLevel = "Entry" | "Intermediate" | "Expert";

export type MarketJob = {
  id: string;
  title: string;
  clientLabel: string;
  category: JobCategory;
  budgetMinCkb: number;
  budgetMaxCkb: number;
  postedAtIso: string;
  summary: string;
  description: string;
  skills: string[];
  experienceLevel: ExperienceLevel;
  durationLabel: string;
  proposalsCount: number;
};
