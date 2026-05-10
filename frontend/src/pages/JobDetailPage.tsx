import { useParams } from "react-router-dom";
import { JobDetailView } from "../components/MarketJobs/JobDetailView";
import { JobNotFound } from "../components/MarketJobs/JobNotFound";
import { LandingLayout } from "../layouts/LandingLayout";
import { getMarketJobById } from "../utils/MarketJobs/marketJobsData";

export function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const job = jobId ? getMarketJobById(jobId) : undefined;

  return (
    <LandingLayout>
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 pt-10 sm:pt-12 lg:pt-14">
          {job ? <JobDetailView job={job} /> : <JobNotFound />}
        </div>
      </div>
    </LandingLayout>
  );
}
