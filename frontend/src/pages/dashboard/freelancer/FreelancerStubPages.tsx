import { DashboardPlaceholder } from "../../../components/dashboard/shared/DashboardPlaceholder";

export function FreelancerApplicationsPage() {
  return <DashboardPlaceholder title="Applications" description="Jobs you have applied to and their status." />;
}

export function FreelancerMessagesPage() {
  return <DashboardPlaceholder title="Messages" description="Per-contract threads (Plan B)." />;
}

export function FreelancerDisputesPage() {
  return <DashboardPlaceholder title="Disputes" description="Disputes involving your contracts." />;
}

export function FreelancerHistoryPage() {
  return <DashboardPlaceholder title="History" description="Transaction and lifecycle history." />;
}

export function FreelancerHelpPage() {
  return <DashboardPlaceholder title="Help & support" description="Guides for freelancers on CKB escrow." />;
}

export function FreelancerSettingsPage() {
  return <DashboardPlaceholder title="Settings" description="Profile and wallet settings." />;
}
