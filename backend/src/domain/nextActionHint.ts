import type { ActingRole, JobStatus } from "./types.js";

export function nextActionHint(status: JobStatus, role: ActingRole): string {
  const map: Record<JobStatus, { client: string; freelancer: string }> = {
    draft: { client: "Finish and publish", freelancer: "—" },
    open: { client: "Review applicants", freelancer: "Apply on job board" },
    matched: { client: "Confirm terms", freelancer: "Confirm terms" },
    terms_confirmed: { client: "Fund escrow", freelancer: "Awaiting fund" },
    funding_pending: { client: "Complete funding", freelancer: "Awaiting fund" },
    funded: { client: "Monitor progress", freelancer: "Submit work" },
    submitted: { client: "Review and release", freelancer: "Awaiting review" },
    completed: { client: "View settlement", freelancer: "View settlement" },
    disputed: { client: "View dispute", freelancer: "View dispute" },
    resolved: { client: "View resolution", freelancer: "View resolution" },
    timeout_eligible: { client: "Check timeout rules", freelancer: "Check timeout rules" },
    timeout_settled: { client: "View settlement", freelancer: "View settlement" },
  };
  const row = map[status];
  return role === "client" ? row.client : row.freelancer;
}
