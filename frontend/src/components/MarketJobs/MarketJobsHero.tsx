import { Sparkles } from "lucide-react";
import { marketJobsPageCopy } from "../../utils/MarketJobs/marketJobsCopy";

export function MarketJobsHero() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200/80 bg-linear-to-br from-brand-50/50 via-white to-gray-50/90 px-6 py-10 shadow-[0_24px_80px_-32px_rgba(85,179,107,0.35)] ring-1 ring-black/[0.04] sm:px-10 sm:py-12 lg:px-14 lg:py-14">
      <div
        className="pointer-events-none absolute -right-16 -top-24 size-[280px] rounded-full bg-brand-500/10 blur-3xl sm:size-[360px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 left-1/3 size-[220px] rounded-full bg-emerald-400/10 blur-3xl"
        aria-hidden
      />
      <div className="relative max-w-3xl">
        <p className="inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-600">
          <Sparkles className="size-3.5" strokeWidth={2} aria-hidden />
          {marketJobsPageCopy.heroEyebrow}
        </p>
        <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-[2.35rem] lg:leading-[1.12]">
          {marketJobsPageCopy.heroTitle}
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-gray-600 sm:text-lg">{marketJobsPageCopy.heroSubtitle}</p>
      </div>
    </div>
  );
}
