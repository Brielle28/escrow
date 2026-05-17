export type ActingRole = "client" | "freelancer";

export type JobStatus =
  | "draft"
  | "open"
  | "matched"
  | "terms_confirmed"
  | "funding_pending"
  | "funded"
  | "submitted"
  | "completed"
  | "disputed"
  | "resolved"
  | "timeout_eligible"
  | "timeout_settled";

export type JobRecord = {
  id: string;
  title: string;
  description: string;
  status: JobStatus;
  clientAddress: string;
  freelancerAddress: string | null;
  budgetCkb: string;
  deliveryDateIso: string;
  createdAt: number;
  updatedAt: number;
};

export type JobListItem = {
  id: string;
  title: string;
  status: JobStatus;
  clientAddress: string;
  freelancerAddress: string | null;
  budgetCkb: string;
  updatedAt: number;
  nextActionHint: string;
};

export type DashboardOverview = {
  activeContracts: number;
  needsAction: number;
  awaitingReview: number;
  openDisputes: number;
  completed: number;
};

export type PaginatedJobs = {
  bucket: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  jobs: JobListItem[];
};

export type AdminSessionRecord = {
  token: string;
  address: string;
  createdAt: number;
  expiresAt: number;
};
