import type { RouteObject } from "react-router-dom";
import { AdminDashboardLayout } from "../layouts/dashboard/AdminDashboardLayout";
import { ClientDashboardLayout } from "../layouts/dashboard/ClientDashboardLayout";
import { FreelancerDashboardLayout } from "../layouts/dashboard/FreelancerDashboardLayout";
import { AdminLoginPage } from "../pages/admin/AdminLoginPage";
import { AdminOverviewPage } from "../pages/admin/AdminOverviewPage";
import {
  AdminActivityPage,
  AdminDisputesPage,
  AdminHelpPage,
  AdminJobWorkspacePage,
  AdminJobsPage,
  AdminSettingsPage,
} from "../pages/admin/AdminStubPages";
import { ClientContractsPage } from "../pages/dashboard/client/ClientContractsPage";
import { ClientJobWorkspacePage } from "../pages/dashboard/client/ClientJobWorkspacePage";
import { ClientOverviewPage } from "../pages/dashboard/client/ClientOverviewPage";
import {
  ClientHelpPage,
  ClientHistoryPage,
  ClientMessagesPage,
  ClientPublishPage,
  ClientSettingsPage,
} from "../pages/dashboard/client/ClientStubPages";
import { ClientTalentPage } from "../pages/dashboard/client/ClientTalentPage";
import { FreelancerContractsPage } from "../pages/dashboard/freelancer/FreelancerContractsPage";
import { FreelancerFindWorkPage } from "../pages/dashboard/freelancer/FreelancerFindWorkPage";
import { FreelancerJobWorkspacePage } from "../pages/dashboard/freelancer/FreelancerJobWorkspacePage";
import { FreelancerOverviewPage } from "../pages/dashboard/freelancer/FreelancerOverviewPage";
import {
  FreelancerApplicationsPage,
  FreelancerDisputesPage,
  FreelancerHelpPage,
  FreelancerHistoryPage,
  FreelancerMessagesPage,
  FreelancerSettingsPage,
} from "../pages/dashboard/freelancer/FreelancerStubPages";

export const clientDashboardRoute: RouteObject = {
  path: "/dashboard/client",
  element: <ClientDashboardLayout />,
  children: [
    { index: true, element: <ClientOverviewPage /> },
    { path: "contracts", element: <ClientContractsPage /> },
    { path: "contracts/new", element: <ClientPublishPage /> },
    { path: "jobs/:jobId", element: <ClientJobWorkspacePage /> },
    { path: "talent", element: <ClientTalentPage /> },
    { path: "messages", element: <ClientMessagesPage /> },
    { path: "history", element: <ClientHistoryPage /> },
    { path: "help", element: <ClientHelpPage /> },
    { path: "settings", element: <ClientSettingsPage /> },
  ],
};

export const freelancerDashboardRoute: RouteObject = {
  path: "/dashboard/freelancer",
  element: <FreelancerDashboardLayout />,
  children: [
    { index: true, element: <FreelancerOverviewPage /> },
    { path: "contracts", element: <FreelancerContractsPage /> },
    { path: "jobs", element: <FreelancerFindWorkPage /> },
    { path: "jobs/:jobId", element: <FreelancerJobWorkspacePage /> },
    { path: "applications", element: <FreelancerApplicationsPage /> },
    { path: "messages", element: <FreelancerMessagesPage /> },
    { path: "disputes", element: <FreelancerDisputesPage /> },
    { path: "history", element: <FreelancerHistoryPage /> },
    { path: "help", element: <FreelancerHelpPage /> },
    { path: "settings", element: <FreelancerSettingsPage /> },
  ],
};

export const adminDashboardRoutes: RouteObject[] = [
  { path: "/admin/login", element: <AdminLoginPage /> },
  {
    path: "/admin",
    element: <AdminDashboardLayout />,
    children: [
      { index: true, element: <AdminOverviewPage /> },
      { path: "disputes", element: <AdminDisputesPage /> },
      { path: "jobs", element: <AdminJobsPage /> },
      { path: "jobs/:jobId", element: <AdminJobWorkspacePage /> },
      { path: "activity", element: <AdminActivityPage /> },
      { path: "help", element: <AdminHelpPage /> },
      { path: "settings", element: <AdminSettingsPage /> },
    ],
  },
];
