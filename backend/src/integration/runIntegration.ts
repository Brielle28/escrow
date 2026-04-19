/**
 * Phase D — CCC integration against local OffCKB devnet.
 *
 * Prereqs: `offckb node`, `build:contracts`, deploy, `deployment/scripts.json`,
 * `offckb system-scripts --export-style ccc -o deployment/system-scripts.devnet.json`
 *
 * `backend/.env.local`: CKB_RPC_URL, DEPLOYER_PRIVATE_KEY
 * Optional: INTEGRATION_SPEND_MODE=release|dispute|timeout (default: release)
 *           INTEGRATION_PARTY_SEED, INTEGRATION_MIN_SINCE, INTEGRATION_ESCROW_CAPACITY
 */
import { createHash, createHmac } from "node:crypto";
import {
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
): Promise<void> {
  const always = await client.getKnownScript(KnownScript.AlwaysSuccess);
  await tx.addCellDepInfos(client, ...always.cellDeps);
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

async function main(): Promise<void> {
  loadEnv();
  const rpc = process.env.CKB_RPC_URL;
  const pkHex = process.env.DEPLOYER_PRIVATE_KEY;
  if (!rpc?.startsWith("http")) {
    throw new Error("Set CKB_RPC_URL in backend/.env.local");
  }
  if (!pkHex?.startsWith("0x")) {
    throw new Error("Set DEPLOYER_PRIVATE_KEY (0x…) in backend/.env.local");
  }

  const seed = process.env.INTEGRATION_PARTY_SEED ?? "escrow-phase-d-devnet";
  const mode = (process.env.INTEGRATION_SPEND_MODE ?? "release").toLowerCase();

  const depositorPriv = privFromSeed(seed, "depositor");
  const recipientPriv = privFromSeed(seed, "recipient");
  const arbiterPriv = privFromSeed(seed, "arbiter");

  const depositorPub = secp.getPublicKey(depositorPriv, true);
  const recipientPub = secp.getPublicKey(recipientPriv, true);
  const arbiterPub = secp.getPublicKey(arbiterPriv, true);

  const depositorPkHash = pubkeyHashHex(depositorPub);
  const recipientPkHash = pubkeyHashHex(recipientPub);
  const arbiterPkHash = pubkeyHashHex(arbiterPub);

  const client = new ClientPublicTestnet({ url: rpc });

  const scriptsJson = readScriptsJson();
  const bytecodeEntry = scriptsJson.devnet["index.bc"];
  if (!bytecodeEntry) {
    throw new Error(
      'deployment/scripts.json missing devnet["index.bc"] — deploy first',
    );
  }
  const bytecodeInfo = scriptInfoFromDeployEntry(bytecodeEntry);
  const vmInfo = vmInfoFromSystem();

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

  const alwaysSuccessLock = await Script.fromKnownScript(
    client,
    KnownScript.AlwaysSuccess,
    "0x",
  );

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

  await attachEscrowDeps(fundTx, client, bytecodeInfo, vmInfo);

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
  const fundTxHash = await client.sendTransactionNoCache(fundSigned, "passthrough");
  console.log("[D1] lock funds tx:", fundTxHash);

  const escrowLiveCell = await client.getCellLiveNoCache(
    { txHash: fundTxHash, index: 0 },
    true,
    false,
  );
  if (!escrowLiveCell) {
    throw new Error("Escrow cell not live after fund tx");
  }
  const escrowLive = escrowLiveCell;

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

    await attachEscrowDeps(tx, client, bytecodeInfo, vmInfo);

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

  let spendHash: Hex;

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
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
