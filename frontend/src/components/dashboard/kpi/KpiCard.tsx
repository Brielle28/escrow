import type { LucideIcon } from "lucide-react";
type KpiCardProps = {
  label: string;
  value: number | string;
  hint?: string;
  icon: LucideIcon;
  featured?: boolean;
};

export function KpiCard({ label, value, hint, icon: Icon, featured }: KpiCardProps) {
  if (featured) {
    return (
      <article className="dashboard-card-featured relative overflow-hidden p-6 text-white">
        <div className="pointer-events-none absolute -right-6 -top-6 size-28 rounded-full bg-white/10" aria-hidden />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-white/85">{label}</p>
            <p className="mt-2 text-4xl font-bold tracking-tight">{value}</p>
            {hint ? <p className="mt-2 text-xs text-white/75">{hint}</p> : null}
          </div>
          <span className="flex size-12 items-center justify-center rounded-2xl bg-white/15">
            <Icon className="size-6" strokeWidth={2} aria-hidden />
          </span>
        </div>
      </article>
    );
  }

  return (
    <article className="dashboard-card p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{value}</p>
          {hint ? <p className="mt-2 text-xs text-gray-500">{hint}</p> : null}
        </div>
        <span className="flex size-11 items-center justify-center rounded-2xl bg-gray-50 text-brand-600 ring-1 ring-gray-100">
          <Icon className="size-5" strokeWidth={2} aria-hidden />
        </span>
      </div>
    </article>
  );
}
