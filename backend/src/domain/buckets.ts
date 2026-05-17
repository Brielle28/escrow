import type { ActingRole, JobStatus } from "./types.js";

export type ClientBucket = "needs_action" | "active" | "disputed" | "completed" | "all";
export type FreelancerBucket = "active" | "applications" | "disputed" | "completed" | "all";

const clientBucketStatuses: Record<ClientBucket, JobStatus[]> = {
  needs_action: ["matched", "terms_confirmed", "funding_pending", "submitted"],
  active: ["funded"],
  disputed: ["disputed", "resolved"],
  completed: ["completed", "timeout_settled"],
  all: [],
};

const freelancerBucketStatuses: Record<FreelancerBucket, JobStatus[]> = {
  active: ["funded", "submitted", "matched", "terms_confirmed", "funding_pending"],
  applications: [],
  disputed: ["disputed", "resolved"],
  completed: ["completed", "timeout_settled"],
  all: [],
};

export function parseClientBucket(raw: string | undefined): ClientBucket {
  if (raw === "needs_action" || raw === "active" || raw === "disputed" || raw === "completed" || raw === "all") {
    return raw;
  }
  return "active";
}

export function parseFreelancerBucket(raw: string | undefined): FreelancerBucket {
  if (raw === "active" || raw === "applications" || raw === "disputed" || raw === "completed" || raw === "all") {
    return raw;
  }
  return "active";
}

export function statusesForClientBucket(bucket: ClientBucket): JobStatus[] | null {
  if (bucket === "all") return null;
  return clientBucketStatuses[bucket];
}

export function statusesForFreelancerBucket(bucket: FreelancerBucket): JobStatus[] | null {
  if (bucket === "all") return null;
  return freelancerBucketStatuses[bucket];
}

export function matchesBucket(status: JobStatus, statuses: JobStatus[] | null): boolean {
  if (!statuses) return true;
  return statuses.includes(status);
}

export function computeOverviewCounts(jobs: { status: JobStatus }[], role: ActingRole): {
  activeContracts: number;
  needsAction: number;
  awaitingReview: number;
  openDisputes: number;
  completed: number;
} {
  const activeStatuses: JobStatus[] =
    role === "client"
      ? ["funded", "matched", "terms_confirmed", "funding_pending"]
      : ["funded", "submitted", "matched", "terms_confirmed", "funding_pending"];

  const needsActionStatuses: JobStatus[] =
    role === "client"
      ? ["matched", "terms_confirmed", "funding_pending", "submitted"]
      : ["matched", "terms_confirmed", "funding_pending"];

  return {
    activeContracts: jobs.filter((j) => activeStatuses.includes(j.status)).length,
    needsAction: jobs.filter((j) => needsActionStatuses.includes(j.status)).length,
    awaitingReview: jobs.filter((j) => j.status === "submitted").length,
    openDisputes: jobs.filter((j) => j.status === "disputed" || j.status === "resolved").length,
    completed: jobs.filter((j) => j.status === "completed" || j.status === "timeout_settled").length,
  };
}
