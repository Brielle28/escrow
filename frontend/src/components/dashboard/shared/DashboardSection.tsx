import type { ReactNode } from "react";

type DashboardSectionProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
};

export function DashboardSection({ title, action, children }: DashboardSectionProps) {
  return (
    <section className="dashboard-card overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-6 py-4">
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
        {action}
      </div>
      <div className="p-2 sm:p-0">{children}</div>
    </section>
  );
}
