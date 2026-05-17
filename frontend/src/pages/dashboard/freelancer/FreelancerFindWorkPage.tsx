import { MarketJobsListing } from "../../../components/MarketJobs/MarketJobsListing";
import { DashboardPageHeader } from "../../../components/dashboard/shared/DashboardPageHeader";

export function FreelancerFindWorkPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader title="Find work" subtitle="Browse open jobs and apply with your wallet." />
      <MarketJobsListing />
    </div>
  );
}
