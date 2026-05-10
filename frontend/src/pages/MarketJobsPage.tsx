import { useMemo, useRef, useState } from "react";
import { MarketJobsEmpty } from "../components/MarketJobs/MarketJobsEmpty";
import { JobCard } from "../components/MarketJobs/JobCard";
import { MarketJobsCategoryBar } from "../components/MarketJobs/MarketJobsCategoryBar";
import { MarketJobsHeroBand } from "../components/MarketJobs/MarketJobsHeroBand";
import { LandingLayout } from "../layouts/LandingLayout";
import { filterMarketJobs } from "../utils/MarketJobs/filterJobs";
import { marketJobs } from "../utils/MarketJobs/marketJobsData";
import type { JobCategory } from "../utils/MarketJobs/types";

export function MarketJobsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<JobCategory | "all">("all");
  const resultsAnchorRef = useRef<HTMLElement>(null);

  const filtered = useMemo(() => filterMarketJobs(marketJobs, query, category), [query, category]);

  function handleClearFilters() {
    setQuery("");
    setCategory("all");
  }

  return (
    <LandingLayout>
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-10 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-14">
          <MarketJobsHeroBand
            query={query}
            onQueryChange={setQuery}
            category={category}
            onCategoryChange={setCategory}
            resultsAnchorRef={resultsAnchorRef}
          />

          <MarketJobsCategoryBar category={category} onCategoryChange={setCategory} resultCount={filtered.length} />

          <section
            ref={resultsAnchorRef}
            id="job-results"
            className="scroll-mt-28"
            aria-label="Job listings"
          >
            {filtered.length === 0 ? (
              <div className="mt-10">
                <MarketJobsEmpty onClear={handleClearFilters} />
              </div>
            ) : (
              <ul className="mt-10 grid list-none gap-5 sm:grid-cols-2 sm:gap-6 lg:gap-8">
                {filtered.map((job) => (
                  <li key={job.id}>
                    <JobCard job={job} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </LandingLayout>
  );
}
