import { useState } from "react";
import { Link } from "react-router-dom";
import { EscrowLogo } from "./EscrowLogo";
import { ConnectWallet } from "./wallet/ConnectWallet";
import { contactNav, findTalentNav, findWorkNav, textLinkClass } from "../utils/Navbar";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white font-sans shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-3.5 lg:gap-6">
        <Link
          to="/"
          className="inline-flex shrink-0 items-center text-[1.375rem] font-bold tracking-tight text-gray-900 no-underline"
          aria-label="Escrow home"
        >
          <EscrowLogo />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex" aria-label="Primary">
          <Link className={textLinkClass} to={findWorkNav.to}>
            {findWorkNav.label}
          </Link>
          <Link className={textLinkClass} to={findTalentNav.to}>
            {findTalentNav.label}
          </Link>
          <Link className={textLinkClass} to={contactNav.to}>
            {contactNav.label}
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <ConnectWallet />
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
        <Link className={`${textLinkClass} mb-1 block px-3 py-2.5`} to={findWorkNav.to}>
          {findWorkNav.label}
        </Link>
        <Link className={`${textLinkClass} mb-1 block px-3 py-2.5`} to={findTalentNav.to}>
          {findTalentNav.label}
        </Link>
        <Link className={`${textLinkClass} mb-1 block px-3 py-2.5`} to={contactNav.to}>
          {contactNav.label}
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-gray-200 pt-3">
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
}
