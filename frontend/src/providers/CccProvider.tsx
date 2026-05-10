import { Provider, ccc } from "@ckb-ccc/connector-react";
import { type CSSProperties, type ReactNode, useMemo } from "react";

export function CccProvider({ children }: { children: ReactNode }) {
  const defaultClient = useMemo(() => {
    return import.meta.env.VITE_CKB_NETWORK === "mainnet"
      ? new ccc.ClientPublicMainnet()
      : new ccc.ClientPublicTestnet();
  }, []);

  return (
    <Provider
      clientOptions={[
        { name: "CKB Testnet", client: new ccc.ClientPublicTestnet() },
        { name: "CKB Mainnet", client: new ccc.ClientPublicMainnet() },
      ]}
      connectorProps={{
        style: {
          // White + green + charcoal theme to match the landing experience.
          "--background": "#ffffff",
          "--divider": "rgba(17,24,39,0.09)",
          "--btn-primary": "#55b36b",
          "--btn-primary-hover": "#479a5c",
          "--btn-secondary": "#f8fafc",
          "--btn-secondary-hover": "#f1f5f9",
          "--icon-primary": "#111827",
          "--icon-secondary": "rgba(17,24,39,0.62)",
          color: "#111827",
          "--tip-color": "#4b5563",
        } as CSSProperties,
      }}
      defaultClient={defaultClient}
    >
      {children}
    </Provider>
  );
}
