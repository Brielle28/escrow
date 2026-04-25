import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { deploymentDir } from "./paths.js";

import type { CellDepInfoLike } from "@ckb-ccc/core";

/** Local OffCKB vs CKB public testnet (Pudge). */
export type ChainNetwork = "devnet" | "testnet";

export type ScriptDeployEntry = {
  codeHash: string;
  hashType: string;
  cellDeps: CellDepInfoLike[];
};

export type ScriptsJson = {
  devnet: Record<string, ScriptDeployEntry>;
  testnet: Record<string, ScriptDeployEntry>;
  mainnet?: Record<string, ScriptDeployEntry>;
};

export type SystemScriptBundle = Record<
  string,
  {
    script: {
      codeHash: string;
      hashType: string;
      cellDeps: CellDepInfoLike[];
    };
  }
>;

/** OffCKB export: top-level `devnet` / `testnet` keys. */
export type SystemScriptsRootFile = {
  devnet?: SystemScriptBundle;
  testnet?: SystemScriptBundle;
};

export function readScriptsJson(): ScriptsJson {
  const root = deploymentDir();
  const candidates = [
    join(root, "scripts.json"),
    join(root, "devnet", "scripts.json"),
  ];
  for (const p of candidates) {
    if (existsSync(p)) {
      return JSON.parse(readFileSync(p, "utf8")) as ScriptsJson;
    }
  }
  throw new Error(
    `scripts.json not found. Tried: ${candidates.join(", ")}`,
  );
}

/** @deprecated prefer {@link readSystemScriptsChain} */
export function readSystemScriptsDevnet(): SystemScriptsRootFile {
  const p = join(deploymentDir(), "system-scripts.devnet.json");
  if (!existsSync(p)) {
    throw new Error(
      `Missing ${p}. Run from repo root: offckb system-scripts --export-style ccc --network devnet -o deployment/system-scripts.devnet.json`,
    );
  }
  return JSON.parse(readFileSync(p, "utf8")) as SystemScriptsRootFile;
}

export function readSystemScriptsChain(network: ChainNetwork): SystemScriptBundle {
  const fname =
    network === "devnet"
      ? "system-scripts.devnet.json"
      : "system-scripts.testnet.json";
  const p = join(deploymentDir(), fname);
  if (!existsSync(p)) {
    throw new Error(
      `Missing ${p}. Run from repo root: offckb system-scripts --export-style ccc --network ${network} -o deployment/${fname}`,
    );
  }
  const root = JSON.parse(readFileSync(p, "utf8")) as SystemScriptsRootFile;
  const section = root[network];
  if (!section) {
    throw new Error(`${fname} has no "${network}" section`);
  }
  return section;
}

export function bytecodeEntryForChain(
  scripts: ScriptsJson,
  network: ChainNetwork,
): ScriptDeployEntry | undefined {
  return scripts[network]?.["index.bc"];
}
