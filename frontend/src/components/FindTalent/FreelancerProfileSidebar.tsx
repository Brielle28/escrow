import { CheckCircle2, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { FreelancerAvatar } from "./FreelancerAvatar";
import type { MarketFreelancer } from "../../utils/FindTalent/types";
import { freelancerDetailCopy } from "../../utils/FindTalent/findTalentCopy";

type FreelancerProfileSidebarProps = {
  freelancer: MarketFreelancer;
};

export function FreelancerProfileSidebar({ freelancer }: FreelancerProfileSidebarProps) {
  return (
    <aside className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_2px_24px_-12px_rgba(15,23,42,0.12)] ring-1 ring-black/5 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
      <div className="relative mx-auto w-fit shrink-0">
        <FreelancerAvatar src={freelancer.avatarSrc} alt="" size="profile" tone="light" />
        {freelancer.availableNow ? (
          <span
            className="absolute bottom-1 right-1 size-4 rounded-full border-2 border-white bg-emerald-500 shadow-sm"
            title={freelancerDetailCopy.availableNow}
            aria-label={freelancerDetailCopy.availableNow}
          />
        ) : null}
      </div>

      <header className="mt-6 shrink-0 text-center">
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">{freelancer.displayName}</h1>
          {freelancer.verified ? (
            <span className="inline-flex items-center gap-0.5 text-sky-600" title={freelancerDetailCopy.verified}>
              <CheckCircle2 className="size-5 shrink-0" strokeWidth={2} aria-hidden />
              <span className="sr-only">{freelancerDetailCopy.verified}</span>
            </span>
          ) : null}
        </div>
        <p className="mx-auto mt-2.5 max-w-[280px] text-[0.9375rem] leading-snug text-gray-600">{freelancer.headline}</p>
        <p className="mx-auto mt-4 flex max-w-[280px] items-center justify-center gap-1.5 text-sm text-gray-500">
          <MapPin className="size-4 shrink-0 text-gray-400" aria-hidden />
          <span>
            {freelancer.locationLabel}
            <span className="text-gray-300"> · </span>
            {freelancer.localTimeLabel}
          </span>
        </p>
      </header>

      <section className="mt-7 shrink-0 border-t border-gray-100 pt-7 text-center" aria-label="Highlights">
        <span className="inline-flex rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-800 ring-1 ring-brand-500/20">
          {freelancer.successScore}% {freelancerDetailCopy.jobSuccess}
        </span>

        <dl className="mt-5">
          <div className="rounded-xl border border-gray-100 bg-gray-50/90 px-4 py-4">
            <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-gray-500">
              {freelancerDetailCopy.totalJobs}
            </dt>
            <dd className="mt-1.5 text-xl font-bold tabular-nums tracking-tight text-gray-900">
              {freelancer.jobsCompleted.toLocaleString()}
            </dd>
          </div>
        </dl>
      </section>

      <Link
        to="/connects"
        className="mt-8 flex w-full shrink-0 items-center justify-center rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-brand-500/25 transition-colors hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
      >
        {freelancerDetailCopy.invite}
      </Link>
    </aside>
  );
}
