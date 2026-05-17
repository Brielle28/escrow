import type { LucideIcon } from "lucide-react";
import { KpiCard } from "./KpiCard";

export type KpiItem = {
  label: string;
  value: number | string;
  hint?: string;
  icon: LucideIcon;
  featured?: boolean;
};

type KpiStripProps = {
  items: KpiItem[];
  columns?: 3 | 4;
};

const columnClass: Record<3 | 4, string> = {
  3: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
};

export function KpiStrip({ items, columns = 4 }: KpiStripProps) {
  return (
    <div className={columnClass[columns]}>
      {items.map((item) => (
        <KpiCard key={item.label} {...item} />
      ))}
    </div>
  );
}
