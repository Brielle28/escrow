import type { JobStatus } from "../../../types/dashboard";
import { statusLabel, statusTone } from "../../../utils/dashboard/statusLabels";

const toneClasses = {
  brand: "bg-brand-50 text-brand-700 ring-brand-500/20",
  amber: "bg-amber-50 text-amber-800 ring-amber-500/20",
  rose: "bg-rose-50 text-rose-800 ring-rose-500/20",
  slate: "bg-gray-100 text-gray-700 ring-gray-200",
  emerald: "bg-emerald-50 text-emerald-800 ring-emerald-500/20",
} as const;

type StatusBadgeProps = {
  status: JobStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const tone = statusTone(status);
  return (
    <span
      className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${toneClasses[tone]}`}
    >
      {statusLabel(status)}
    </span>
  );
}
