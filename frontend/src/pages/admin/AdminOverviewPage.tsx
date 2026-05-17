import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Gavel, Clock, CheckCircle, FileWarning } from "lucide-react";
import { fetchAdminOverview } from "../../api/dashboard";
import { KpiStrip } from "../../components/dashboard/kpi/KpiStrip";
import { DashboardPageHeader } from "../../components/dashboard/shared/DashboardPageHeader";
import { useAdminSession } from "../../providers/AdminSessionProvider";
import type { AdminOverview } from "../../types/dashboard";

export function AdminOverviewPage() {
  const { session } = useAdminSession();
  const [data, setData] = useState<AdminOverview | null>(null);

  useEffect(() => {
    if (!session?.token) return;
    void fetchAdminOverview(session.token).then(setData);
  }, [session?.token]);

  const kpis = [
    { label: "Open disputes", value: data?.openDisputes ?? "—", icon: Gavel, featured: true },
    { label: "Stale cases", value: data?.staleDisputes ?? "—", icon: Clock },
    { label: "Resolved (7d)", value: data?.resolvedLast7d ?? "—", icon: CheckCircle },
    { label: "Pending evidence", value: data?.pendingEvidence ?? "—", icon: FileWarning },
  ];

  return (
    <div className="space-y-8">
      <DashboardPageHeader title="Admin overview" subtitle="Dispute queue and platform health." />
      <KpiStrip items={kpis} />
      <Link to="/admin/disputes" className="dashboard-btn-primary">
        Open dispute inbox
      </Link>
    </div>
  );
}
