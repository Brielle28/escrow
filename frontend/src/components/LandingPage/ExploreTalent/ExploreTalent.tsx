import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { exploreTalentCategories } from "../../../utils/LandingPage/ExploreTalent";
import { categoryIconMap } from "./categoryIconMap";
import TalentCategoryCard from "./TalentCategoryCard";

export function ExploreTalent() {
  return (
    <section className="bg-gray-50 py-16 lg:py-20" aria-labelledby="explore-talent-heading">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2
              id="explore-talent-heading"
              className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl"
            >
              Explore talent
            </h2>
            <p className="mt-2 text-base text-gray-500 md:text-lg">
              Explore services from 1400+ verified skill categories.
            </p>
          </div>
          <Link
            to="#"
            className="inline-flex shrink-0 items-center gap-1 self-start rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-brand-500 shadow-sm transition-colors hover:bg-gray-50 md:self-auto"
          >
            All Categories
            <ArrowRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {exploreTalentCategories.map((cat) => {
            const Icon = categoryIconMap[cat.iconKey];
            return (
              <TalentCategoryCard
                key={cat.iconKey}
                title={cat.title}
                freelancersLabel={cat.freelancersLabel}
                icon={Icon}
                highlighted={cat.highlighted}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
