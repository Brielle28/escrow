import { FolderSearch } from "lucide-react";
import { marketJobsPageCopy } from "../../utils/MarketJobs/marketJobsCopy";

type MarketJobsEmptyProps = {
  onClear: () => void;
};

export function MarketJobsEmpty({ onClear }: MarketJobsEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50/60 px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-white shadow-md shadow-gray-900/5 ring-1 ring-gray-100">
        <FolderSearch className="size-7 text-brand-500" strokeWidth={1.5} aria-hidden />
      </span>
      <h2 className="mt-5 text-lg font-bold text-gray-900">{marketJobsPageCopy.emptyTitle}</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-600">{marketJobsPageCopy.emptyBody}</p>
      <button
        type="button"
        onClick={onClear}
        className="mt-6 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gray-900/15 transition-colors hover:bg-gray-800"
      >
        {marketJobsPageCopy.clearFilters}
      </button>
    </div>
  );
}
