import type { JobStatus } from "../../types/dashboard";

export function statusLabel(status: JobStatus): string {
  const map: Record<JobStatus, string> = {
    draft: "Draft",
    open: "Recruiting",
    matched: "Matched",
    terms_confirmed: "Terms confirmed",
    funding_pending: "Funding",
    funded: "In progress",
    submitted: "In review",
    completed: "Completed",
    disputed: "Disputed",
    resolved: "Resolved",
    timeout_eligible: "Timeout eligible",
    timeout_settled: "Timeout settled",
  };
  return map[status];
}

export function statusTone(status: JobStatus): "brand" | "amber" | "rose" | "slate" | "emerald" {
  if (status === "disputed" || status === "resolved") return "rose";
  if (status === "submitted" || status === "funding_pending") return "amber";
  if (status === "completed" || status === "timeout_settled") return "slate";
  if (status === "funded") return "emerald";
  return "brand";
}
