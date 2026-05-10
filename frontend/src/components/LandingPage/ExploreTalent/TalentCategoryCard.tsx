import type { LucideIcon } from "lucide-react";

type TalentCategoryCardProps = {
  title: string;
  freelancersLabel: string;
  icon: LucideIcon;
  highlighted?: boolean;
};

function TalentCategoryCard({ title, freelancersLabel, icon: Icon, highlighted }: TalentCategoryCardProps) {
  return (
    <article
      className={`flex flex-col rounded-xl bg-white p-4 shadow-sm transition-shadow sm:p-5 ${
        highlighted
          ? "border border-gray-200 shadow-md"
          : "border border-transparent hover:border-gray-100 hover:shadow-md"
      }`}
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-500 sm:size-10">
        <Icon className="size-[18px] sm:size-5" strokeWidth={1.75} aria-hidden />
      </div>
      <h3 className="mt-3 text-sm font-bold leading-snug text-gray-900 sm:mt-4 sm:text-base">{title}</h3>
      <p
        className={`mt-1 text-xs font-medium sm:text-sm ${highlighted ? "text-brand-500" : "text-gray-500"}`}
      >
        {freelancersLabel}
      </p>
    </article>
  );
}

export default TalentCategoryCard;
