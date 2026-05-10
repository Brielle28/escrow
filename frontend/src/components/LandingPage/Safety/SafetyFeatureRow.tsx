import { CheckCircle2 } from "lucide-react";

type SafetyFeatureRowProps = {
  title: string;
  body: string;
};

function SafetyFeatureRow({ title, body }: SafetyFeatureRowProps) {
  return (
    <div className="flex gap-4">
      <div className="flex shrink-0 pt-0.5">
        <CheckCircle2 className="size-7 text-brand-500" strokeWidth={2} aria-hidden />
      </div>
      <div className="min-w-0">
        <h3 className="text-base font-bold leading-snug text-white">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-white/70">{body}</p>
      </div>
    </div>
  );
}

export default SafetyFeatureRow;
