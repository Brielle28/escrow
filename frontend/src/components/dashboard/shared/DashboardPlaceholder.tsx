import { DashboardPageHeader } from "./DashboardPageHeader";

type DashboardPlaceholderProps = {
  title: string;
  description: string;
};

export function DashboardPlaceholder({ title, description }: DashboardPlaceholderProps) {
  return (
    <div className="space-y-6">
      <DashboardPageHeader title={title} subtitle={description} />
      <div className="dashboard-card px-8 py-16 text-center">
        <p className="text-sm text-gray-500">Coming in the next release slice.</p>
      </div>
    </div>
  );
}
