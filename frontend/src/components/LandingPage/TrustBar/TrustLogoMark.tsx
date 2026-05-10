import type { TrustBarLogoEntry } from "../../../utils/LandingPage/TrustBar";
import type { LucideIcon } from "lucide-react";
import { Boxes, Cable, Coins, Fingerprint, Wallet } from "lucide-react";

const fallbackIcon: Record<TrustBarLogoEntry["id"], LucideIcon> = {
  nervos: Boxes,
  ckb: Coins,
  joyid: Fingerprint,
  ccc: Cable,
  metamask: Wallet,
};

function TrustLogoMark({ entry }: { entry: TrustBarLogoEntry }) {
  const Icon = fallbackIcon[entry.id];

  if (entry.logoSrc) {
    return (
      <div className="flex items-center gap-2 text-gray-300">
        <img
          src={entry.logoSrc}
          alt=""
          className="h-8 max-h-8 w-auto max-w-[120px] object-contain opacity-90"
          loading="lazy"
          decoding="async"
        />
        <span className="sr-only">{entry.label}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-gray-400">
      <Icon className="size-8 shrink-0 text-gray-300 opacity-90" strokeWidth={1.75} aria-hidden />
      <span className="text-[15px] font-semibold tracking-tight text-gray-300 md:text-[17px]">
        {entry.label}
      </span>
    </div>
  );
}

export default TrustLogoMark;
