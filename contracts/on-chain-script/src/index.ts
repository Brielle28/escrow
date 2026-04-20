/**
 * Escrow lock (ckb-js-vm)
 *
 * **Destination A**
 * - Release: pay **recipient (seller)** — output 0 lock hash must equal `recipientLockHash`.
 * - Refunds (dispute + timeout): pay **depositor (buyer)** — output 0 lock hash must equal `depositorLockHash`.
 *
 * **Timeout A**
 * - Timeout path requires `input.since >= min_since` (unsigned compare on the raw u64 `since` field).
 *   Real txs should set `since` per CKB consensus rules for time locks; integration tests often use `0`.
 *
 * **Signing**
 * - Message `M = hashCkb(raw_transaction)` (same as `tx.hash()`, witnesses excluded).
 * - Witness `lock` field: `tag` | 64-byte compact ECDSA | 33-byte compressed pubkey | … (two parties on
 *   release/dispute, one on timeout). Same `M` for both signatures on dual-sign paths.
 */
import * as bindings from "@ckb-js-std/bindings";
import {
  RawTransaction,
  Transaction,
  WitnessArgs,
  hashCkb,
} from "@ckb-js-std/core";
import { HighLevel } from "@ckb-js-std/core";

/** Trailing bytes of lock.args = escrow payload (version 1). */
const ESCROW_PAYLOAD_LEN = 169;
const ESCROW_VERSION = 1;

const TAG_RELEASE = 1;
const TAG_DISPUTE = 2;
const TAG_TIMEOUT = 3;

const SIG_LEN = 64;
const PUBKEY_LEN = 33;

export const Err = {
  Ok: 0,
  ArgsLength: 1,
  Witness: 2,
  UnknownTag: 3,
  SigVerify: 4,
  OutputMismatch: 5,
  SinceNotMet: 6,
};

function readU64Le(buf: Uint8Array, off: number): bigint {
  let n = 0n;
  for (let i = 0; i < 8; i++) n |= BigInt(buf[off + i]!) << (8n * BigInt(i));
  return n;
}

function slice(b: ArrayBuffer, start: number, len: number): ArrayBuffer {
  return b.slice(start, start + len);
}

/** creates a message to sign for the escrow contract Same as CKB `tx.hash()`: blake2b of serialized raw transaction (no witnesses). */
function escrowSigningMessage(tx: Transaction): ArrayBuffer {
  const raw = RawTransaction.encode({
    version: tx.version,
    cellDeps: tx.cellDeps,
    headerDeps: tx.headerDeps,
    inputs: tx.inputs,
    outputs: tx.outputs,
    outputsData: tx.outputsData,
  });
  return hashCkb(raw);
}

// checking whether the recipient wallet (lock script) is the one we agreed on in advance
function lockScriptHashFromOutput0(): ArrayBuffer {
  /** Escrow runs as the cell’s type script (ckb-js-vm); use group output, not flat OUTPUT. */
  const out = HighLevel.loadCell(0, bindings.SOURCE_GROUP_OUTPUT);
  return hashCkb(out.lock.toBytes());
}

// comparing if the two byte strings are identical?
function bytesEq(a: ArrayBuffer, b: ArrayBuffer): boolean {
  if (a.byteLength !== b.byteLength) return false;
  const ua = new Uint8Array(a);
  const ub = new Uint8Array(b);
  for (let i = 0; i < ua.length; i++) {
    if (ua[i] !== ub[i]) return false;
  }
  return true;
}

// verifying the signature and the public key match what we expected hash are correct
function verifySigAndPubkeyHash(
  sig64: ArrayBuffer,
  msg32: ArrayBuffer,
  pubkey33: ArrayBuffer,
  expectedPkHash: ArrayBuffer,
): boolean {
  if (!bytesEq(hashCkb(pubkey33), expectedPkHash)) return false;
  const rawPub = bindings.secp256k1.parsePubkey(pubkey33);
  return bindings.secp256k1.verify(sig64, msg32, rawPub);
}

function parseEscrowPayload(scriptArgs: ArrayBuffer): {
  depositorPkHash: ArrayBuffer;
  recipientPkHash: ArrayBuffer;
  arbiterPkHash: ArrayBuffer;
  /** hashCkb(recipient's payout lock script) — seller (Destination A). */
  recipientLockHash: ArrayBuffer;
  /** hashCkb(depositor's refund lock script) — buyer (Destination A). */
  depositorLockHash: ArrayBuffer;
  minSince: bigint;
  version: number;
} | number {
  const len = scriptArgs.byteLength;
  if (len < ESCROW_PAYLOAD_LEN) return Err.ArgsLength;
  const u8a = new Uint8Array(scriptArgs);
  const start = len - ESCROW_PAYLOAD_LEN;
  const p = u8a.subarray(start, start + ESCROW_PAYLOAD_LEN);
  if (p[168] !== ESCROW_VERSION) return Err.ArgsLength;
  return {
    depositorPkHash: p.slice(0, 32).buffer as ArrayBuffer,
    recipientPkHash: p.slice(32, 64).buffer as ArrayBuffer,
    arbiterPkHash: p.slice(64, 96).buffer as ArrayBuffer,
    recipientLockHash: p.slice(96, 128).buffer as ArrayBuffer,
    depositorLockHash: p.slice(128, 160).buffer as ArrayBuffer,
    minSince: readU64Le(p, 160),
    version: p[168]!,
  };
}

