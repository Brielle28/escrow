/**
 * Phase D — CCC integration against local OffCKB devnet.
 *
 * Prereqs: `offckb node`, `build:contracts`, deploy, `deployment/scripts.json`,
 * `offckb system-scripts --export-style ccc -o deployment/system-scripts.devnet.json`
 *
 * `backend/.env.local`: CKB_RPC_URL, DEPLOYER_PRIVATE_KEY (set once; no redeploy churn).
 * Optional: INTEGRATION_SPEND_MODE=release|dispute|timeout (default release — omit if fine).
 *           INTEGRATION_PARTY_SEED, INTEGRATION_MIN_SINCE, INTEGRATION_ESCROW_CAPACITY
 *
 * Always-success lock + deps come from system-scripts.devnet.json (not testnet genesis).
 * Signer.prepareTransaction uses getKnownScript(Secp256k1Blake160) — patch client with OffCKB devnet secp deps.
 */
import { createHash, createHmac } from "node:crypto";
import {
  Cell,
  CellInput,
  ClientPublicTestnet,
  KnownScript,
  Script,
  ScriptInfo,
  SignerCkbPrivateKey,
  Transaction,
  WitnessArgs,
  bytesFrom,
  hashCkb,
  hashTypeToBytes,
  hexFrom,
  type CellDepInfoLike,
  type Client,
  type Hex,
} from "@ckb-ccc/core";
import * as secp from "@noble/secp256k1";
import { loadEnv } from "./loadEnv.js";
import { readScriptsJson, readSystemScriptsDevnet } from "./deployment.js";
import { scriptInfoFromDeployEntry } from "./cellDeps.js";
import {
  buildEscrowPayloadV1,
  pubkeyHashHex,
} from "./escrowPayload.js";
import { appendIntegrationTxHistory } from "./txHistory.js";

secp.utils.hmacSha256Sync = (key: Uint8Array, ...messages: Uint8Array[]) => {
  const h = createHmac("sha256", Buffer.from(key));
  for (const m of messages) h.update(Buffer.from(m));
  return new Uint8Array(h.digest());
};

const TAG_RELEASE = 1;
const TAG_DISPUTE = 2;
const TAG_TIMEOUT = 3;

function signTxHash(message32Hex: Hex, privKey: Uint8Array): Uint8Array {
  return secp.signSync(bytesFrom(message32Hex), privKey, { der: false });
}

function privFromSeed(seed: string, role: string): Uint8Array {
  let h = createHash("sha256").update(`${seed}|${role}`).digest();
  let key = new Uint8Array(h);
  for (let i = 0; i < 256 && !secp.utils.isValidPrivateKey(key); i++) {
    h = createHash("sha256").update(key).digest();
    key = new Uint8Array(h);
  }
  if (!secp.utils.isValidPrivateKey(key)) {
    throw new Error("Could not derive valid secp256k1 key from seed");
  }
  return key;
}

async function lockSecp(client: Client, pub33: Uint8Array): Promise<Script> {
  const pkHash = hashCkb(pub33);
  const args20 = bytesFrom(pkHash).slice(0, 20);
  return Script.fromKnownScript(
    client,
    KnownScript.Secp256k1Blake160,
    hexFrom(args20),
  );
}

function buildVmEscrowArgs(
  bytecodeInfo: ScriptInfo,
  escrowPayloadHex: Hex,
): Hex {
  return hexFrom(
    "0x0000" +
      bytecodeInfo.codeHash.slice(2) +
      hexFrom(hashTypeToBytes(bytecodeInfo.hashType)).slice(2) +
      escrowPayloadHex.slice(2),
  );
}

async function attachEscrowDeps(
  tx: Transaction,
  client: Client,
  bytecodeInfo: ScriptInfo,
  vmInfo: ScriptInfo,
  alwaysInfo: ScriptInfo,
): Promise<void> {
  await tx.addCellDepInfos(client, ...alwaysInfo.cellDeps);
  await tx.addCellDepInfos(client, ...vmInfo.cellDeps);
  await tx.addCellDepInfos(client, ...bytecodeInfo.cellDeps);
}

