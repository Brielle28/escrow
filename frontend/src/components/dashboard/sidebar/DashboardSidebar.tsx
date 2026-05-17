import { Link, NavLink, useNavigate } from "react-router-dom";
import { EscrowLogo } from "../../EscrowLogo";
import type { DashboardNavItem } from "../../../config/dashboardNav";
import { useSession } from "../../../providers/SessionProvider";
import { beginRoleSwitch } from "../../../utils/wallet/switchRole";
import { ArrowLeftRight, LogOut } from "lucide-react";

type DashboardSidebarProps = {
  items: DashboardNavItem[];
  footerItems: DashboardNavItem[];
  onSignOut: () => void;
  showSwitchRole?: boolean;
};

function navLinkClass(isActive: boolean) {
  return [
    "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
    isActive
      ? "bg-brand-50 text-brand-700"
      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
  ].join(" ");
}

export function DashboardSidebar({
  items,
  footerItems,
  onSignOut,
  showSwitchRole,
}: DashboardSidebarProps) {
  const navigate = useNavigate();
  const { refresh } = useSession();

  function handleSwitchRole() {
    void beginRoleSwitch(navigate, refresh);
  }

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-gray-200/80 bg-white">
      <Link
        to="/"
        className="inline-flex px-6 py-7 no-underline"
        aria-label="Escrow home"
      >
        <EscrowLogo markClassName="size-[1.65rem] -mx-0.5" />
      </Link>

      <p className="px-6 pb-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-gray-400">Menu</p>
      <nav className="flex-1 space-y-0.5 px-3" aria-label="Dashboard">
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => navLinkClass(isActive)}>
            {({ isActive }) => (
              <>
                {isActive ? (
                  <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-brand-600" />
                ) : null}
                <item.icon className="size-5 shrink-0" strokeWidth={isActive ? 2.25 : 2} aria-hidden />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <p className="px-6 pb-2 pt-5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-gray-400">General</p>
      <div className="space-y-0.5 px-3 pb-6">
        {footerItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => navLinkClass(isActive)}>
            {({ isActive }) => (
              <>
                {isActive ? (
                  <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-brand-600" />
                ) : null}
                <item.icon className="size-5" strokeWidth={2} aria-hidden />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
        {showSwitchRole ? (
          <button
            type="button"
            onClick={handleSwitchRole}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <ArrowLeftRight className="size-5" strokeWidth={2} aria-hidden />
            Switch role
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => void onSignOut()}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <LogOut className="size-5" strokeWidth={2} aria-hidden />
          Sign out
        </button>
      </div>

    </aside>
  );
}
