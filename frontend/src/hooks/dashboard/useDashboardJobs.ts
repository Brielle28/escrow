import { useEffect, useState } from "react";
import { fetchDashboardJobs } from "../../api/dashboard";
import type { PaginatedJobs } from "../../types/dashboard";
import type { ActingRole } from "../../utils/auth/session";

export function useDashboardJobs(
  role: ActingRole,
  token: string | undefined,
  bucket: string,
  page: number,
) {
  const [data, setData] = useState<PaginatedJobs | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    void fetchDashboardJobs(role, token, { bucket, page })
      .then((jobs) => {
        if (!cancelled) setData(jobs);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load contracts");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [role, token, bucket, page]);

  return { data, error, isLoading, refetch: () => setData(null) };
}
