import { useCcc, useSigner } from "@ckb-ccc/connector-react";
import { Bell, Mail, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { truncateAddress } from "../../../utils/truncateAddress";

type DashboardHeaderProps = {
  roleLabel: string;
  address?: string;
};

export function DashboardHeader({ roleLabel, address }: DashboardHeaderProps) {
  const { open } = useCcc();
  const signer = useSigner();
  const [resolvedAddress, setResolvedAddress] = useState(address ?? "");

  useEffect(() => {
    if (address) {
      setResolvedAddress(address);
      return;
    }
    if (!signer) {
      setResolvedAddress("");
      return;
    }
    let cancelled = false;
    void signer.getRecommendedAddress().then((addr) => {
      if (!cancelled) setResolvedAddress(addr);
    });
    return () => {
      cancelled = true;
    };
  }, [address, signer]);

  return (
    <header className="flex shrink-0 items-center gap-4 bg-white px-6 py-4 lg:px-8">
      <label className="dashboard-search relative hidden min-w-0 flex-1 sm:block">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="Search contracts, messages…"
          className="w-full rounded-full border-0 bg-transparent py-3 pl-11 pr-4 text-sm text-gray-800 outline-none placeholder:text-gray-400"
        />
      </label>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100"
          aria-label="Messages"
        >
          <Mail className="size-5" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100"
          aria-label="Notifications"
        >
          <Bell className="size-5" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          onClick={() => open()}
          className="flex items-center gap-3 rounded-full border border-gray-100 bg-gray-50/80 py-1 pl-1 pr-4 transition-colors hover:bg-gray-100"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
            {roleLabel.charAt(0)}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-semibold text-gray-900">{roleLabel}</span>
            <span className="block font-mono text-[0.7rem] text-gray-500">
              {resolvedAddress ? truncateAddress(resolvedAddress, 6, 4) : "Wallet"}
            </span>
          </span>
        </button>
      </div>
    </header>
  );
}
