import { Link } from "react-router-dom";
import { jobDetailCopy } from "../../utils/MarketJobs/marketJobsCopy";

export function JobNotFound() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-200 bg-gray-50/80 px-6 py-20 text-center">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-gray-400">404</p>
      <h1 className="mt-3 text-2xl font-bold text-gray-900">{jobDetailCopy.notFoundTitle}</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-600">{jobDetailCopy.notFoundBody}</p>
      <Link
        to="/jobs"
        className="mt-8 inline-flex items-center justify-center rounded-2xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-colors hover:bg-brand-600"
      >
        {jobDetailCopy.openRoles}
      </Link>
    </div>
  );
}
