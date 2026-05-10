import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { ConnectWalletPage } from "./pages/ConnectWalletPage";
import { DashboardClientPage } from "./pages/DashboardClientPage";
import { DashboardFreelancerPage } from "./pages/DashboardFreelancerPage";
import { JobDetailPage } from "./pages/JobDetailPage";
import { MarketJobsPage } from "./pages/MarketJobsPage";

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
    path: "/jobs",
    element: <MarketJobsPage />,
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
