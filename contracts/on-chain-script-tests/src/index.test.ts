import {
  bytesConcat,
  bytesFrom,
  CellInput,
  hashCkb,
  hexFrom,
  numBeToBytes,
  Transaction,
  WitnessArgs,
  hashTypeToBytes,
} from "@ckb-ccc/core";
import { createHmac } from "crypto";
import { readFileSync } from "fs";
import {
  Resource,
  Verifier,
  DEFAULT_SCRIPT_ALWAYS_SUCCESS,
  DEFAULT_SCRIPT_CKB_JS_VM,
} from "ckb-testtool";
import * as secp from "@noble/secp256k1";

/** Noble secp256k1 sync signing needs a sync HMAC (Node test env). */
secp.utils.hmacSha256Sync = (key: Uint8Array, ...messages: Uint8Array[]) => {
  const h = createHmac("sha256", Buffer.from(key));
  for (const m of messages) h.update(Buffer.from(m));
  return new Uint8Array(h.digest());
};

function signTxHash(message32Hex: string, privKey: Uint8Array): Uint8Array {
  return secp.signSync(bytesFrom(message32Hex), privKey, { der: false });
}

/** Payload v1 — Destination A + Timeout A (matches on-chain `index.ts`). */
function buildEscrowPayloadV1(args: {
  depositorPkHash: string;
  recipientPkHash: string;
  arbiterPkHash: string;
  recipientLockHash: string;
  depositorLockHash: string;
  minSince: bigint;
}): string {
  const out = new Uint8Array(169);
  out.set(bytesFrom(args.depositorPkHash), 0);
  out.set(bytesFrom(args.recipientPkHash), 32);
  out.set(bytesFrom(args.arbiterPkHash), 64);
  out.set(bytesFrom(args.recipientLockHash), 96);
  out.set(bytesFrom(args.depositorLockHash), 128);
  out.set(bytesFrom(hexFrom(numBeToBytes(args.minSince, 8))), 160);
  out[168] = 1;
  return hexFrom(out);
}

