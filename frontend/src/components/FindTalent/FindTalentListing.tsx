import { useMemo, useRef, useState } from "react";
import { FindTalentCategoryBar } from "./FindTalentCategoryBar";
import { FindTalentEmpty } from "./FindTalentEmpty";
import { FindTalentHeroBand } from "./FindTalentHeroBand";
import { FreelancerCard } from "./FreelancerCard";
import { filterMarketFreelancers } from "../../utils/FindTalent/filterTalent";
import { marketFreelancers } from "../../utils/FindTalent/talentData";
import type { JobCategory } from "../../utils/MarketJobs/types";

export function FindTalentListing() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<JobCategory | "all">("all");
  const resultsAnchorRef = useRef<HTMLElement>(null);

  const filtered = useMemo(() => filterMarketFreelancers(marketFreelancers, query, category), [query, category]);

  return (
    <div>
      <FindTalentHeroBand
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        resultsAnchorRef={resultsAnchorRef}
      />
      <FindTalentCategoryBar category={category} onCategoryChange={setCategory} resultCount={filtered.length} />
      <section ref={resultsAnchorRef} id="talent-results" className="mt-8 scroll-mt-28" aria-label="Freelancer profiles">
        {filtered.length === 0 ? (
          <FindTalentEmpty onClear={() => { setQuery(""); setCategory("all"); }} />
        ) : (
          <ul className="grid list-none gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((person) => (
              <li key={person.id}>
                <FreelancerCard freelancer={person} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
