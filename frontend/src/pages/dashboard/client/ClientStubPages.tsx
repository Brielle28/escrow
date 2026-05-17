import { DashboardPlaceholder } from "../../../components/dashboard/shared/DashboardPlaceholder";

export function ClientMessagesPage() {
  return <DashboardPlaceholder title="Messages" description="Per-contract threads (Plan B)." />;
}

export function ClientHistoryPage() {
  return <DashboardPlaceholder title="History" description="On-chain activity across all contracts." />;
}

export function ClientHelpPage() {
  return <DashboardPlaceholder title="Help & support" description="FAQ and links to Trust & Safety and Contact." />;
}

export function ClientSettingsPage() {
  return <DashboardPlaceholder title="Settings" description="Profile, wallet, and network preferences." />;
}

export function ClientPublishPage() {
  return <DashboardPlaceholder title="Publish work" description="Create a new escrow contract listing (Plan C API)." />;
}
