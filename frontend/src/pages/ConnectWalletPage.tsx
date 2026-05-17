import { ccc, useCcc, useSigner } from "@ckb-ccc/connector-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ConnectWalletIntro } from "../components/wallet/ConnectFlow/ConnectWalletIntro";
import { RoleSelectionStep } from "../components/wallet/ConnectFlow/RoleSelectionStep";
import { WalletConnectionStep } from "../components/wallet/ConnectFlow/WalletConnectionStep";
import { AuthLayout } from "../layouts/AuthLayout";
import { useSession } from "../providers/SessionProvider";
import {
  clearWalletSession,
  establishWalletSession,
  loadWalletSession,
  type ActingRole,
} from "../utils/auth/session";
import { signMessageWithSigner } from "../utils/wallet/signMessage";

export function ConnectWalletPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const allowRoleSwitch = searchParams.get("switch") === "1";
  const { refresh: refreshSession } = useSession();

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

  useEffect(() => {
    if (!address || allowRoleSwitch) return;
    const session = loadWalletSession();
    if (session && session.address === address) {
      navigate(session.role === "client" ? "/dashboard/client" : "/dashboard/freelancer", { replace: true });
    }
  }, [address, allowRoleSwitch, navigate]);

  useEffect(() => {
    if (!allowRoleSwitch) return;
    let cancelled = false;
    void (async () => {
      const existing = loadWalletSession();
      if (existing?.token) {
        await clearWalletSession(existing.token);
      }
      refreshSession();
      if (!cancelled) {
        setSelectedRole(null);
        setSubmitState("idle");
        setErrorMessage("");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [allowRoleSwitch, refreshSession]);

  useEffect(() => {
    if (!address || allowRoleSwitch) return;
    const session = loadWalletSession();
    if (session?.address === address) {
      setSelectedRole(session.role);
    }
  }, [address, allowRoleSwitch]);

  async function handleContinue() {
    if (!signer || !address || !selectedRole) return;
    setSubmitState("working");
    setErrorMessage("");
    try {
      const existing = loadWalletSession();
      if (existing && (existing.address !== address || existing.role !== selectedRole)) {
        await clearWalletSession(existing.token);
      }

      window.localStorage.setItem("escrow.actingRole", selectedRole);
      await establishWalletSession({
        address,
        role: selectedRole,
        signMessage: (msg) => signMessageWithSigner(signer, msg),
      });

      refreshSession();
      navigate(selectedRole === "client" ? "/dashboard/client" : "/dashboard/freelancer", { replace: true });
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
    <AuthLayout imageSrc="/Auth/A1.png">
      <section className="w-full min-w-0">
        <ConnectWalletIntro />

        <div className="mt-8 w-full overflow-hidden rounded-3xl border border-gray-200/90 bg-white shadow-[0_20px_70px_-15px_rgba(15,23,42,0.12)] ring-1 ring-black/5">
          <WalletConnectionStep wallet={wallet} address={address} balance={balance} onOpenWallet={() => open()} />
          <RoleSelectionStep
            step1Done={step1Done}
            selectedRole={selectedRole}
            onSelectRole={setSelectedRole}
            canContinue={canContinue}
            submitState={submitState}
            errorMessage={errorMessage}
            onContinue={handleContinue}
          />
        </div>
      </section>
    </AuthLayout>
  );
}
