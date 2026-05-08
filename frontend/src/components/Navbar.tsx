import { useState } from "react";
import { Link } from "react-router-dom";
import { EscrowLogo } from "./EscrowLogo";
import { dropdownLinkClass, dropdownPanelClass, navGroups, summaryClass, textLinkClass } from "../utils/Navbar";

function ChevronDown() {
  return (
    <svg className="size-3 shrink-0 opacity-75" viewBox="0 0 12 12" aria-hidden>
      <path fill="currentColor" d="M2.5 4.5 6 8l3.5-3.5z" />
    </svg>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white font-sans shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3.5">
        <Link
          to="/"
          className="inline-flex shrink-0 items-center text-[1.375rem] font-bold tracking-tight text-gray-900 no-underline"
          aria-label="Escrow home"
        >
          <EscrowLogo />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex" aria-label="Primary">
          {navGroups.map((group) => (
            <details key={group.label} className="relative">
              <summary className={summaryClass}>
                {group.label}
                <ChevronDown />
              </summary>
              <div className={dropdownPanelClass}>
                {group.links.map((item) => (
                  <Link key={item.label} className={dropdownLinkClass} to={item.to}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>
          ))}
          <Link className={textLinkClass} to="#">
            Contact
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <Link className="rounded-md px-2.5 py-2 text-[0.9375rem] font-medium text-gray-600 no-underline hover:text-gray-900" to="#">
            Log In
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2 text-[0.9375rem] font-semibold text-white no-underline transition-colors hover:bg-brand-600"
            to="#"
          >
            Join Now
          </Link>
          <button
            type="button"
            className="inline-flex rounded-md p-2 text-gray-900 lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="navbar-drawer"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className="sr-only">Menu</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M6 18 18 6M6 6l12 12" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="navbar-drawer"
        className={`border-t border-gray-200 bg-gray-50 px-6 py-4 lg:hidden ${mobileOpen ? "block" : "hidden"}`}
      >
        {navGroups.map((group) => (
          <details key={group.label} className="relative mb-1">
            <summary className={`${summaryClass} w-full`}>
              {group.label}
              <ChevronDown />
            </summary>
            <div className="mt-1.5 rounded-lg border border-gray-200 bg-white p-2 shadow-none">
              {group.links.map((item) => (
                <Link key={item.label} className={dropdownLinkClass} to={item.to}>
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
        ))}
        <Link className={`${textLinkClass} block px-3 py-2.5`} to="#">
          Contact
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-gray-200 pt-3">
          <Link className="rounded-md px-2.5 py-2 text-[0.9375rem] font-medium text-gray-600 no-underline hover:text-gray-900" to="#">
            Log In
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2 text-[0.9375rem] font-semibold text-white no-underline hover:bg-brand-600"
            to="#"
          >
            Join Now
          </Link>
        </div>
      </div>
    </header>
  );
}