function witnessLock(
  tag: number,
  pairs: Array<{ pk: Uint8Array; sig: Uint8Array }>,
): Hex {
  const parts: Uint8Array[] = [new Uint8Array([tag])];
  for (const p of pairs) {
    parts.push(p.sig, p.pk);
  }
  const total = parts.reduce((a, b) => a + b.length, 0);
  const out = new Uint8Array(total);
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return hexFrom(out);
}

function vmInfoFromSystem(): ScriptInfo {
  const s = readSystemScriptsDevnet();
  const raw = s.devnet.ckb_js_vm.script as {
    codeHash: string;
    hashType: string;
    cellDeps: CellDepInfoLike[];
  };
  return ScriptInfo.from(raw);
}

function alwaysInfoFromSystem(): ScriptInfo {
  const s = readSystemScriptsDevnet();
  const raw = s.devnet.always_success.script as {
    codeHash: string;
    hashType: string;
    cellDeps: CellDepInfoLike[];
  };
  return ScriptInfo.from(raw);
}

function secpInfoFromSystem(): ScriptInfo {
  const s = readSystemScriptsDevnet();
  const raw = s.devnet.secp256k1_blake160_sighash_all.script as {
    codeHash: string;
    hashType: string;
    cellDeps: CellDepInfoLike[];
  };
  return ScriptInfo.from(raw);
}

/** CCC's ClientPublicTestnet resolves known scripts to public-testnet genesis; OffCKB devnet needs local outpoints. */
function patchKnownScriptSecpForDevnet(client: Client, secpDevnet: ScriptInfo): void {
  const inner = client.getKnownScript.bind(client);
  (
    client as unknown as {
      getKnownScript: typeof inner;
    }
  ).getKnownScript = async (known: KnownScript) => {
    if (known === KnownScript.Secp256k1Blake160) {
      return secpDevnet;
    }
    return inner(known);
  };
}

/** Prefer fund-tx output scan: `findSingletonCellByType` matches type only — repeated runs share type args and can return the wrong live cell. */
async function liveEscrowCellFromFundTx(
  client: Client,
  fundTxHash: Hex,
  alwaysSuccessLock: Script,
  escrowTypeScript: Script,
): Promise<Cell> {
  const res = await client.getTransaction(fundTxHash);
  const tx = res?.transaction;
  if (!tx) {
    throw new Error(`getTransaction(${fundTxHash}) returned empty`);
  }
  for (let i = 0; i < tx.outputs.length; i++) {
    const out = tx.outputs[i];
    if (
      out.type &&
      out.type.eq(escrowTypeScript) &&
      out.lock.eq(alwaysSuccessLock)
    ) {
      for (let attempt = 0; attempt < 40; attempt++) {
        const live = await client.getCellLiveNoCache(
          { txHash: fundTxHash, index: BigInt(i) },
          true,
          false,
        );
        if (live) {
          return live;
        }
        await new Promise((r) => setTimeout(r, 400));
      }
      throw new Error(
        `Escrow output ${i} of fund tx not live yet (indexer/RPC lag)`,
      );
    }
  }
  throw new Error(
    "Fund tx has no output with always_success lock + escrow type script",
  );
}

