import { useEffect, useState } from "react";
import { fetchDashboardOverview } from "../../api/dashboard";
import type { DashboardOverview } from "../../types/dashboard";
import type { ActingRole } from "../../utils/auth/session";

export function useDashboardOverview(role: ActingRole, token: string | undefined) {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    void fetchDashboardOverview(role, token)
      .then((overview) => {
        if (!cancelled) setData(overview);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load overview");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [role, token]);

  return { data, error, isLoading };
}
