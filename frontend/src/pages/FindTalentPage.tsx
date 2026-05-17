import { FindTalentListing } from "../components/FindTalent/FindTalentListing";
import { LandingLayout } from "../layouts/LandingLayout";

export function FindTalentPage() {
  return (
    <LandingLayout>
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-10 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-14">
          <FindTalentListing />
        </div>
      </div>
    </LandingLayout>
  );
}
