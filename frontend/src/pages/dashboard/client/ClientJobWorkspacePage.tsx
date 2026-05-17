import { Link, useParams } from "react-router-dom";
import { DashboardPageHeader } from "../../../components/dashboard/shared/DashboardPageHeader";

export function ClientJobWorkspacePage() {
  const { jobId } = useParams<{ jobId: string }>();

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Contract workspace"
        subtitle={`Job ${jobId ?? ""} — Plan A workspace UI loads here.`}
        actions={
          <Link
            to="/dashboard/client/contracts"
            className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            ← Back to contracts
          </Link>
        }
      />
      <div className="rounded-3xl border border-dashed border-brand-200 bg-brand-50/50 p-10 text-center text-sm text-brand-900">
        Timeline, milestones, chat, and action panel ship with Plan A.
      </div>
    </div>
  );
}
