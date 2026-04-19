import {
  CellDepInfo,
  ScriptInfo,
  type CellDepInfoLike,
  type ScriptInfoLike,
} from "@ckb-ccc/core";

/** Build `ScriptInfo` from `deployment/scripts.json` contract entry. */
export function scriptInfoFromDeployEntry(entry: {
  codeHash: string;
  hashType: string;
  cellDeps: CellDepInfoLike[];
}): ScriptInfo {
  const like: ScriptInfoLike = {
    codeHash: entry.codeHash,
    hashType: entry.hashType,
    cellDeps: entry.cellDeps.map((x) => CellDepInfo.from(x)),
  };
  return ScriptInfo.from(like);
}
