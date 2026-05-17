import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

type DashboardActionLinkProps = {
  to: string;
  icon: LucideIcon;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "soft";
};

const buttonClass: Record<NonNullable<DashboardActionLinkProps["variant"]>, string> = {
  primary:
    "bg-brand-600 text-white shadow-md shadow-brand-600/30 hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
  outline:
    "border border-brand-600/35 bg-white text-brand-800 hover:border-brand-600/55 hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500",
  soft: "bg-brand-50 text-brand-800 ring-1 ring-brand-600/20 hover:bg-brand-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500",
};

export function DashboardActionLink({ to, icon: Icon, children, variant = "primary" }: DashboardActionLinkProps) {
  return (
    <Link
      to={to}
      className={[
        "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold no-underline transition-[background-color,border-color,box-shadow,color]",
        buttonClass[variant],
      ].join(" ")}
    >
      <Icon className="size-4 shrink-0 opacity-95" strokeWidth={2.25} aria-hidden />
      {children}
    </Link>
  );
}
