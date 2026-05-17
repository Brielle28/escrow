import { DashboardPlaceholder } from "../../components/dashboard/shared/DashboardPlaceholder";

export function AdminDisputesPage() {
  return <DashboardPlaceholder title="Disputes inbox" description="Paginated moderator queue (Plan D)." />;
}

export function AdminJobsPage() {
  return <DashboardPlaceholder title="All contracts" description="Read-only inspector for every job." />;
}

export function AdminActivityPage() {
  return <DashboardPlaceholder title="Activity log" description="Audit trail of admin actions." />;
}

export function AdminHelpPage() {
  return <DashboardPlaceholder title="Moderator help" description="Playbook for dispute resolution." />;
}

export function AdminSettingsPage() {
  return <DashboardPlaceholder title="Admin settings" description="Connected wallet and sign out." />;
}

export function AdminJobWorkspacePage() {
  return <DashboardPlaceholder title="Job workspace (read-only)" description="Plan A admin view with banner." />;
}
