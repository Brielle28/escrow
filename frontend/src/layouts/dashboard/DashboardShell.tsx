import { Outlet } from "react-router-dom";
import { DashboardHeader } from "../../components/dashboard/header/DashboardHeader";
import { DashboardSidebar } from "../../components/dashboard/sidebar/DashboardSidebar";
import type { DashboardNavItem } from "../../config/dashboardNav";

type DashboardShellProps = {
  roleLabel: string;
  address?: string;
  navItems: DashboardNavItem[];
  footerItems: DashboardNavItem[];
  showSwitchRole?: boolean;
  onSignOut: () => void;
};

export function DashboardShell({
  roleLabel,
  address,
  navItems,
  footerItems,
  showSwitchRole,
  onSignOut,
}: DashboardShellProps) {
  return (
    <div className="dashboard-canvas flex min-h-screen">
      <DashboardSidebar
        items={navItems}
        footerItems={footerItems}
        showSwitchRole={showSwitchRole}
        onSignOut={onSignOut}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader roleLabel={roleLabel} address={address} />
        <main className="flex-1 overflow-auto px-6 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
