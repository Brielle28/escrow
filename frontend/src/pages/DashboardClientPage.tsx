import { Link } from "react-router-dom";
import { RequireWalletSession } from "../components/RequireWalletSession";
import { LandingLayout } from "../layouts/LandingLayout";
import { loadWalletSession } from "../utils/auth/session";
import { truncateAddress } from "../utils/truncateAddress";

export function DashboardClientPage() {
  const session = loadWalletSession();

  return (
    <LandingLayout>
      <RequireWalletSession role="client">
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">Client</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="mt-3 text-gray-600">
          You&apos;re signed in as a <strong className="text-gray-900">Client</strong>
          {session ? (
            <>
              {" "}
              · <span className="font-mono text-sm">{truncateAddress(session.address, 12, 10)}</span>
            </>
          ) : null}
          .
        </p>
        <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          This screen is a placeholder. Wire job posting and escrow flows here next.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/connects?switch=1"
            className="inline-flex rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            Switch role / reconnect
          </Link>
          <Link to="/" className="inline-flex rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600">
            Home
          </Link>
        </div>
      </section>
      </RequireWalletSession>
    </LandingLayout>
  );
}
