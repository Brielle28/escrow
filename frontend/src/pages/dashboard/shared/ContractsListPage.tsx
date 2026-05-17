import { Link, useSearchParams } from "react-router-dom";
import { BucketTabs } from "../../../components/dashboard/contracts/BucketTabs";
import { ContractTable } from "../../../components/dashboard/contracts/ContractTable";
import { PaginationBar } from "../../../components/dashboard/contracts/PaginationBar";
import { DashboardPageHeader } from "../../../components/dashboard/shared/DashboardPageHeader";
import { useDashboardJobs } from "../../../hooks/dashboard/useDashboardJobs";
import type { ActingRole } from "../../../utils/auth/session";
import { useSession } from "../../../providers/SessionProvider";

const clientTabs = [
  { id: "needs_action", label: "Needs action" },
  { id: "active", label: "Active" },
  { id: "disputed", label: "Disputed" },
  { id: "completed", label: "Completed" },
];

const freelancerTabs = [
  { id: "active", label: "Active" },
  { id: "disputed", label: "Disputed" },
  { id: "completed", label: "Completed" },
];

type ContractsListPageProps = {
  role: ActingRole;
  title: string;
  publishHref?: string;
};

export function ContractsListPage({ role, title, publishHref }: ContractsListPageProps) {
  const { session } = useSession();
  const [searchParams, setSearchParams] = useSearchParams();
  const bucket = searchParams.get("bucket") ?? (role === "client" ? "needs_action" : "active");
  const page = Number(searchParams.get("page") ?? "1") || 1;
  const tabs = role === "client" ? clientTabs : freelancerTabs;
  const basePath = role === "client" ? "/dashboard/client/jobs" : "/dashboard/freelancer/jobs";

  const { data, error, isLoading } = useDashboardJobs(role, session?.token, bucket, page);

  function setBucket(next: string) {
    setSearchParams({ bucket: next, page: "1" });
  }

  function setPage(next: number) {
    setSearchParams({ bucket, page: String(next) });
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={title}
        subtitle="Paginated list of your on-chain escrow contracts."
        actions={
          publishHref ? (
            <Link to={publishHref} className="dashboard-btn-primary">
              + Publish work
            </Link>
          ) : undefined
        }
      />

      <BucketTabs tabs={tabs} active={bucket} onChange={setBucket} />

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading contracts…</p>
      ) : error ? (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p>
      ) : (
        <>
          <ContractTable
            jobs={data?.jobs ?? []}
            workspaceBasePath={basePath}
            emptyMessage="No contracts in this tab. Try another bucket or publish new work."
          />
          <PaginationBar page={data?.page ?? 1} totalPages={data?.totalPages ?? 1} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
