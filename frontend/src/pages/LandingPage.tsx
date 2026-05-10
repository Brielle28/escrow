// import { ConnectWallet } from "../components/ConnectWallet";
import { LandingLayout } from "../layouts/LandingLayout";
import { HeroSection } from "../components/LandingPage/HeroSection/HeroSection";
import { HowItWorks } from "../components/LandingPage/HowItWorks/HowItWorks";
import { ReadyToWorkSection } from "../components/LandingPage/ReadyToWork/ReadyToWorkSection";
import { ExploreTalent } from "../components/LandingPage/ExploreTalent/ExploreTalent";
import { TrustBar } from "../components/LandingPage/TrustBar/TrustBar";
import { Safety } from "../components/LandingPage/Safety/Safety";

// const networkLabel =
//   import.meta.env.VITE_CKB_NETWORK === "mainnet" ? "CKB Mainnet" : "CKB Testnet";

export function LandingPage() {
  return (
    <LandingLayout>
      <HeroSection />
      <TrustBar />
      <ExploreTalent />
      <Safety />
      <HowItWorks />
      <ReadyToWorkSection />
    </LandingLayout>
  );
}
