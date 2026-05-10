import { truncateAddress } from "../../../utils/truncateAddress";
import { connectFlowCopy } from "../../../utils/wallet/connectFlow";

type WalletLike = { icon?: string } | null | undefined;

type WalletConnectionStepProps = {
  wallet: WalletLike;
  address: string;
  balance: string;
  onOpenWallet: () => void;
};

export function WalletConnectionStep({ wallet, address, balance, onOpenWallet }: WalletConnectionStepProps) {
  return (
    <div className="border-b border-gray-100 bg-linear-to-br from-gray-50/90 to-white px-5 py-6 sm:px-8 sm:py-7 lg:px-10 lg:py-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-gray-500">{connectFlowCopy.step1.label}</h2>
          <p className="mt-1 text-base font-semibold text-gray-900">{connectFlowCopy.step1.title}</p>
          <p className="mt-1 text-sm text-gray-500">{connectFlowCopy.step1.hint}</p>
        </div>
        {!wallet ? (
          <button
            type="button"
            onClick={onOpenWallet}
            className="inline-flex w-fit shrink-0 self-start items-center justify-center rounded-2xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-brand-500/20 transition-colors hover:bg-brand-600"
          >
            {connectFlowCopy.connectButton}
          </button>
        ) : (
          <div className="flex w-full justify-start lg:w-auto lg:max-w-[min(100%,380px)] lg:justify-end lg:shrink-0">
            <div className="inline-flex max-w-full items-center gap-2.5 rounded-2xl border border-gray-200/90 bg-white py-2.5 pl-2.5 pr-3 shadow-sm">
              {wallet.icon ? (
                <img src={wallet.icon} alt="" className="size-9 shrink-0 rounded-lg shadow-inner" width={36} height={36} />
              ) : null}
              <div className="min-w-0 text-left">
                <p className="text-sm font-semibold tabular-nums leading-tight text-gray-900">{balance || "—"} CKB</p>
                <p className="max-w-46 truncate font-mono text-[10px] leading-tight text-gray-500 sm:max-w-52 sm:text-[11px] lg:max-w-56">
                  {address ? truncateAddress(address, 12, 8) : "…"}
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenWallet}
                className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-50"
              >
                {connectFlowCopy.changeButton}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
