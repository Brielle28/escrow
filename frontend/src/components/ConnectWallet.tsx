import { ccc, useCcc, useSigner } from "@ckb-ccc/connector-react";
import { useEffect, useState } from "react";
import { truncateAddress } from "../utils/truncateAddress";

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
      <button type="button" className="wallet-pill" onClick={() => open()}>
        {wallet.icon ? (
          <img
            src={wallet.icon}
            alt=""
            className="wallet-pill__icon"
            width={32}
            height={32}
          />
        ) : null}
        <span className="wallet-pill__meta">
          <span className="wallet-pill__bal">{balance || "—"} CKB</span>
          <span className="wallet-pill__addr">
            {address ? truncateAddress(address, 12, 8) : "…"}
          </span>
        </span>
      </button>
    );
  }

  return (
    <button type="button" className="btn-primary" onClick={() => open()}>
      Connect wallet
    </button>
  );
}