describe("escrow lock (Destination A + Timeout A)", () => {
  test("release → recipient (seller) lock; arbiter + recipient signatures", () => {
    const resource = Resource.default();

    const alwaysSuccessCell = resource.mockCell(
      resource.createScriptUnused(),
      undefined,
      hexFrom(readFileSync(DEFAULT_SCRIPT_ALWAYS_SUCCESS)),
    );
    const alwaysSuccessScript = resource.createScriptByData(
      alwaysSuccessCell,
      "0x",
    );
    const recipientScript = resource.createScriptByData(
      alwaysSuccessCell,
      hexFrom("0x01"),
    );
    const depositorScript = resource.createScriptByData(
      alwaysSuccessCell,
      hexFrom("0x02"),
    );

    const jsCell = resource.mockCell(
      resource.createScriptUnused(),
      undefined,
      hexFrom(readFileSync("../on-chain-script/dist/index.bc")),
    );
    const jsScript = resource.createScriptByData(jsCell, "0x");
    const mainCell = resource.mockCell(
      resource.createScriptUnused(),
      undefined,
      hexFrom(readFileSync(DEFAULT_SCRIPT_CKB_JS_VM)),
    );

    const depositorPriv = secp.utils.randomPrivateKey();
    const recipientPriv = secp.utils.randomPrivateKey();
    const arbiterPriv = secp.utils.randomPrivateKey();

    const depositorPkHash = hexFrom(
      hashCkb(secp.getPublicKey(depositorPriv, true)),
    );
    const recipientPkHash = hexFrom(
      hashCkb(secp.getPublicKey(recipientPriv, true)),
    );
    const arbiterPkHash = hexFrom(hashCkb(secp.getPublicKey(arbiterPriv, true)));

    const escrowPayload = buildEscrowPayloadV1({
      depositorPkHash,
      recipientPkHash,
      arbiterPkHash,
      recipientLockHash: hexFrom(hashCkb(recipientScript.toBytes())),
      depositorLockHash: hexFrom(hashCkb(depositorScript.toBytes())),
      minSince: 0n,
    });

    const mainScript = resource.createScriptByData(
      mainCell,
      hexFrom(
        "0x0000" +
          jsScript.codeHash.slice(2) +
          hexFrom(hashTypeToBytes(jsScript.hashType)).slice(2) +
          escrowPayload.slice(2),
      ),
    );

    const inputCell = resource.mockCell(
      alwaysSuccessScript,
      mainScript,
      "0xFF000000000000000000000000000000",
    );

    const cellInput = Resource.createCellInput(inputCell) as CellInput;

    const tx = Transaction.from({
      cellDeps: [
        Resource.createCellDep(alwaysSuccessCell, "code"),
        Resource.createCellDep(jsCell, "code"),
        Resource.createCellDep(mainCell, "code"),
      ],
      inputs: [cellInput],
      outputs: [
        Resource.createCellOutput(recipientScript, mainScript),
        Resource.createCellOutput(recipientScript, mainScript),
      ],
      outputsData: [
        hexFrom("0xFE000000000000000000000000000000"),
        hexFrom("0x01000000000000000000000000000000"),
      ],
    });

    const message32 = hexFrom(tx.hash());
    const witnessLock = bytesConcat(
      bytesFrom([1]),
      signTxHash(message32, arbiterPriv),
      secp.getPublicKey(arbiterPriv, true),
      signTxHash(message32, recipientPriv),
      secp.getPublicKey(recipientPriv, true),
    );

    const witnessArgs = WitnessArgs.from({ lock: hexFrom(witnessLock) });
    tx.witnesses = [hexFrom(witnessArgs.toBytes())];

    Verifier.from(resource, tx).verifySuccess(true);
  });

  test("dispute refund → depositor (buyer) lock; arbiter + depositor signatures", () => {
    const resource = Resource.default();

    const alwaysSuccessCell = resource.mockCell(
      resource.createScriptUnused(),
      undefined,
      hexFrom(readFileSync(DEFAULT_SCRIPT_ALWAYS_SUCCESS)),
    );
    const alwaysSuccessScript = resource.createScriptByData(
      alwaysSuccessCell,
      "0x",
    );
    const recipientScript = resource.createScriptByData(
      alwaysSuccessCell,
      hexFrom("0x01"),
    );
    const depositorScript = resource.createScriptByData(
      alwaysSuccessCell,
      hexFrom("0x02"),
    );

    const jsCell = resource.mockCell(
      resource.createScriptUnused(),
      undefined,
      hexFrom(readFileSync("../on-chain-script/dist/index.bc")),
    );
    const jsScript = resource.createScriptByData(jsCell, "0x");
    const mainCell = resource.mockCell(
      resource.createScriptUnused(),
      undefined,
      hexFrom(readFileSync(DEFAULT_SCRIPT_CKB_JS_VM)),
    );

    const depositorPriv = secp.utils.randomPrivateKey();
    const recipientPriv = secp.utils.randomPrivateKey();
    const arbiterPriv = secp.utils.randomPrivateKey();

    const depositorPkHash = hexFrom(
      hashCkb(secp.getPublicKey(depositorPriv, true)),
    );
    const recipientPkHash = hexFrom(
      hashCkb(secp.getPublicKey(recipientPriv, true)),
    );
    const arbiterPkHash = hexFrom(hashCkb(secp.getPublicKey(arbiterPriv, true)));

    const escrowPayload = buildEscrowPayloadV1({
      depositorPkHash,
      recipientPkHash,
      arbiterPkHash,
      recipientLockHash: hexFrom(hashCkb(recipientScript.toBytes())),
      depositorLockHash: hexFrom(hashCkb(depositorScript.toBytes())),
      minSince: 0n,
    });

    const mainScript = resource.createScriptByData(
      mainCell,
      hexFrom(
        "0x0000" +
          jsScript.codeHash.slice(2) +
          hexFrom(hashTypeToBytes(jsScript.hashType)).slice(2) +
          escrowPayload.slice(2),
      ),
    );

    const inputCell = resource.mockCell(
      alwaysSuccessScript,
      mainScript,
      "0xFF000000000000000000000000000000",
    );

    const cellInput = Resource.createCellInput(inputCell) as CellInput;

    const tx = Transaction.from({
      cellDeps: [
        Resource.createCellDep(alwaysSuccessCell, "code"),
        Resource.createCellDep(jsCell, "code"),
        Resource.createCellDep(mainCell, "code"),
      ],
      inputs: [cellInput],
      outputs: [
        Resource.createCellOutput(depositorScript, mainScript),
        Resource.createCellOutput(depositorScript, mainScript),
      ],
      outputsData: [
        hexFrom("0xFE000000000000000000000000000000"),
        hexFrom("0x01000000000000000000000000000000"),
      ],
    });

    const message32 = hexFrom(tx.hash());
    const witnessLock = bytesConcat(
      bytesFrom([2]),
      signTxHash(message32, arbiterPriv),
      secp.getPublicKey(arbiterPriv, true),
      signTxHash(message32, depositorPriv),
      secp.getPublicKey(depositorPriv, true),
    );

    const witnessArgs = WitnessArgs.from({ lock: hexFrom(witnessLock) });
    tx.witnesses = [hexFrom(witnessArgs.toBytes())];

    Verifier.from(resource, tx).verifySuccess(true);
  });

  test("timeout refund → depositor lock; depositor signature; since >= min_since", () => {
    const resource = Resource.default();

    const alwaysSuccessCell = resource.mockCell(
      resource.createScriptUnused(),
      undefined,
      hexFrom(readFileSync(DEFAULT_SCRIPT_ALWAYS_SUCCESS)),
    );
    const alwaysSuccessScript = resource.createScriptByData(
      alwaysSuccessCell,
      "0x",
    );
    const recipientScript = resource.createScriptByData(
      alwaysSuccessCell,
      hexFrom("0x01"),
    );
    const depositorScript = resource.createScriptByData(
      alwaysSuccessCell,
      hexFrom("0x02"),
    );

    const jsCell = resource.mockCell(
      resource.createScriptUnused(),
      undefined,
      hexFrom(readFileSync("../on-chain-script/dist/index.bc")),
    );
    const jsScript = resource.createScriptByData(jsCell, "0x");
    const mainCell = resource.mockCell(
      resource.createScriptUnused(),
      undefined,
      hexFrom(readFileSync(DEFAULT_SCRIPT_CKB_JS_VM)),
    );

    const depositorPriv = secp.utils.randomPrivateKey();
    const recipientPriv = secp.utils.randomPrivateKey();
    const arbiterPriv = secp.utils.randomPrivateKey();

    const depositorPkHash = hexFrom(
      hashCkb(secp.getPublicKey(depositorPriv, true)),
    );
    const recipientPkHash = hexFrom(
      hashCkb(secp.getPublicKey(recipientPriv, true)),
    );
    const arbiterPkHash = hexFrom(hashCkb(secp.getPublicKey(arbiterPriv, true)));

    /** min_since in args; spending input `since` must be >= this (raw u64 compare). */
    const minSince = 0n;
    const escrowPayload = buildEscrowPayloadV1({
      depositorPkHash,
      recipientPkHash,
      arbiterPkHash,
      recipientLockHash: hexFrom(hashCkb(recipientScript.toBytes())),
      depositorLockHash: hexFrom(hashCkb(depositorScript.toBytes())),
      minSince,
    });

    const mainScript = resource.createScriptByData(
      mainCell,
      hexFrom(
        "0x0000" +
          jsScript.codeHash.slice(2) +
          hexFrom(hashTypeToBytes(jsScript.hashType)).slice(2) +
          escrowPayload.slice(2),
      ),
    );

    const inputCell = resource.mockCell(
      alwaysSuccessScript,
      mainScript,
      "0xFF000000000000000000000000000000",
    );

    const base = Resource.createCellInput(inputCell) as CellInput;
    const cellInput = CellInput.from({
      previousOutput: base.previousOutput,
      since: 0n,
    });

    const tx = Transaction.from({
      cellDeps: [
        Resource.createCellDep(alwaysSuccessCell, "code"),
        Resource.createCellDep(jsCell, "code"),
        Resource.createCellDep(mainCell, "code"),
      ],
      inputs: [cellInput],
      outputs: [
        Resource.createCellOutput(depositorScript, mainScript),
        Resource.createCellOutput(depositorScript, mainScript),
      ],
      outputsData: [
        hexFrom("0xFE000000000000000000000000000000"),
        hexFrom("0x01000000000000000000000000000000"),
      ],
    });

    const message32 = hexFrom(tx.hash());
    const witnessLock = bytesConcat(
      bytesFrom([3]),
      signTxHash(message32, depositorPriv),
      secp.getPublicKey(depositorPriv, true),
    );

    const witnessArgs = WitnessArgs.from({ lock: hexFrom(witnessLock) });
    tx.witnesses = [hexFrom(witnessArgs.toBytes())];

    Verifier.from(resource, tx).verifySuccess(true);
  });
});
