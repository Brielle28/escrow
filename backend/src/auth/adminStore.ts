import { randomBytes } from "node:crypto";
import type { AdminSessionRecord } from "../domain/types.js";

const sessionTtlMs = 8 * 60 * 60 * 1000;
const adminSessions = new Map<string, AdminSessionRecord>();

function makeToken(): string {
  return randomBytes(24).toString("base64url");
}

export function getAdminAllowlist(): Set<string> {
  const raw = process.env.ADMIN_ADDRESSES ?? "";
  return new Set(
    raw
      .split(",")
      .map((a) => a.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isAdminAddress(address: string): boolean {
  const list = getAdminAllowlist();
  if (list.size === 0 && process.env.NODE_ENV !== "production") {
    return true;
  }
  return list.has(address.toLowerCase());
}

export function createAdminSession(address: string): AdminSessionRecord {
  const token = makeToken();
  const t = Date.now();
  const session: AdminSessionRecord = {
    token,
    address,
    createdAt: t,
    expiresAt: t + sessionTtlMs,
  };
  adminSessions.set(token, session);
  return session;
}

export function getAdminSession(token: string): AdminSessionRecord | null {
  const session = adminSessions.get(token);
  if (!session) return null;
  if (session.expiresAt <= Date.now()) {
    adminSessions.delete(token);
    return null;
  }
  return session;
}

export function deleteAdminSession(token: string): void {
  adminSessions.delete(token);
}
