import type { ReactNode } from "react";
import { trustBarLogos } from "../../../utils/LandingPage/TrustBar";
import TrustLogoMark from "./TrustLogoMark";

function LogoWrap({ children }: { children: ReactNode }) {
  return (
    <div className="trust-logo flex min-h-14 min-w-42 shrink-0 snap-start items-center justify-center sm:min-w-44 md:min-h-16 md:min-w-0 md:w-full md:snap-none md:px-0">
      {children}
    </div>
  );
}

export function TrustBar() {
  return (
    <section
      className="bg-[#01121c] py-12 lg:py-14"
      aria-label="Nervos CKB ecosystem and compatible wallets"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/*
          Small screens: single horizontal row + horizontal scroll — avoids an uneven 2-2-1 grid.
          md+: five columns like desktop.
        */}
        <div className="-mx-6 flex snap-x snap-mandatory gap-x-4 gap-y-0 overflow-x-auto px-6 pb-2 [-ms-overflow-style:none] scrollbar-none md:mx-0 md:grid md:grid-cols-5 md:gap-x-3 md:gap-y-0 md:overflow-visible md:px-0 md:pb-0 lg:gap-x-5">
          {trustBarLogos.map((entry) => (
            <LogoWrap key={entry.id}>
              <TrustLogoMark entry={entry} />
            </LogoWrap>
          ))}
        </div>
      </div>
    </section>
  );
}
