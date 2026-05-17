import { useCcc, useSigner } from "@ckb-ccc/connector-react";
import { Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyAdminSession } from "../../api/dashboard";
import { EscrowLogo } from "../../components/EscrowLogo";
import { saveAdminSessionFromVerify, useAdminSession } from "../../providers/AdminSessionProvider";
import { loadAdminSession } from "../../utils/admin/adminSession";

export function AdminLoginPage() {
  const { open } = useCcc();
  const signer = useSigner();
  const navigate = useNavigate();
  const { refresh } = useAdminSession();
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);

  useEffect(() => {
    const existing = loadAdminSession();
    if (existing) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!signer) {
      setAddress("");
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

  async function handleAdminEnter() {
    if (!address) return;
    setWorking(true);
    setError("");
    try {
      const data = await verifyAdminSession(address);
      saveAdminSessionFromVerify(data);
      refresh();
      navigate("/admin", { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Admin verification failed");
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-800 px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <Shield className="size-7 text-brand-600" />
          <EscrowLogo />
          <span className="text-sm font-medium text-gray-500">Admin</span>
        </div>
        <h1 className="mt-6 text-2xl font-bold text-gray-900">Moderator access</h1>
        <p className="mt-2 text-sm text-gray-600">
          Connect an allowlisted wallet. Admin sessions are separate from client and freelancer roles.
        </p>
        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={() => open()}
            className="w-full rounded-2xl border border-gray-200 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            {address ? `Connected: ${address.slice(0, 10)}…` : "Connect wallet"}
          </button>
          <button
            type="button"
            disabled={!address || working}
            onClick={() => void handleAdminEnter()}
            className="w-full rounded-2xl bg-brand-700 py-3 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-50"
          >
            {working ? "Verifying…" : "Enter admin dashboard"}
          </button>
        </div>
        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
      </div>
    </div>
  );
}
