import type { ActingRole } from "../utils/auth/session";
import type { AdminOverview, DashboardOverview, PaginatedJobs } from "../types/dashboard";
import { apiFetch } from "./http";

export function fetchDashboardOverview(role: ActingRole, token: string): Promise<DashboardOverview> {
  return apiFetch(`/api/dashboard/${role}/overview`, { token });
}

export function fetchDashboardJobs(
  role: ActingRole,
  token: string,
  query: { bucket: string; page: number; limit?: number },
): Promise<PaginatedJobs> {
  const params = new URLSearchParams({
    bucket: query.bucket,
    page: String(query.page),
    limit: String(query.limit ?? 20),
  });
  return apiFetch(`/api/dashboard/${role}/jobs?${params}`, { token });
}

export function verifyAdminSession(address: string): Promise<{
  token: string;
  session: { address: string; createdAt: number; expiresAt: number };
}> {
  return apiFetch("/api/admin/auth/verify", {
    method: "POST",
    body: JSON.stringify({ address }),
  });
}

export function fetchAdminOverview(token: string): Promise<AdminOverview> {
  return apiFetch("/api/admin/overview", { token });
}
