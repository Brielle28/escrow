import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { deploymentDir } from "./paths.js";

import type { CellDepInfoLike } from "@ckb-ccc/core";

export type ScriptsJson = {
  devnet: Record<
    string,
    {
      codeHash: string;
      hashType: string;
      cellDeps: CellDepInfoLike[];
    }
  >;
};

export type SystemScriptsJson = {
  devnet: Record<
    string,
    {
      script: {
        codeHash: string;
        hashType: string;
        cellDeps: Array<{ cellDep: unknown }>;
      };
    }
  >;
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

export function readSystemScriptsDevnet(): SystemScriptsJson {
  const p = join(deploymentDir(), "system-scripts.devnet.json");
  if (!existsSync(p)) {
    throw new Error(
      `Missing ${p}. Run from repo root: offckb system-scripts --export-style ccc -o deployment/system-scripts.devnet.json`,
    );
  }
  return JSON.parse(readFileSync(p, "utf8")) as SystemScriptsJson;
}
