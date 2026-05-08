import { ConnectWallet } from "../components/ConnectWallet";
import { LandingLayout } from "../layouts/LandingLayout";

const networkLabel =
  import.meta.env.VITE_CKB_NETWORK === "mainnet" ? "CKB Mainnet" : "CKB Testnet";

export function LandingPage() {
  return (
    <LandingLayout>
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-12">
        <section aria-labelledby="landing-hero-title">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-brand-500">
            Trust-first freelancing
          </p>
          <h1
            className="mb-4 max-w-[18ch] text-[clamp(2rem,4vw,2.75rem)] font-bold leading-tight tracking-tight text-gray-900"
            id="landing-hero-title"
          >
            Pay with confidence. Ship with clarity.
          </h1>
          <p className="m-0 max-w-[52ch] text-[1.0625rem] leading-relaxed text-gray-500">
            Escrow holds funds until work is delivered and approved — or resolved through a fair{" "}
            <strong className="font-semibold text-gray-700">dispute and timeout</strong> path you can verify on-chain.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ConnectWallet />
            <button
              type="button"
              className="inline-flex cursor-not-allowed items-center rounded-lg border border-gray-200 bg-white px-[1.15rem] py-2 text-[0.9375rem] font-semibold text-gray-600 opacity-55"
              disabled
              title="Opening soon"
            >
              Browse jobs
            </button>
          </div>
        </section>

        <section
          className="mt-12 rounded-[0.65rem] border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-500"
          aria-label="Network"
        >
          <strong className="font-semibold text-gray-900">Network · </strong>
          This build targets <strong className="font-semibold text-gray-900">{networkLabel}</strong>. Transactions must
          be signed on the matching network.
        </section>
      </div>
    </LandingLayout>
  );
}