function main(): number {
  const script = HighLevel.loadScript();
  const parsed = parseEscrowPayload(script.args);
  if (typeof parsed === "number") return parsed;

  const {
    depositorPkHash,
    recipientPkHash,
    arbiterPkHash,
    recipientLockHash,
    depositorLockHash,
    minSince,
  } = parsed;

  /** Funding tx: escrow type only appears on an output — no input in this script group, so witness is absent. */
  try {
    HighLevel.loadCell(0, bindings.SOURCE_GROUP_INPUT);
  } catch {
    return Err.Ok;
  }

  const tx = HighLevel.loadTransaction();
  const msg = escrowSigningMessage(tx);

  let wa: WitnessArgs;
  try {
    wa = HighLevel.loadWitnessArgs(0, bindings.SOURCE_GROUP_INPUT);
  } catch {
    return Err.Witness;
  }
  if (!wa.lock || wa.lock.byteLength < 1) return Err.Witness;

  const lockBytes = new Uint8Array(wa.lock);
  const tag = lockBytes[0]!;

  const outHash = lockScriptHashFromOutput0();

  if (tag === TAG_RELEASE) {
    const need = 1 + (SIG_LEN + PUBKEY_LEN) * 2;
    if (lockBytes.byteLength < need) return Err.Witness;
    const sigArb = slice(wa.lock!, 1, SIG_LEN);
    const pkArb = slice(wa.lock!, 1 + SIG_LEN, PUBKEY_LEN);
    const sigRec = slice(wa.lock!, 1 + SIG_LEN + PUBKEY_LEN, SIG_LEN);
    const pkRec = slice(
      wa.lock!,
      1 + SIG_LEN + PUBKEY_LEN + SIG_LEN,
      PUBKEY_LEN,
    );
    if (
      !verifySigAndPubkeyHash(sigArb, msg, pkArb, arbiterPkHash) ||
      !verifySigAndPubkeyHash(sigRec, msg, pkRec, recipientPkHash)
    ) {
      return Err.SigVerify;
    }
    if (!bytesEq(outHash, recipientLockHash)) return Err.OutputMismatch;
    return Err.Ok;
  }

  if (tag === TAG_DISPUTE) {
    const need = 1 + (SIG_LEN + PUBKEY_LEN) * 2;
    if (lockBytes.byteLength < need) return Err.Witness;
    const sigArb = slice(wa.lock!, 1, SIG_LEN);
    const pkArb = slice(wa.lock!, 1 + SIG_LEN, PUBKEY_LEN);
    const sigDep = slice(wa.lock!, 1 + SIG_LEN + PUBKEY_LEN, SIG_LEN);
    const pkDep = slice(
      wa.lock!,
      1 + SIG_LEN + PUBKEY_LEN + SIG_LEN,
      PUBKEY_LEN,
    );
    if (
      !verifySigAndPubkeyHash(sigArb, msg, pkArb, arbiterPkHash) ||
      !verifySigAndPubkeyHash(sigDep, msg, pkDep, depositorPkHash)
    ) {
      return Err.SigVerify;
    }
    if (!bytesEq(outHash, depositorLockHash)) return Err.OutputMismatch;
    return Err.Ok;
  }

  if (tag === TAG_TIMEOUT) {
    const need = 1 + SIG_LEN + PUBKEY_LEN;
    if (lockBytes.byteLength < need) return Err.Witness;
    const sigDep = slice(wa.lock!, 1, SIG_LEN);
    const pkDep = slice(wa.lock!, 1 + SIG_LEN, PUBKEY_LEN);
    if (!verifySigAndPubkeyHash(sigDep, msg, pkDep, depositorPkHash)) {
      return Err.SigVerify;
    }
    let since: bigint;
    try {
      since = HighLevel.loadInputSince(0, bindings.SOURCE_GROUP_INPUT);
    } catch {
      return Err.SinceNotMet;
    }
    if (since < minSince) return Err.SinceNotMet;
    if (!bytesEq(outHash, depositorLockHash)) return Err.OutputMismatch;
    return Err.Ok;
  }

  return Err.UnknownTag;
}

bindings.exit(main());
