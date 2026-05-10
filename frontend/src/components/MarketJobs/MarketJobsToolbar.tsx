import { Search } from "lucide-react";
import type { JobCategory } from "../../utils/MarketJobs/types";
import { categoryFilters } from "../../utils/MarketJobs/marketJobsData";
import { marketJobsPageCopy } from "../../utils/MarketJobs/marketJobsCopy";

type MarketJobsToolbarProps = {
  query: string;
  onQueryChange: (q: string) => void;
  category: JobCategory | "all";
  onCategoryChange: (c: JobCategory | "all") => void;
  resultCount: number;
};

const chipBase =
  "rounded-full px-3.5 py-1.5 text-sm font-medium transition-[background-color,color,box-shadow] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";
const chipInactive = "bg-gray-100 text-gray-600 hover:bg-gray-200/90";
const chipActive = "bg-brand-500 text-white shadow-md shadow-brand-500/25";

export function MarketJobsToolbar({ query, onQueryChange, category, onCategoryChange, resultCount }: MarketJobsToolbarProps) {
  const filters = categoryFilters();

  return (
    <div className="mt-8 flex flex-col gap-5 lg:mt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block min-w-0 flex-1 sm:max-w-md lg:max-w-lg">
          <span className="sr-only">Search jobs</span>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400"
            strokeWidth={2}
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={marketJobsPageCopy.searchPlaceholder}
            className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-gray-900 shadow-sm shadow-gray-900/5 ring-1 ring-black/[0.03] placeholder:text-gray-400 focus:border-brand-500/40 focus:outline-none focus:ring-2 focus:ring-brand-500/25"
          />
        </label>
        <p className="shrink-0 text-sm font-medium tabular-nums text-gray-500 sm:text-right">{marketJobsPageCopy.resultsLabel(resultCount)}</p>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Category filters">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onCategoryChange(key)}
            className={`${chipBase} ${category === key ? chipActive : chipInactive}`}
          >
            {key === "all" ? marketJobsPageCopy.filterAll : label}
          </button>
        ))}
      </div>
    </div>
  );
}
