import { freelancerFooterNav, freelancerNavItems } from "../../config/dashboardNav";
import { RequirePartyRole } from "../../guards/RequirePartyRole";
import { useSession } from "../../providers/SessionProvider";
import { DashboardShell } from "./DashboardShell";

function FreelancerDashboardShell() {
  const { session, signOut } = useSession();
  return (
    <DashboardShell
      roleLabel="Freelancer"
      address={session?.address}
      navItems={freelancerNavItems}
      footerItems={freelancerFooterNav}
      showSwitchRole
      onSignOut={() => void signOut().then(() => { window.location.href = "/"; })}
    />
  );
}

export function FreelancerDashboardLayout() {
  return (
    <RequirePartyRole role="freelancer">
      <FreelancerDashboardShell />
    </RequirePartyRole>
  );
}
