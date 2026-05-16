import type { ExperienceLevel, JobCategory } from "../MarketJobs/types";

export type WorkHistoryEntry = {
  id: string;
  title: string;
  dateRange: string;
  summary: string;
};

export type EmploymentEntry = {
  id: string;
  role: string;
  company: string;
  dateRange: string;
  description: string;
};

export type CertificationEntry = {
  id: string;
  name: string;
  issuer: string;
  year: string;
};

export type EducationEntry = {
  id: string;
  degree: string;
  school: string;
  year: string;
};

export type MarketFreelancer = {
  id: string;
  /** Public URL under `frontend/public/` (e.g. `/LandingPage/HS1.jpg`). */
  avatarSrc: string;
  displayName: string;
  headline: string;
  summary: string;
  category: JobCategory;
  skills: string[];
  hourlyMinCkb: number;
  hourlyMaxCkb: number;
  experienceLevel: ExperienceLevel;
  jobsCompleted: number;
  successScore: number;
  responseTimeLabel: string;
  locationLabel: string;
  availableNow: boolean;
  verified: boolean;
  /** 4.0 – 5.0 */
  rating: number;
  reviewCount: number;
  badgeLabel: string | null;
  totalEarningsLabel: string;
  totalHours: number;
  localTimeLabel: string;
  languagesLabel: string;
  consultationPriceLabel: string;
  /** Long-form copy for the About tab. */
  aboutExtended: string;
  /** Poster for optional intro video block; `null` hides the block. */
  aboutVideoPosterSrc: string | null;
  workHistory: WorkHistoryEntry[];
  employmentHistory: EmploymentEntry[];
  certifications: CertificationEntry[];
  education: EducationEntry[];
};
