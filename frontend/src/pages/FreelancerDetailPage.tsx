import { useParams } from "react-router-dom";
import { FreelancerDetailView } from "../components/FindTalent/FreelancerDetailView";
import { FreelancerNotFound } from "../components/FindTalent/FreelancerNotFound";
import { MinimalLayout } from "../layouts/MinimalLayout";
import { getMarketFreelancerById } from "../utils/FindTalent/talentData";

export function FreelancerDetailPage() {
  const { freelancerId } = useParams<{ freelancerId: string }>();
  const freelancer = freelancerId ? getMarketFreelancerById(freelancerId) : undefined;

  return (
    <MinimalLayout>
      {freelancer ? (
        <div className=" bg-white text-gray-900">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
            <FreelancerDetailView freelancer={freelancer} />
          </div>
        </div>
      ) : (
        <div className="border-b border-gray-100 bg-white">
          <div className="mx-auto max-w-7xl px-6 pt-10 sm:pt-12 lg:pt-14">
            <FreelancerNotFound />
          </div>
        </div>
      )}
    </MinimalLayout>
  );
}
