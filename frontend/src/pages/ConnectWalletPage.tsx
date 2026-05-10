import { Briefcase, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ccc, useCcc, useSigner } from "@ckb-ccc/connector-react";
import { LandingLayout } from "../layouts/LandingLayout";
import {
  clearWalletSession,
  establishWalletSession,
  loadWalletSession,
  type ActingRole,
} from "../utils/auth/session";
import { truncateAddress } from "../utils/truncateAddress";

const connectBtn =
  "inline-flex cursor-pointer items-center justify-center rounded-xl bg-gradient-to-b from-[#6bc77e] to-brand-500 px-8 py-3.5 text-base font-semibold text-white shadow-md shadow-brand-500/15 transition-[filter] hover:brightness-[1.03]";

function roleCardBase(selected: boolean) {
  return [
    "relative flex w-full flex-col rounded-2xl border p-6 text-left transition-[border-color,box-shadow] md:p-7",
    selected
      ? "border-brand-500 bg-brand-50/80 shadow-[0_0_0_1px_rgba(85,179,107,0.35)]"
      : "border-gray-200 bg-white hover:border-brand-500/40 hover:shadow-sm",
  ].join(" ");
}

export function ConnectWalletPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const allowRoleSwitch = searchParams.get("switch") === "1";

  const { open, wallet } = useCcc();
  const signer = useSigner();
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [selectedRole, setSelectedRole] = useState<ActingRole | null>(null);
  const [submitState, setSubmitState] = useState<"idle" | "working" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!signer) {
      setAddress("");
      setBalance("");
      return;
    }
    let cancelled = false;
    void (async () => {
      const addr = await signer.getRecommendedAddress();
      if (!cancelled) setAddress(addr);
    })();
    void (async () => {
      const capacity = await signer.getBalance();
      if (!cancelled) setBalance(ccc.fixedPointToString(capacity));
    })();
    return () => {
      cancelled = true;
    };
  }, [signer]);

  // Same wallet + valid session → skip straight to dashboard (unless switching role).
  useEffect(() => {
    if (!address || allowRoleSwitch) return;
    const session = loadWalletSession();
    if (session && session.address === address) {
      navigate(session.role === "client" ? "/dashboard/client" : "/dashboard/freelancer", { replace: true });
    }
  }, [address, allowRoleSwitch, navigate]);

  useEffect(() => {
    if (!address) {
      setSelectedRole(null);
      return;
    }
    const session = loadWalletSession();
    if (session?.address === address) {
      setSelectedRole(session.role);
    }
  }, [address]);

  async function handleContinue() {
    if (!signer || !address || !selectedRole) return;
    setSubmitState("working");
    setErrorMessage("");
    try {
      const signMessage = async (message: string): Promise<string> => {
        const candidate = signer as unknown as {
          signMessage?: (msg: string) => Promise<string>;
          sign?: (msg: string) => Promise<string>;
          signPersonalMessage?: (msg: string) => Promise<string>;
        };
        if (candidate.signMessage) return candidate.signMessage(message);
        if (candidate.signPersonalMessage) return candidate.signPersonalMessage(message);
        if (candidate.sign) return candidate.sign(message);
        throw new Error("This wallet does not support message signing.");
      };

      const existing = loadWalletSession();
      if (existing && (existing.address !== address || existing.role !== selectedRole)) {
        await clearWalletSession(existing.token);
      }

      window.localStorage.setItem("escrow.actingRole", selectedRole);
      await establishWalletSession({ address, role: selectedRole, signMessage });

      navigate(selectedRole === "client" ? "/dashboard/client" : "/dashboard/freelancer");
    } catch (e) {
      setSubmitState("error");
      setErrorMessage(e instanceof Error ? e.message : "Could not finish sign-in.");
    } finally {
      setSubmitState((prev) => (prev === "working" ? "idle" : prev));
    }
  }

  const step1Done = Boolean(wallet && signer && address);
  const canContinue = step1Done && selectedRole !== null && submitState !== "working";

  return (
    <LandingLayout>
      <section className="mx-auto w-full max-w-3xl px-6 py-14 md:py-20">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">Start your session</p>
        <h1 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          Connect &amp; choose your role
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-center text-base leading-relaxed text-gray-600">
          Connect your wallet first, then pick whether you&apos;re hiring (Client) or working (Freelancer). You&apos;ll sign
          once to confirm.
        </p>

        {/* Step 1 */}
        <div className="mt-12 rounded-2xl border border-gray-200 bg-gray-50/80 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <span
              className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                step1Done ? "bg-brand-500 text-white" : "bg-gray-200 text-gray-600"
              }`}
              aria-hidden
            >
              1
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-gray-900">Connect wallet</h2>
              <p className="mt-1 text-sm text-gray-600">
                Use JoyID, MetaMask, OKX, or another supported wallet on CKB.
              </p>
              {!wallet ? (
                <button type="button" className={`${connectBtn} mt-5`} onClick={() => open()}>
                  Connect wallet
                </button>
              ) : (
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {wallet.icon ? (
                    <img src={wallet.icon} alt="" className="size-10 shrink-0 rounded-full" width={40} height={40} />
                  ) : null}
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">{balance || "—"} CKB</p>
                    <p className="text-xs text-gray-500">{address ? truncateAddress(address, 14, 10) : "…"}</p>
                  </div>
                  <button
                    type="button"
                    className="ml-auto text-sm font-semibold text-brand-600 underline-offset-2 hover:underline"
                    onClick={() => open()}
                  >
                    Switch wallet
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className={`mt-6 rounded-2xl border border-gray-200 bg-white p-6 md:p-8 ${!step1Done ? "opacity-50" : ""}`}>
          <div className="flex items-start gap-4">
            <span
              className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                selectedRole ? "bg-brand-500 text-white" : "bg-gray-200 text-gray-600"
              }`}
              aria-hidden
            >
              2
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-gray-900">Choose your role</h2>
              <p className="mt-1 text-sm text-gray-600">This tells the app which dashboard and actions to show you.</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={!step1Done}
                  onClick={() => setSelectedRole("client")}
                  className={roleCardBase(selectedRole === "client")}
                >
                  <Briefcase className="size-9 text-brand-500" strokeWidth={1.5} aria-hidden />
                  <span className="mt-3 text-lg font-bold text-gray-900">Client</span>
                  <span className="mt-1 text-sm leading-relaxed text-gray-600">
                    Post jobs, fund escrow, and release payment when work is approved.
                  </span>
                </button>
                <button
                  type="button"
                  disabled={!step1Done}
                  onClick={() => setSelectedRole("freelancer")}
                  className={roleCardBase(selectedRole === "freelancer")}
                >
                  <Users className="size-9 text-brand-500" strokeWidth={1.5} aria-hidden />
                  <span className="mt-3 text-lg font-bold text-gray-900">Freelancer</span>
                  <span className="mt-1 text-sm leading-relaxed text-gray-600">
                    Browse jobs, apply, deliver work, and receive escrow payouts.
                  </span>
                </button>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  disabled={!canContinue}
                  onClick={() => void handleContinue()}
                  className="inline-flex items-center justify-center rounded-xl bg-brand-500 px-8 py-3.5 text-base font-semibold text-white shadow-md shadow-brand-500/20 transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {submitState === "working" ? "Signing…" : "Continue to dashboard"}
                </button>
                <Link
                  to="/"
                  className="text-center text-sm font-semibold text-gray-600 underline-offset-2 hover:text-gray-900 hover:underline sm:text-left"
                >
                  Back to home
                </Link>
              </div>
              {submitState === "error" ? (
                <p className="mt-4 text-sm font-medium text-red-600" role="alert">
                  {errorMessage}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
