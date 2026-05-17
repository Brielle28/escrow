import { adminFooterNav, adminNavItems } from "../../config/dashboardNav";
import { RequireAdminSession } from "../../guards/RequireAdminSession";
import { useAdminSession } from "../../providers/AdminSessionProvider";
import { DashboardShell } from "./DashboardShell";

function AdminDashboardShell() {
  const { session, signOut } = useAdminSession();
  return (
    <DashboardShell
      roleLabel="Admin"
      address={session?.address}
      navItems={adminNavItems}
      footerItems={adminFooterNav}
      onSignOut={() => void signOut().then(() => { window.location.href = "/admin/login"; })}
    />
  );
}

export function AdminDashboardLayout() {
  return (
    <RequireAdminSession>
      <AdminDashboardShell />
    </RequireAdminSession>
  );
}
