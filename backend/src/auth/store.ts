import { randomBytes } from "node:crypto";
import type { ActingRole, ChallengeRecord, SessionRecord } from "./types.js";

const challengeTtlMs = 5 * 60 * 1000;
const sessionTtlMs = 24 * 60 * 60 * 1000;

const challengeStore = new Map<string, ChallengeRecord>();
const sessionStore = new Map<string, SessionRecord>();

function challengeKey(address: string, role: ActingRole): string {
  return `${address.toLowerCase()}:${role}`;
}

function makeNonce(): string {
  return randomBytes(16).toString("hex");
}

function makeToken(): string {
  return randomBytes(24).toString("base64url");
}

export function buildAuthMessage(address: string, role: ActingRole, nonce: string): string {
  return [
    "Escrow Wallet Authentication",
    `Address: ${address}`,
    `Role: ${role}`,
    `Nonce: ${nonce}`,
    "By signing this message, you confirm wallet ownership for this session.",
  ].join("\n");
}

export function createChallenge(address: string, role: ActingRole): ChallengeRecord {
  const nonce = makeNonce();
  const now = Date.now();
  const challenge: ChallengeRecord = {
    address,
    role,
    nonce,
    message: buildAuthMessage(address, role, nonce),
    expiresAt: now + challengeTtlMs,
  };
  challengeStore.set(challengeKey(address, role), challenge);
  return challenge;
}

export function consumeChallenge(address: string, role: ActingRole, nonce: string): ChallengeRecord | null {
  const key = challengeKey(address, role);
  const challenge = challengeStore.get(key);
  if (!challenge) return null;
  if (challenge.expiresAt <= Date.now()) {
    challengeStore.delete(key);
    return null;
  }
  if (challenge.nonce !== nonce) {
    return null;
  }
  challengeStore.delete(key);
  return challenge;
}

export function createSession(address: string, role: ActingRole): SessionRecord {
  const token = makeToken();
  const now = Date.now();
  const session: SessionRecord = {
    token,
    address,
    role,
    createdAt: now,
    expiresAt: now + sessionTtlMs,
  };
  sessionStore.set(token, session);
  return session;
}

export function getSession(token: string): SessionRecord | null {
  const session = sessionStore.get(token);
  if (!session) return null;
  if (session.expiresAt <= Date.now()) {
    sessionStore.delete(token);
    return null;
  }
  return session;
}

export function deleteSession(token: string): void {
  sessionStore.delete(token);
}
