import { Link, useParams } from "react-router-dom";
import { DashboardPageHeader } from "../../../components/dashboard/shared/DashboardPageHeader";

export function FreelancerJobWorkspacePage() {
  const { jobId } = useParams<{ jobId: string }>();
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Contract workspace"
        subtitle={`Job ${jobId ?? ""}`}
        actions={
          <Link to="/dashboard/freelancer/contracts" className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50">
            ← Back
          </Link>
        }
      />
      <div className="rounded-3xl border border-dashed border-brand-200 bg-brand-50/50 p-10 text-center text-sm text-brand-900">
        Workspace (Plan A) loads here.
      </div>
    </div>
  );
}