async function main(): Promise<void> {
  let fundTxHash: Hex | undefined;
  let spendHash: Hex | undefined;
  let rpc = "";
  let rpcHost = "";
  let mode = "";
  let arbiterPkHash = "";

  loadEnv();

  try {
  const pkHex = process.env.DEPLOYER_PRIVATE_KEY;
  rpc = process.env.CKB_RPC_URL ?? "";
  if (!rpc.startsWith("http")) {
    throw new Error("Set CKB_RPC_URL in backend/.env.local");
  }
  if (!pkHex?.startsWith("0x")) {
    throw new Error("Set DEPLOYER_PRIVATE_KEY (0x…) in backend/.env.local");
  }

  rpcHost = new URL(rpc).host;

  const seed = process.env.INTEGRATION_PARTY_SEED ?? "escrow-phase-d-devnet";
  mode = (process.env.INTEGRATION_SPEND_MODE ?? "release").toLowerCase();

  const depositorPriv = privFromSeed(seed, "depositor");
  const recipientPriv = privFromSeed(seed, "recipient");
  const arbiterPriv = privFromSeed(seed, "arbiter");

  const depositorPub = secp.getPublicKey(depositorPriv, true);
  const recipientPub = secp.getPublicKey(recipientPriv, true);
  const arbiterPub = secp.getPublicKey(arbiterPriv, true);

  const depositorPkHash = pubkeyHashHex(depositorPub);
  const recipientPkHash = pubkeyHashHex(recipientPub);
  arbiterPkHash = pubkeyHashHex(arbiterPub);

  const client = new ClientPublicTestnet({ url: rpc });

  const secpInfo = secpInfoFromSystem();
  patchKnownScriptSecpForDevnet(client, secpInfo);

  const scriptsJson = readScriptsJson();
  const bytecodeEntry = scriptsJson.devnet["index.bc"];
  if (!bytecodeEntry) {
    throw new Error(
      'deployment/scripts.json missing devnet["index.bc"] — deploy first',
    );
  }
  const bytecodeInfo = scriptInfoFromDeployEntry(bytecodeEntry);
  const vmInfo = vmInfoFromSystem();
  const alwaysInfo = alwaysInfoFromSystem();

  const depositorLock = await lockSecp(client, depositorPub);
  const recipientLock = await lockSecp(client, recipientPub);

  const recipientLockHash = hexFrom(hashCkb(recipientLock.toBytes()));
  const depositorLockHash = hexFrom(hashCkb(depositorLock.toBytes()));

  const minSince = process.env.INTEGRATION_MIN_SINCE
    ? BigInt(process.env.INTEGRATION_MIN_SINCE)
    : 0n;

  const escrowPayload = buildEscrowPayloadV1({
    depositorPkHash,
    recipientPkHash,
    arbiterPkHash,
    recipientLockHash,
    depositorLockHash,
    minSince,
  });

  const escrowTypeArgs = buildVmEscrowArgs(bytecodeInfo, escrowPayload);
  const escrowTypeScript = Script.from({
    codeHash: vmInfo.codeHash,
    hashType: vmInfo.hashType,
    args: escrowTypeArgs,
  });

  const alwaysSuccessLock = Script.from({
    codeHash: alwaysInfo.codeHash,
    hashType: alwaysInfo.hashType,
    args: "0x",
  });

  const deploySigner = new SignerCkbPrivateKey(client, pkHex as Hex);

  const escrowCapacity = BigInt(
    process.env.INTEGRATION_ESCROW_CAPACITY ?? "150000000000",
  );

  /** D1 — fund escrow cell */
  const fundTx = Transaction.from({
    version: 0n,
    cellDeps: [],
    inputs: [],
    outputs: [],
    witnesses: [],
    outputsData: [],
  });

  await attachEscrowDeps(fundTx, client, bytecodeInfo, vmInfo, alwaysInfo);

  fundTx.addOutput(
    {
      capacity: escrowCapacity,
      lock: alwaysSuccessLock,
      type: escrowTypeScript,
    },
    "0x",
  );

  await fundTx.completeFeeChangeToLock(
    deploySigner,
    (await deploySigner.getAddressObjSecp256k1()).script,
    1000n,
  );

  const fundPrepared = await deploySigner.prepareTransaction(fundTx);
  const fundSigned = await deploySigner.signOnlyTransaction(fundPrepared);
  fundTxHash = await client.sendTransactionNoCache(fundSigned, "passthrough");
  console.log("[D1] lock funds tx:", fundTxHash);

  await client.waitTransaction(fundTxHash, 0, 120_000, 500);

  const escrowLive = await liveEscrowCellFromFundTx(
    client,
    fundTxHash,
    alwaysSuccessLock,
    escrowTypeScript,
  );

  /** Complete input metadata before hashing (same as VM tests). */
  async function prepareSpendTx(tx: Transaction): Promise<void> {
    await Promise.all(tx.inputs.map((i) => i.completeExtraInfos(client)));
  }

  /** Build & broadcast spend (no secp on escrow lock — passthrough). */
  async function spendWithWitness(opts: {
    tag: number;
    pairs: Array<{ priv: Uint8Array }>;
    outputLock: Script;
    since: bigint;
  }): Promise<Hex> {
    const pairs = opts.pairs.map((p) => ({
      pk: secp.getPublicKey(p.priv, true),
      priv: p.priv,
    }));

    const tx = Transaction.from({
      version: 0n,
      cellDeps: [],
      inputs: [],
      outputs: [],
      witnesses: [],
      outputsData: [],
    });

    await attachEscrowDeps(tx, client, bytecodeInfo, vmInfo, alwaysInfo);

    tx.addInput(
      CellInput.from({
        previousOutput: escrowLive.outPoint,
        since: opts.since,
      }),
    );

    tx.addOutput(
      {
        capacity: escrowLive.cellOutput.capacity - 100000n,
        lock: opts.outputLock,
        type: escrowTypeScript,
      },
      "0x",
    );

    await prepareSpendTx(tx);

    const msg = hexFrom(tx.hash());
    const wit = witnessLock(
      opts.tag,
      pairs.map((p) => ({
        pk: p.pk,
        sig: signTxHash(msg, p.priv),
      })),
    );

    tx.witnesses = [
      hexFrom(WitnessArgs.from({ lock: wit }).toBytes()),
    ];

    return client.sendTransactionNoCache(tx, "passthrough");
  }

  if (mode === "release") {
    spendHash = await spendWithWitness({
      tag: TAG_RELEASE,
      pairs: [{ priv: arbiterPriv }, { priv: recipientPriv }],
      outputLock: recipientLock,
      since: 0n,
    });
    console.log("[D2] release tx:", spendHash);
  } else if (mode === "dispute") {
    spendHash = await spendWithWitness({
      tag: TAG_DISPUTE,
      pairs: [{ priv: arbiterPriv }, { priv: depositorPriv }],
      outputLock: depositorLock,
      since: 0n,
    });
    console.log("[D4] dispute refund tx:", spendHash);
  } else if (mode === "timeout") {
    spendHash = await spendWithWitness({
      tag: TAG_TIMEOUT,
      pairs: [{ priv: depositorPriv }],
      outputLock: depositorLock,
      since: minSince,
    });
    console.log("[D3] timeout refund tx:", spendHash);
  } else {
    throw new Error(
      `INTEGRATION_SPEND_MODE must be release|dispute|timeout, got: ${mode}`,
    );
  }

  console.log("\nSummary:", JSON.stringify({ fund: fundTxHash, spend: spendHash, mode }, null, 2));

  appendIntegrationTxHistory({
    status: "success",
    ts: new Date().toISOString(),
    network: "offckb-devnet",
    rpcHost,
    mode,
    fundTxHash: fundTxHash!,
    spendTxHash: spendHash!,
    arbiterPubkeyHash: arbiterPkHash,
  });
  console.log(
    "[history] success → artifacts/integration-tx-history.jsonl (filter status=success for UI)",
  );
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    try {
      let host = rpcHost;
      if (!host && rpc.startsWith("http")) {
        try {
          host = new URL(rpc).host;
        } catch {
          host = "invalid-url";
        }
      } else if (!host) {
        host = "unset";
      }
      appendIntegrationTxHistory({
        status: "failed",
        ts: new Date().toISOString(),
        network: "offckb-devnet",
        rpcHost: host,
        mode:
          mode ||
          (process.env.INTEGRATION_SPEND_MODE ?? "release").toLowerCase(),
        fundTxHash,
        spendTxHash: spendHash,
        arbiterPubkeyHash: arbiterPkHash || undefined,
        error: err.message,
      });
      console.warn(
        "[history] failed run → artifacts/integration-tx-history.jsonl (for developers; omit in UI if desired)",
      );
    } catch (logErr) {
      console.warn("[history] could not append failed run:", logErr);
    }
    throw err;
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
