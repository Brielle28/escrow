import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { ConnectWalletPage } from "./pages/ConnectWalletPage";
import { DashboardClientPage } from "./pages/DashboardClientPage";
import { DashboardFreelancerPage } from "./pages/DashboardFreelancerPage";
import { JobDetailPage } from "./pages/JobDetailPage";
import { MarketJobsPage } from "./pages/MarketJobsPage";
import { FindTalentPage } from "./pages/FindTalentPage";
import { FreelancerDetailPage } from "./pages/FreelancerDetailPage";
import { ContactPage } from "./pages/ContactPage";
import { HowToHirePage } from "./pages/HowToHirePage";
import { DirectContractsPage } from "./pages/DirectContractsPage";
import { FreelancerResourcesPage } from "./pages/FreelancerResourcesPage";
import { HelpCenterPage } from "./pages/HelpCenterPage";
import { TrustSafetyPage } from "./pages/TrustSafetyPage";
import { BlogPage } from "./pages/BlogPage";
import { AboutPage } from "./pages/AboutPage";
import { TermsPage } from "./pages/TermsPage";
import { PrivacyPage } from "./pages/PrivacyPage";

const routing = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/connects",
    element: <ConnectWalletPage />,
  },
  {
    path: "/contact",
    element: <ContactPage />,
  },
  {
    path: "/how-to-hire",
    element: <HowToHirePage />,
  },
  {
    path: "/direct-contracts",
    element: <DirectContractsPage />,
  },
  {
    path: "/freelancer-resources",
    element: <FreelancerResourcesPage />,
  },
  {
    path: "/help",
    element: <HelpCenterPage />,
  },
  {
    path: "/trust-and-safety",
    element: <TrustSafetyPage />,
  },
  {
    path: "/blog",
    element: <BlogPage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/terms",
    element: <TermsPage />,
  },
  {
    path: "/privacy",
    element: <PrivacyPage />,
  },
  {
    path: "/jobs",
    element: <MarketJobsPage />,
  },
  {
    path: "/talent",
    element: <FindTalentPage />,
  },
  {
    path: "/talent/:freelancerId",
    element: <FreelancerDetailPage />,
  },
  {
    path: "/jobs/:jobId",
    element: <JobDetailPage />,
  },
  {
    path: "/dashboard/client",
    element: <DashboardClientPage />,
  },
  {
    path: "/dashboard/freelancer",
    element: <DashboardFreelancerPage />,
  },
]);

const AppRouter = () => {
  return (
    <>
      <RouterProvider router={routing} />
    </>
  );
};

export default AppRouter;
