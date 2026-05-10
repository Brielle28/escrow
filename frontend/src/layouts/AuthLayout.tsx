import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { EscrowLogo } from "../components/EscrowLogo";

type AuthLayoutProps = {
  children: ReactNode;
  /** Public URL under `public/` (file lives at `public/Auth/A1.png` → `/Auth/A1.png`). */
  imageSrc?: string;
  imageAlt?: string;
};

export function AuthLayout({
  children,
  imageSrc = "/Auth/A1.png",
  imageAlt = "Escrow on Nervos CKB — secure work and payments",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 antialiased">
      {/*
        Phone + tablet (<lg): stacked — image peek on top, form below (same rhythm).
        Laptop+ (lg): split columns + sticky image rail.
      */}
      <div
        className={[
          "grid min-h-screen grid-rows-[auto_1fr]",
          "lg:grid-cols-[minmax(280px,40%)_minmax(0,1fr)] lg:grid-rows-1",
          "xl:grid-cols-[minmax(320px,42%)_minmax(0,1fr)]",
          "2xl:grid-cols-[minmax(360px,44%)_minmax(0,1fr)]",
        ].join(" ")}
      >
        <aside
          className={[
            "relative order-1 overflow-hidden",
            "min-h-[168px] max-h-[min(40vh,260px)] sm:min-h-[188px] sm:max-h-[min(38vh,280px)]",
            "lg:sticky lg:top-0 lg:h-screen lg:min-h-screen lg:max-h-none",
          ].join(" ")}
        >
          <img
            src={imageSrc}
            alt={imageAlt}
            className="absolute inset-0 size-full object-cover object-center"
            loading="eager"
            decoding="async"
          />
          <div
            className="absolute inset-0 bg-linear-to-br from-[#0c1017]/88 via-[#0c1017]/45 to-brand-500/15"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-white/5"
            aria-hidden
          />
          <div
            className={[
              "relative flex h-full flex-col justify-end gap-3 p-5 sm:p-6 lg:absolute lg:inset-0 lg:justify-between lg:gap-2 lg:p-8 xl:p-10 2xl:p-12",
            ].join(" ")}
          >
            <p className="hidden text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-brand-400 lg:block xl:text-[0.65rem]">
              Nervos · CKB
            </p>
            <div className="max-w-xl lg:mt-auto lg:max-w-sm xl:max-w-md">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-400 lg:hidden">
                Nervos · CKB
              </p>
              {/* Laptop+: smaller type so the photo stays the hero; mobile peek stays readable */}
              <h2 className="mt-1 text-lg font-bold leading-snug text-white drop-shadow-sm sm:text-xl lg:mt-0 lg:text-lg lg:leading-snug xl:text-xl xl:leading-snug 2xl:text-2xl 2xl:leading-tight">
                Escrow that stays visible—from match to payout.
              </h2>
              <p className="mt-2 max-w-md text-xs leading-relaxed text-white/85 sm:text-sm lg:mt-1.5 lg:max-w-none lg:text-xs lg:leading-relaxed xl:text-sm">
                Funds lock on-chain until work is approved. Built for clients and freelancers using CKB.
              </p>
            </div>
          </div>
        </aside>

        <main className="order-2 flex min-h-0 flex-col bg-linear-to-b from-gray-50/95 via-white to-gray-50/90 lg:border-l lg:border-gray-200/80">
          <div
            className={[
              "mx-auto flex w-full flex-1 flex-col justify-center",
              "px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14 xl:px-14 xl:py-16 2xl:px-16",
              "max-w-full lg:max-w-none xl:max-w-3xl 2xl:max-w-4xl",
            ].join(" ")}
          >
            {/* Light chrome on small/tablet; full wordmark from laptop up */}
            <Link
              to="/"
              className="mb-6 inline-flex w-fit items-center rounded-lg text-sm font-semibold text-gray-500 outline-offset-4 transition-colors hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-brand-500 lg:hidden"
              aria-label="Back to home"
            >
              ← Home
            </Link>
            <Link
              to="/"
              className="mb-8 hidden w-fit items-center gap-2 rounded-lg text-gray-600 outline-offset-4 transition-colors hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-brand-500 lg:mb-9 lg:inline-flex"
              aria-label="Escrow home"
            >
              <EscrowLogo />
            </Link>
            <div className="w-full min-w-0">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
