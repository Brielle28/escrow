import { ccc, useCcc, useSigner } from "@ckb-ccc/connector-react";
import { startTransition, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { truncateAddress } from "../../utils/truncateAddress";

/** Squared chip with slight rounding + brand fill (not full pill). */
const walletChip =
  "inline-flex w-fit max-w-[min(100%,240px)] cursor-pointer items-center gap-2 rounded-xl border border-brand-600/30 bg-brand-500 py-2 pl-2 pr-2.5 font-inherit text-white shadow-md shadow-brand-500/25 transition-colors hover:border-brand-600/40 hover:bg-brand-600 sm:max-w-[min(100%,280px)] sm:gap-2.5 sm:pr-3";

const connectBtn =
  "inline-flex cursor-pointer items-center justify-center rounded-lg bg-gradient-to-b from-[#6bc77e] to-brand-500 px-[1.15rem] py-2 text-sm font-semibold text-white shadow-none hover:brightness-[1.03]";

/**
 * Compact wallet control for the navbar: opens full connect + role flow at `/connects`.
 * Does not auto-sign; session is established only on the connect page after role selection.
 */
export function ConnectWallet() {
  const { open, wallet } = useCcc();
  const signer = useSigner();
  const [balance, setBalance] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!signer) {
      startTransition(() => {
        setAddress("");
        setBalance("");
      });
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

  if (!wallet) {
    return (
      <Link to="/connects" className={connectBtn}>
        Connect wallet
      </Link>
    );
  }

  return (
    <button type="button" className={walletChip} onClick={() => open()} aria-label="Wallet: change connection">
      {wallet.icon ? (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/25">
          <img src={wallet.icon} alt="" className="size-6 rounded-md" width={24} height={24} />
        </span>
      ) : null}
      <span className="flex min-w-0 flex-col items-start text-left">
        <span className="text-[0.8rem] font-semibold leading-tight text-white">{balance || "—"} CKB</span>
        <span className="max-w-[160px] truncate text-[0.68rem] text-white/80 sm:max-w-[200px] sm:text-[0.72rem]">
          {address ? truncateAddress(address, 10, 6) : "…"}
        </span>
      </span>
    </button>
  );
}
