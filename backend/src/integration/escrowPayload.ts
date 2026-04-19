import {
  bytesFrom,
  hashCkb,
  hexFrom,
  numBeToBytes,
  type Hex,
} from "@ckb-ccc/core";

/** Payload v1 — matches `contracts/on-chain-script/src/index.ts`. */
export function buildEscrowPayloadV1(args: {
  depositorPkHash: string;
  recipientPkHash: string;
  arbiterPkHash: string;
  recipientLockHash: string;
  depositorLockHash: string;
  minSince: bigint;
}): Hex {
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

/** Blake2b-256 over compressed pubkey — matches unit tests / on-chain checks. */
export function pubkeyHashHex(pub33: Uint8Array): Hex {
  return hexFrom(hashCkb(pub33));
}
