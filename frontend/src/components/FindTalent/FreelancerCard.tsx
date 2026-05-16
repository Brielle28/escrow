import { ArrowUpRight, MapPin, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import { FreelancerAvatar } from "./FreelancerAvatar";
import type { MarketFreelancer } from "../../utils/FindTalent/types";
import { formatHourlyRange } from "../../utils/FindTalent/talentData";

type FreelancerCardProps = {
  freelancer: MarketFreelancer;
};

export function FreelancerCard({ freelancer }: FreelancerCardProps) {
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-gray-200/90 bg-white p-5 shadow-[0_2px_24px_-12px_rgba(15,23,42,0.15)] ring-1 ring-black/3 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-brand-500/25 hover:shadow-[0_18px_50px_-20px_rgba(85,179,107,0.35)] sm:p-6">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <FreelancerAvatar src={freelancer.avatarSrc} alt="" size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-600">{freelancer.category}</p>
          <h2 className="mt-1.5 text-lg font-bold leading-snug tracking-tight text-gray-900 transition-colors group-hover:text-brand-600 sm:text-xl">
            <Link
              to={`/talent/${freelancer.id}`}
              className="focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              <span className="absolute inset-0 rounded-2xl" aria-hidden />
              {freelancer.displayName}
            </Link>
          </h2>
          <p className="mt-1 text-sm font-semibold text-gray-800">{freelancer.headline}</p>
        </div>
        <span
          className="relative z-10 inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-gray-500 transition-colors group-hover:border-brand-500/20 group-hover:bg-brand-50 group-hover:text-brand-600"
          aria-hidden
        >
          <ArrowUpRight className="size-5" strokeWidth={1.75} />
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-gray-600">{freelancer.summary}</p>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <div className="rounded-xl bg-gray-50/90 px-3 py-2 ring-1 ring-gray-100">
          <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-gray-400">Rate</dt>
          <dd className="mt-0.5 font-semibold tabular-nums text-gray-900">{formatHourlyRange(freelancer.hourlyMinCkb, freelancer.hourlyMaxCkb)}</dd>
        </div>
        <div className="rounded-xl bg-gray-50/90 px-3 py-2 ring-1 ring-gray-100">
          <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-gray-400">Experience</dt>
          <dd className="mt-0.5 font-medium text-gray-800">{freelancer.experienceLevel}</dd>
        </div>
        <div className="col-span-2 flex items-center gap-2 rounded-xl bg-gray-50/90 px-3 py-2 ring-1 ring-gray-100 sm:col-span-1">
          <MapPin className="size-4 shrink-0 text-gray-400" strokeWidth={1.75} aria-hidden />
          <div className="min-w-0">
            <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-gray-400">Location</dt>
            <dd className="truncate font-medium text-gray-800">{freelancer.locationLabel}</dd>
          </div>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-2">
        {freelancer.skills.slice(0, 4).map((s) => (
          <span
            key={s}
            className="rounded-lg bg-brand-50/80 px-2.5 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-500/15"
          >
            {s}
          </span>
        ))}
        {freelancer.skills.length > 4 ? (
          <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">+{freelancer.skills.length - 4}</span>
        ) : null}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
        <p className="flex items-center gap-1.5 text-xs text-gray-500">
          <Timer className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
          {freelancer.responseTimeLabel}
        </p>
        <p className="text-xs font-medium text-gray-500">
          {freelancer.jobsCompleted} job{freelancer.jobsCompleted === 1 ? "" : "s"} · {freelancer.successScore}% success
        </p>
      </div>
    </article>
  );
}
