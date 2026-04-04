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
          "--background": "#0c1017",
          "--divider": "rgba(255,255,255,0.08)",
          "--btn-primary": "#1a2332",
          "--btn-primary-hover": "#243044",
          "--btn-secondary": "#1a2332",
          "--btn-secondary-hover": "#243044",
          "--icon-primary": "#f4f1ea",
          "--icon-secondary": "rgba(244,241,234,0.55)",
          color: "#f4f1ea",
          "--tip-color": "#7a8494",
        } as CSSProperties,
      }}
      defaultClient={defaultClient}
    >
      {children}
    </Provider>
  );
}
