import { appendFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { integrationTxHistoryPath } from "./paths.js";

/** Networks we log for integration runs (explorer vs local). */
export type IntegrationHistoryNetwork = "offckb-devnet" | "ckb-testnet";

/** One JSON line per integration attempt — include failures for developers / ops (UI can filter `status === "success"`). */
export type IntegrationTxHistoryEntry =
  | {
      status: "success";
      ts: string;
      network: IntegrationHistoryNetwork;
      rpcHost: string;
      mode: string;
      fundTxHash: string;
      spendTxHash: string;
      arbiterPubkeyHash: string;
    }
  | {
      status: "failed";
      ts: string;
      network: IntegrationHistoryNetwork;
      rpcHost: string;
      mode: string;
      /** Present if fund tx was broadcast before failure */
      fundTxHash?: string;
      /** Present if spend tx was broadcast before failure */
      spendTxHash?: string;
      arbiterPubkeyHash?: string;
      error: string;
    };

export function appendIntegrationTxHistory(entry: IntegrationTxHistoryEntry): void {
  const p = integrationTxHistoryPath();
  mkdirSync(dirname(p), { recursive: true });
  appendFileSync(p, `${JSON.stringify(entry)}\n`, "utf8");
}
