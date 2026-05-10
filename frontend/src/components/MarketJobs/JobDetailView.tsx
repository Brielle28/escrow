import { ArrowLeft, Clock3, Layers, Shield, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import type { MarketJob } from "../../utils/MarketJobs/types";
import { formatBudgetRange, formatPostedRelative } from "../../utils/MarketJobs/marketJobsData";
import { jobDetailCopy } from "../../utils/MarketJobs/marketJobsCopy";

type JobDetailViewProps = {
  job: MarketJob;
};

export function JobDetailView({ job }: JobDetailViewProps) {
  return (
    <div className="pb-16 lg:pb-24">
      <Link
        to="/jobs"
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
      >
        <ArrowLeft className="size-4" strokeWidth={2} aria-hidden />
        {jobDetailCopy.backToMarket}
      </Link>

      <div className="mt-8 lg:mt-10 lg:grid lg:grid-cols-[1fr_340px] lg:items-start lg:gap-10 xl:gap-14">
        <article className="min-w-0">
          <header className="border-b border-gray-100 pb-8">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-600">{job.category}</p>
            <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{job.title}</h1>
            <p className="mt-3 text-lg text-gray-600">{job.summary}</p>
            <dl className="mt-6 flex flex-wrap gap-3 text-sm">
              <div className="rounded-xl bg-gray-50 px-3 py-2 ring-1 ring-gray-100">
                <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-gray-400">{jobDetailCopy.sectionClient}</dt>
                <dd className="font-semibold text-gray-900">{job.clientLabel}</dd>
              </div>
              <div className="rounded-xl bg-gray-50 px-3 py-2 ring-1 ring-gray-100">
                <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-gray-400">Posted</dt>
                <dd className="font-medium text-gray-800">{formatPostedRelative(job.postedAtIso)}</dd>
              </div>
            </dl>
          </header>

          <section className="mt-10" aria-labelledby="about-heading">
            <h2 id="about-heading" className="text-lg font-bold text-gray-900">
              {jobDetailCopy.sectionAbout}
            </h2>
            <div className="mt-4 max-w-none text-gray-600">
              {job.description.split("\n\n").map((para, i) => (
                <p key={i} className="mt-4 first:mt-0 text-base leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </section>

          <section className="mt-10" aria-labelledby="skills-heading">
            <h2 id="skills-heading" className="text-lg font-bold text-gray-900">
              {jobDetailCopy.sectionSkills}
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {job.skills.map((s) => (
                <li key={s}>
                  <span className="inline-flex items-center rounded-xl bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-800 ring-1 ring-brand-500/15">
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </article>

        <aside className="mt-10 lg:sticky lg:top-28 lg:mt-0">
          <div className="rounded-3xl border border-gray-200/90 bg-white p-6 shadow-[0_20px_60px_-28px_rgba(15,23,42,0.18)] ring-1 ring-black/4">
            <div className="flex items-start gap-3 rounded-2xl bg-linear-to-br from-brand-50/80 to-white p-4 ring-1 ring-brand-500/10">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white shadow-md shadow-brand-500/25">
                <Sparkles className="size-5" strokeWidth={2} aria-hidden />
              </span>
              <div>
                <p className="text-sm font-bold text-gray-900">{jobDetailCopy.ctaTitle}</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">{jobDetailCopy.ctaBody}</p>
              </div>
            </div>

            <dl className="mt-6 space-y-4">
              <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
                <dt className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <Layers className="size-4 shrink-0 text-gray-400" strokeWidth={1.75} aria-hidden />
                  {jobDetailCopy.budget}
                </dt>
                <dd className="text-right text-sm font-bold tabular-nums text-gray-900">{formatBudgetRange(job.budgetMinCkb, job.budgetMaxCkb)}</dd>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
                <dt className="text-sm font-medium text-gray-500">{jobDetailCopy.duration}</dt>
                <dd className="text-right text-sm font-semibold text-gray-900">{job.durationLabel}</dd>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
                <dt className="text-sm font-medium text-gray-500">{jobDetailCopy.experience}</dt>
                <dd className="text-right text-sm font-semibold text-gray-900">{job.experienceLevel}</dd>
              </div>
              <div className="flex items-start justify-between gap-4 pb-1">
                <dt className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <Shield className="size-4 shrink-0 text-gray-400" strokeWidth={1.75} aria-hidden />
                  {jobDetailCopy.proposals}
                </dt>
                <dd className="text-right text-sm font-semibold tabular-nums text-gray-900">{job.proposalsCount}</dd>
              </div>
              <div className="flex items-start justify-between gap-4 pt-2">
                <dt className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <Clock3 className="size-4 shrink-0 text-gray-400" strokeWidth={1.75} aria-hidden />
                  Posted
                </dt>
                <dd className="text-right text-sm font-medium text-gray-800">{formatPostedRelative(job.postedAtIso)}</dd>
              </div>
            </dl>

            <Link
              to="/connects"
              className="mt-6 flex w-full items-center justify-center rounded-2xl bg-gray-900 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-gray-900/15 transition-colors hover:bg-gray-800"
            >
              {jobDetailCopy.ctaButton}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
