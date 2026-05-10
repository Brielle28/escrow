import { Search, Sparkles, X } from "lucide-react";
import type { RefObject } from "react";
import type { JobCategory } from "../../utils/MarketJobs/types";
import { categoryFilters } from "../../utils/MarketJobs/marketJobsData";
import { marketJobsPageCopy } from "../../utils/MarketJobs/marketJobsCopy";
import { marketJobsHeroImage } from "../../utils/MarketJobs/marketJobsVisual";

type MarketJobsHeroBandProps = {
  query: string;
  onQueryChange: (q: string) => void;
  category: JobCategory | "all";
  onCategoryChange: (c: JobCategory | "all") => void;
  resultsAnchorRef: RefObject<HTMLElement | null>;
};

export function MarketJobsHeroBand({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  resultsAnchorRef,
}: MarketJobsHeroBandProps) {
  const selectedCategoryLabel =
    category === "all"
      ? null
      : categoryFilters().find((f) => f.key === category)?.label ?? category;

  function handleFindWork() {
    resultsAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-gray-200/60 shadow-[0_28px_90px_-36px_rgba(15,23,42,0.35)] ring-1 ring-black/5">
      <img
        src={marketJobsHeroImage.src}
        alt={marketJobsHeroImage.alt}
        className="absolute inset-0 size-full object-cover"
      />
      <div
        className="absolute inset-0 bg-linear-to-t from-black/75 via-black/45 to-black/25"
        aria-hidden
      />
      <div className="relative z-10 flex min-h-[min(520px,78vh)] flex-col justify-between px-5 pb-8 pt-10 sm:px-8 sm:pb-10 sm:pt-12 lg:min-h-[540px] lg:px-12 lg:pb-12 lg:pt-14">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-300">
            <Sparkles className="size-3.5 text-brand-400" strokeWidth={2} aria-hidden />
            {marketJobsPageCopy.heroEyebrow}
          </p>
          <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.35rem] lg:leading-[1.12]">
            {marketJobsPageCopy.heroTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-white/85 sm:text-lg">
            {marketJobsPageCopy.heroSubtitle}
          </p>
        </div>

        <div className="mt-10 w-full max-w-5xl">
          <div className="rounded-3xl bg-white p-3 shadow-[0_24px_80px_-28px_rgba(0,0,0,0.35)] ring-1 ring-gray-200/80 sm:p-4">
            {/* Integrated search row — inspired by unified job-board bars */}
            <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/40 sm:flex-row sm:items-stretch">
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
                  <span className="sr-only">Search jobs</span>
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    placeholder={marketJobsPageCopy.searchPlaceholder}
                    className="w-full min-w-0 border-0 bg-transparent py-1 text-sm font-medium text-gray-900 outline-none ring-0 placeholder:text-gray-400 focus:ring-0 sm:text-[0.9375rem]"
                  />
                </label>
              </div>

              <div className="hidden w-px shrink-0 self-stretch bg-gray-200 sm:block" aria-hidden />

              <div className="flex items-center justify-center border-t border-gray-100 bg-white px-4 py-3 sm:justify-end sm:border-t-0 sm:border-l sm:bg-gray-50/30 sm:px-5">
                <button
                  type="button"
                  onClick={handleFindWork}
                  className="w-full rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition-colors hover:bg-gray-800 sm:w-auto sm:px-5"
                >
                  {marketJobsPageCopy.findWorkButton}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
