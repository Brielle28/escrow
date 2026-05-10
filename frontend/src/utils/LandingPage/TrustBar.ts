/**
 * Trust strip marks — tuned for **Nervos CKB** ecosystem + familiar wallets.
 *
 * **Adding your own art:** set `logoSrc` to a path under `public/`, e.g.
 * `"/LandingPage/trust-nervos.svg"`. No paste/screenshot needed in chat — add the file and path here.
 */
export type TrustBarLogoId = "nervos" | "ckb" | "joyid" | "ccc" | "metamask";

export type TrustBarLogoEntry = {
  id: TrustBarLogoId;
  /** Wordmark shown beside the icon */
  label: string;
  /** Optional asset in `public/` — when set, replaces the Lucide glyph */
  logoSrc?: string;
};

export const trustBarLogoIds: readonly TrustBarLogoId[] = [
  "nervos",
  "ckb",
  "joyid",
  "ccc",
  "metamask",
] as const;

export const trustBarLogos: readonly TrustBarLogoEntry[] = [
  { id: "nervos", label: "Nervos" },
  { id: "ckb", label: "CKB" },
  { id: "joyid", label: "JoyID" },
  { id: "ccc", label: "CCC" },
  { id: "metamask", label: "MetaMask" },
];
