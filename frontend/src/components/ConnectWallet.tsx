import { ccc, useCcc, useSigner } from "@ckb-ccc/connector-react";
import { useEffect, useState } from "react";
import { truncateAddress } from "../utils/truncateAddress";

const pillBtn =
  "inline-flex max-w-[min(100%,280px)] cursor-pointer items-center gap-2.5 rounded-full border border-gray-200 bg-gray-50 py-1.5 pl-1.5 pr-3.5 font-inherit text-gray-900 hover:border-brand-500/45";

const connectBtn =
  "inline-flex cursor-pointer items-center justify-center rounded-lg bg-gradient-to-b from-[#6bc77e] to-brand-500 px-[1.15rem] py-2 text-sm font-semibold text-white shadow-none hover:brightness-[1.03]";

export function ConnectWallet() {
  const { open, wallet } = useCcc();
  const signer = useSigner();
  const [balance, setBalance] = useState("");
  const [address, setAddress] = useState("");

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

  if (wallet) {
    return (
      <button type="button" className={pillBtn} onClick={() => open()}>
        {wallet.icon ? (
          <img src={wallet.icon} alt="" className="size-8 shrink-0 rounded-full" width={32} height={32} />
        ) : null}
        <span className="flex min-w-0 flex-col items-start text-left">
          <span className="text-[0.82rem] font-semibold text-gray-900">{balance || "—"} CKB</span>
          <span className="max-w-[200px] truncate text-[0.72rem] text-gray-500">
            {address ? truncateAddress(address, 12, 8) : "…"}
          </span>
        </span>
      </button>
    );
  }

  return (
    <button type="button" className={connectBtn} onClick={() => open()}>
      Connect wallet
    </button>
  );
}
