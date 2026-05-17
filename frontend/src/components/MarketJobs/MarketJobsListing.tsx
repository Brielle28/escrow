import { useMemo, useRef, useState } from "react";
import { JobCard } from "./JobCard";
import { MarketJobsCategoryBar } from "./MarketJobsCategoryBar";
import { MarketJobsEmpty } from "./MarketJobsEmpty";
import { MarketJobsHeroBand } from "./MarketJobsHeroBand";
import { filterMarketJobs } from "../../utils/MarketJobs/filterJobs";
import { marketJobs } from "../../utils/MarketJobs/marketJobsData";
import type { JobCategory } from "../../utils/MarketJobs/types";

export function MarketJobsListing() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<JobCategory | "all">("all");
  const resultsAnchorRef = useRef<HTMLElement>(null);

  const filtered = useMemo(() => filterMarketJobs(marketJobs, query, category), [query, category]);

  return (
    <div>
      <MarketJobsHeroBand
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        resultsAnchorRef={resultsAnchorRef}
      />
      <MarketJobsCategoryBar category={category} onCategoryChange={setCategory} resultCount={filtered.length} />
      <section ref={resultsAnchorRef} id="job-results" className="mt-8 scroll-mt-28" aria-label="Job listings">
        {filtered.length === 0 ? (
          <MarketJobsEmpty onClear={() => { setQuery(""); setCategory("all"); }} />
        ) : (
          <ul className="grid list-none gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((job) => (
              <li key={job.id}>
                <JobCard job={job} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
