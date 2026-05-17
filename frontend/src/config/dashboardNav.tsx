import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  CircleHelp,
  FileText,
  Gavel,
  History,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
  Users,
} from "lucide-react";

export type DashboardNavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
};

export const clientNavItems: DashboardNavItem[] = [
  { label: "Overview", to: "/dashboard/client", icon: LayoutDashboard, end: true },
  { label: "Contracts", to: "/dashboard/client/contracts", icon: FileText },
  { label: "Find talent", to: "/dashboard/client/talent", icon: Users },
  { label: "Messages", to: "/dashboard/client/messages", icon: MessageSquare },
  { label: "History", to: "/dashboard/client/history", icon: History },
  { label: "Help", to: "/dashboard/client/help", icon: CircleHelp },
];

export const freelancerNavItems: DashboardNavItem[] = [
  { label: "Overview", to: "/dashboard/freelancer", icon: LayoutDashboard, end: true },
  { label: "My contracts", to: "/dashboard/freelancer/contracts", icon: Briefcase },
  { label: "Find work", to: "/dashboard/freelancer/jobs", icon: Search },
  { label: "Applications", to: "/dashboard/freelancer/applications", icon: FileText },
  { label: "Messages", to: "/dashboard/freelancer/messages", icon: MessageSquare },
  { label: "Disputes", to: "/dashboard/freelancer/disputes", icon: Gavel },
  { label: "History", to: "/dashboard/freelancer/history", icon: History },
  { label: "Help", to: "/dashboard/freelancer/help", icon: CircleHelp },
];

export const adminNavItems: DashboardNavItem[] = [
  { label: "Overview", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Disputes", to: "/admin/disputes", icon: Gavel },
  { label: "All contracts", to: "/admin/jobs", icon: Briefcase },
  { label: "Activity log", to: "/admin/activity", icon: History },
  { label: "Help", to: "/admin/help", icon: CircleHelp },
];

export const clientFooterNav: DashboardNavItem[] = [
  { label: "Settings", to: "/dashboard/client/settings", icon: Settings },
];

export const freelancerFooterNav: DashboardNavItem[] = [
  { label: "Settings", to: "/dashboard/freelancer/settings", icon: Settings },
];

export const adminFooterNav: DashboardNavItem[] = [
  { label: "Settings", to: "/admin/settings", icon: Settings },
];
