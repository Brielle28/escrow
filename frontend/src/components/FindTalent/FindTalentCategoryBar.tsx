import type { JobCategory } from "../../utils/MarketJobs/types";
import { categoryFilters } from "../../utils/MarketJobs/marketJobsData";
import { findTalentPageCopy } from "../../utils/FindTalent/findTalentCopy";

const chipBase =
  "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-[background-color,color,box-shadow] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:text-[0.8125rem] sm:px-3.5 sm:py-1.5";
const chipInactive = "bg-gray-100 text-gray-600 hover:bg-gray-200/90";
const chipActive = "bg-brand-500 text-white shadow-md shadow-brand-500/25";

type FindTalentCategoryBarProps = {
  category: JobCategory | "all";
  onCategoryChange: (c: JobCategory | "all") => void;
  resultCount: number;
};

export function FindTalentCategoryBar({ category, onCategoryChange, resultCount }: FindTalentCategoryBarProps) {
  const filters = categoryFilters();

  return (
    <div className="mt-10 border-b border-gray-100 pb-8">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-gray-400">{findTalentPageCopy.categoriesLabel}</p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2" role="group" aria-label="Focus filters">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => onCategoryChange(key)}
              className={`${chipBase} ${category === key ? chipActive : chipInactive}`}
            >
              {key === "all" ? findTalentPageCopy.filterAll : label}
            </button>
          ))}
        </div>
        <p className="shrink-0 text-sm font-medium tabular-nums text-gray-600">{findTalentPageCopy.resultsLabel(resultCount)}</p>
      </div>
    </div>
  );
}
