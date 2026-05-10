/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CKB_NETWORK?: "testnet" | "mainnet";
  /** Empty/unset in dev → same-origin `/api/*` via Vite proxy to the auth server. */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
