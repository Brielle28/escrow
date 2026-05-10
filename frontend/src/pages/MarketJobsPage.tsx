import { useMemo, useState } from "react";
import { MarketJobsEmpty } from "../components/MarketJobs/MarketJobsEmpty";
import { JobCard } from "../components/MarketJobs/JobCard";
import { MarketJobsHero } from "../components/MarketJobs/MarketJobsHero";
import { MarketJobsToolbar } from "../components/MarketJobs/MarketJobsToolbar";
import { LandingLayout } from "../layouts/LandingLayout";
import { filterMarketJobs } from "../utils/MarketJobs/filterJobs";
import { marketJobs } from "../utils/MarketJobs/marketJobsData";
import type { JobCategory } from "../utils/MarketJobs/types";

export function MarketJobsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<JobCategory | "all">("all");

  const filtered = useMemo(() => filterMarketJobs(marketJobs, query, category), [query, category]);

  function handleClearFilters() {
    setQuery("");
    setCategory("all");
  }

  return (
    <LandingLayout>
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-10 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-14">
          <MarketJobsHero />
          <MarketJobsToolbar
            query={query}
            onQueryChange={setQuery}
            category={category}
            onCategoryChange={setCategory}
            resultCount={filtered.length}
          />

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
        </div>
      </div>
    </LandingLayout>
  );
}
