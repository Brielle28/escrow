import { connectFlowCopy } from "../../../utils/wallet/connectFlow";

export function ConnectWalletIntro() {
  return (
    <header className="max-w-prose lg:max-w-none">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-600">{connectFlowCopy.eyebrow}</p>
      <h1 className="mt-2 text-balance text-2xl font-bold tracking-tight text-gray-900 sm:text-[1.65rem] xl:text-3xl">
        {connectFlowCopy.title}
      </h1>
      <p className="mt-2 text-pretty text-sm leading-relaxed text-gray-600 md:text-base">{connectFlowCopy.subtitle}</p>
    </header>
  );
}
