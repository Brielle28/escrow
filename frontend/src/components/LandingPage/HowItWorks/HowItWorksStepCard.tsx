type HowItWorksStepCardProps = {
  step: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
};

function HowItWorksStepCard({ step, title, description }: HowItWorksStepCardProps) {
  return (
    <article
      className="group flex h-full flex-col rounded-2xl border border-gray-200/90 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-black/3 transition-[border-color,box-shadow] hover:border-brand-500/35 hover:shadow-md md:p-7"
      aria-label={`Step ${step}: ${title}`}
    >
      <div className="flex items-start gap-4">
        <span
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#55b36b] text-[15px] font-bold tabular-nums text-white ring-2 ring-brand-500"
          aria-hidden
        >
          {step}
        </span>
        <div className="min-w-0 pt-0.5">
          <h3 className="text-lg font-bold leading-snug tracking-tight text-gray-900">{title}</h3>
        </div>
      </div>
      <p className="mt-4 border-t border-gray-100 pt-4 text-sm leading-relaxed text-gray-600">{description}</p>
    </article>
  );
}

export default HowItWorksStepCard;
