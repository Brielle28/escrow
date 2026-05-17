import { Link } from "react-router-dom";
import { Activity, CheckCircle2, FileText, FilePlus, Users } from "lucide-react";
import { KpiStrip } from "../../../components/dashboard/kpi/KpiStrip";
import { ContractTable } from "../../../components/dashboard/contracts/ContractTable";
import { DashboardActionLink } from "../../../components/dashboard/shared/DashboardActionLink";
import { DashboardPageHeader } from "../../../components/dashboard/shared/DashboardPageHeader";
import { DashboardSection } from "../../../components/dashboard/shared/DashboardSection";
import { useDashboardOverview } from "../../../hooks/dashboard/useDashboardOverview";
import { useDashboardJobs } from "../../../hooks/dashboard/useDashboardJobs";
import { useSession } from "../../../providers/SessionProvider";

export function ClientOverviewPage() {
  const { session } = useSession();
  const { data: overview, isLoading, error } = useDashboardOverview("client", session?.token);
  const { data: needsAction } = useDashboardJobs("client", session?.token, "needs_action", 1);

  const kpis = [
    {
      label: "Active contracts",
      value: overview?.activeContracts ?? "—",
      hint: "In progress on-chain",
      icon: Activity,
    },
    {
      label: "Awaiting review",
      value: overview?.awaitingReview ?? "—",
      hint: "Submissions to approve",
      icon: FileText,
    },
    {
      label: "Completed",
      value: overview?.completed ?? "—",
      hint: "Settled engagements",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Dashboard"
        subtitle="Manage contracts, escrow funding, and deliveries in one place."
        actions={
          <>
            <DashboardActionLink to="/dashboard/client/contracts/new" icon={FilePlus} variant="primary">
              Post contract
            </DashboardActionLink>
            <DashboardActionLink to="/dashboard/client/talent" icon={Users} variant="outline">
              Browse talent
            </DashboardActionLink>
          </>
        }
      />

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {isLoading ? <p className="text-sm text-gray-500">Loading overview…</p> : <KpiStrip items={kpis} columns={3} />}

      <DashboardSection
        title="Needs your action"
        action={
          <Link to="/dashboard/client/contracts?bucket=needs_action" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            View all
          </Link>
        }
      >
        <ContractTable
          embedded
          jobs={needsAction?.jobs.slice(0, 5) ?? []}
          workspaceBasePath="/dashboard/client/jobs"
          emptyMessage="You're all caught up."
        />
      </DashboardSection>
    </div>
  );
}
