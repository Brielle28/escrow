import { Search, X } from "lucide-react";
import type { FormEvent, RefObject } from "react";
import type { JobCategory } from "../../utils/MarketJobs/types";
import { findTalentPageCopy } from "../../utils/FindTalent/findTalentCopy";
import { categoryFilters } from "../../utils/MarketJobs/marketJobsData";

type FindTalentHeroBandProps = {
  query: string;
  onQueryChange: (q: string) => void;
  category: JobCategory | "all";
  onCategoryChange: (c: JobCategory | "all") => void;
  resultsAnchorRef: RefObject<HTMLElement | null>;
};

export function FindTalentHeroBand({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  resultsAnchorRef,
}: FindTalentHeroBandProps) {
  const selectedCategoryLabel =
    category === "all" ? null : categoryFilters().find((f) => f.key === category)?.label ?? category;

  function scrollToResults() {
    resultsAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleSearchSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    scrollToResults();
  }

  return (
    <section className="border-b border-gray-100 pb-10" aria-labelledby="find-talent-heading">
      <h1 id="find-talent-heading" className="text-balance text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        {findTalentPageCopy.heroTitle}
      </h1>

      <form
        role="search"
        onSubmit={handleSearchSubmit}
        className="mt-6 w-full max-w-5xl"
        aria-label="Search freelancers"
      >
        <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-2 shadow-sm ring-1 ring-black/5 sm:p-3">
          <div className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white sm:flex-row sm:items-stretch">
            <div className="flex min-h-[52px] flex-1 items-center gap-2 px-4 py-3 sm:gap-3">
              <Search className="size-4 shrink-0 text-gray-400 sm:size-4.5" strokeWidth={2} aria-hidden />
              {selectedCategoryLabel ? (
                <span className="inline-flex max-w-[40vw] shrink-0 items-center gap-1 rounded-full border border-brand-500/25 bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-800 sm:max-w-56 sm:text-sm">
                  {selectedCategoryLabel}
                  <button
                    type="button"
                    onClick={() => onCategoryChange("all")}
                    className="rounded-full p-0.5 text-brand-600 transition-colors hover:bg-brand-500/15 hover:text-brand-800"
                    aria-label={`Remove ${selectedCategoryLabel} filter`}
                  >
                    <X className="size-3.5" strokeWidth={2} />
                  </button>
                </span>
              ) : null}
              <label className="min-w-0 flex-1">
                <span className="sr-only">Search freelancers</span>
                <input
                  type="search"
                  name="q"
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  placeholder={findTalentPageCopy.searchPlaceholder}
                  className="w-full min-w-0 border-0 bg-transparent py-1 text-sm font-medium text-gray-900 outline-none ring-0 placeholder:text-gray-400 focus:ring-0 sm:text-[0.9375rem]"
                  autoComplete="off"
                />
              </label>
            </div>

            <div className="hidden w-px shrink-0 self-stretch bg-gray-200 sm:block" aria-hidden />

            <div className="flex items-center justify-center border-t border-gray-100 bg-gray-50/40 px-4 py-3 sm:border-t-0 sm:border-l sm:px-5">
              <button
                type="submit"
                className="w-full rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-gray-900/15 transition-colors hover:bg-gray-800 sm:w-auto sm:px-8"
              >
                {findTalentPageCopy.searchButton}
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
