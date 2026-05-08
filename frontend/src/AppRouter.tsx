import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";

const routing = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
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
