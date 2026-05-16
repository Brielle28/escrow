import { useMemo, useRef, useState } from "react";
import { FindTalentCategoryBar } from "../components/FindTalent/FindTalentCategoryBar";
import { FindTalentEmpty } from "../components/FindTalent/FindTalentEmpty";
import { FindTalentHeroBand } from "../components/FindTalent/FindTalentHeroBand";
import { FreelancerCard } from "../components/FindTalent/FreelancerCard";
import { LandingLayout } from "../layouts/LandingLayout";
import { filterMarketFreelancers } from "../utils/FindTalent/filterTalent";
import { marketFreelancers } from "../utils/FindTalent/talentData";
import type { JobCategory } from "../utils/MarketJobs/types";

export function FindTalentPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<JobCategory | "all">("all");
  const resultsAnchorRef = useRef<HTMLElement>(null);

  const filtered = useMemo(() => filterMarketFreelancers(marketFreelancers, query, category), [query, category]);

  function handleClearFilters() {
    setQuery("");
    setCategory("all");
  }

  return (
    <LandingLayout>
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-10 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-14">
          <FindTalentHeroBand
            query={query}
            onQueryChange={setQuery}
            category={category}
            onCategoryChange={setCategory}
            resultsAnchorRef={resultsAnchorRef}
          />

          <FindTalentCategoryBar category={category} onCategoryChange={setCategory} resultCount={filtered.length} />

          <section
            ref={resultsAnchorRef}
            id="talent-results"
            className="scroll-mt-28"
            aria-label="Freelancer profiles"
          >
            {filtered.length === 0 ? (
              <div className="mt-10">
                <FindTalentEmpty onClear={handleClearFilters} />
              </div>
            ) : (
              <ul className="mt-10 grid list-none gap-5 sm:grid-cols-2 sm:gap-6 lg:gap-8">
                {filtered.map((person) => (
                  <li key={person.id}>
                    <FreelancerCard freelancer={person} />
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
