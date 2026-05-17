import { FindTalentListing } from "../../../components/FindTalent/FindTalentListing";
import { DashboardPageHeader } from "../../../components/dashboard/shared/DashboardPageHeader";

export function ClientTalentPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader title="Find talent" subtitle="Discover freelancers before you publish a contract." />
      <FindTalentListing />
    </div>
  );
}
