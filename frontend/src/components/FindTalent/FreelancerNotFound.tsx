import { Link } from "react-router-dom";
import { freelancerDetailCopy } from "../../utils/FindTalent/findTalentCopy";

export function FreelancerNotFound() {
  return (
    <div className="mx-auto max-w-lg pb-20 text-center">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gray-400">Talent</p>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{freelancerDetailCopy.notFoundTitle}</h1>
      <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">{freelancerDetailCopy.notFoundBody}</p>
      <Link
        to="/talent"
        className="mt-8 inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gray-900/15 transition-colors hover:bg-gray-800"
      >
        {freelancerDetailCopy.browseTalent}
      </Link>
    </div>
  );
}
