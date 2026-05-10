import { useCcc, useSigner } from "@ckb-ccc/connector-react";
import { LayoutDashboard } from "lucide-react";
import { startTransition, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { loadWalletSession } from "../../utils/auth/session";

/**
 * Primary app entry when not in the auth shell: connect, finish setup, or open dashboard.
 * Fixed position with a gentle motion so it’s noticeable without being noisy.
 */
export function FloatingAppButton() {
  const { pathname } = useLocation();
  const { wallet } = useCcc();
  const signer = useSigner();
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!signer) {
      startTransition(() => {
        setAddress("");
      });
      return;
    }
    let cancelled = false;
    void signer.getRecommendedAddress().then((addr) => {
      if (!cancelled) setAddress(addr);
    });
    return () => {
      cancelled = true;
    };
  }, [signer]);

  if (pathname === "/connects") return null;
  if (pathname.startsWith("/dashboard")) return null;

  const session = loadWalletSession();
  const sessionOk = Boolean(session && address && session.address === address);

  const to = !wallet
    ? "/connects"
    : sessionOk && session
      ? session.role === "client"
        ? "/dashboard/client"
        : "/dashboard/freelancer"
      : "/connects";

  const label = !wallet ? "Connect wallet" : sessionOk ? "Open dashboard" : "Continue setup";

  return (
    <Link
      to={to}
      className="animate-escrow-float fixed bottom-5 right-5 z-50 inline-flex items-center gap-2.5 rounded-2xl border border-brand-600/25 bg-brand-500 text-sm font-semibold text-white shadow-lg shadow-brand-500/35 transition-transform hover:scale-[1.02] hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:bottom-7 sm:right-7"
      aria-label={label}
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
        <LayoutDashboard className="size-5 text-white" strokeWidth={2} aria-hidden />
      </span>
    </Link>
  );
}
