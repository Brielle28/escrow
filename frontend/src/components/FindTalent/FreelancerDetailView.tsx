import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { FreelancerProfileSidebar } from "./FreelancerProfileSidebar";
import { FreelancerProfileTabs } from "./FreelancerProfileTabs";
import type { MarketFreelancer } from "../../utils/FindTalent/types";
import { freelancerDetailCopy } from "../../utils/FindTalent/findTalentCopy";

type FreelancerDetailViewProps = {
  freelancer: MarketFreelancer;
};

export function FreelancerDetailView({ freelancer }: FreelancerDetailViewProps) {
  return (
    <article className="pb-12 lg:pb-16">
      <Link
        to="/talent"
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
      >
        <ArrowLeft className="size-4" strokeWidth={2} aria-hidden />
        {freelancerDetailCopy.backToTalent}
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)] lg:items-start lg:gap-10 xl:gap-12">
        <FreelancerProfileSidebar freelancer={freelancer} />
        <FreelancerProfileTabs freelancer={freelancer} />
      </div>
    </article>
  );
}
