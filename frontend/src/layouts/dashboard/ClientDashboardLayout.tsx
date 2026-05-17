import { clientFooterNav, clientNavItems } from "../../config/dashboardNav";
import { RequirePartyRole } from "../../guards/RequirePartyRole";
import { useSession } from "../../providers/SessionProvider";
import { DashboardShell } from "./DashboardShell";

function ClientDashboardShell() {
  const { session, signOut } = useSession();
  return (
    <DashboardShell
      roleLabel="Client"
      address={session?.address}
      navItems={clientNavItems}
      footerItems={clientFooterNav}
      showSwitchRole
      onSignOut={() => void signOut().then(() => { window.location.href = "/"; })}
    />
  );
}

export function ClientDashboardLayout() {
  return (
    <RequirePartyRole role="client">
      <ClientDashboardShell />
    </RequirePartyRole>
  );
}
