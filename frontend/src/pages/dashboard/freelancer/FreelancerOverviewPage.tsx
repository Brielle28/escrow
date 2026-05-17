import { Link } from "react-router-dom";
import { AlertCircle, Briefcase, CheckCircle2, Compass, FolderKanban } from "lucide-react";
import { ContractTable } from "../../../components/dashboard/contracts/ContractTable";
import { KpiStrip } from "../../../components/dashboard/kpi/KpiStrip";
import { DashboardActionLink } from "../../../components/dashboard/shared/DashboardActionLink";
import { DashboardPageHeader } from "../../../components/dashboard/shared/DashboardPageHeader";
import { DashboardSection } from "../../../components/dashboard/shared/DashboardSection";
import { useDashboardOverview } from "../../../hooks/dashboard/useDashboardOverview";
import { useDashboardJobs } from "../../../hooks/dashboard/useDashboardJobs";
import { useSession } from "../../../providers/SessionProvider";

export function FreelancerOverviewPage() {
  const { session } = useSession();
  const { data: overview, isLoading, error } = useDashboardOverview("freelancer", session?.token);
  const { data: active } = useDashboardJobs("freelancer", session?.token, "active", 1);

  const kpis = [
    { label: "Needs action", value: overview?.needsAction ?? "—", hint: "Terms or delivery", icon: AlertCircle },
    { label: "Open disputes", value: overview?.openDisputes ?? "—", hint: "Requires attention", icon: Briefcase },
    { label: "Completed", value: overview?.completed ?? "—", hint: "Paid engagements", icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Dashboard"
        subtitle="Track applications, active contracts, and escrow status."
        actions={
          <>
            <DashboardActionLink to="/dashboard/freelancer/jobs" icon={Compass} variant="primary">
              Browse jobs
            </DashboardActionLink>
            <DashboardActionLink to="/dashboard/freelancer/contracts" icon={FolderKanban} variant="outline">
              My contracts
            </DashboardActionLink>
          </>
        }
      />
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {isLoading ? <p className="text-sm text-gray-500">Loading…</p> : <KpiStrip items={kpis} columns={3} />}
      <DashboardSection
        title="Active contracts"
        action={
          <Link to="/dashboard/freelancer/contracts" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            View all
          </Link>
        }
      >
        <ContractTable
          embedded
          jobs={active?.jobs.slice(0, 5) ?? []}
          workspaceBasePath="/dashboard/freelancer/jobs"
          emptyMessage="Browse the job market to start earning."
        />
      </DashboardSection>
    </div>
  );
}
