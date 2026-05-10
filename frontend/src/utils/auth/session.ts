export type ActingRole = "client" | "freelancer";

export type WalletSession = {
  token: string;
  address: string;
  role: ActingRole;
  createdAt: number;
  expiresAt: number;
};

type ChallengeResponse = {
  nonce: string;
  message: string;
  expiresAt: number;
};

const storageKey = "escrow.walletSession";
/** In dev, empty string = same-origin `/api` (see Vite proxy). Override with VITE_API_BASE_URL for a remote API. */
const apiBase = import.meta.env.VITE_API_BASE_URL ?? "";

function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return apiBase ? `${apiBase.replace(/\/$/, "")}${p}` : p;
}

async function fetchJson(input: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch (e) {
    const hint =
      "Cannot reach the auth server. Start it from the repo: pnpm --filter escrow-backend dev (listens on port 8787 by default).";
    if (e instanceof TypeError && (e.message === "Failed to fetch" || e.name === "TypeError")) {
      throw new Error(`${hint} (${e.message})`);
    }
    throw e;
  }
}

export function loadWalletSession(): WalletSession | null {
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as WalletSession;
    if (!parsed.token || !parsed.address || !parsed.role) return null;
    if (parsed.expiresAt <= Date.now()) {
      window.localStorage.removeItem(storageKey);
      return null;
    }
    return parsed;
  } catch {
    window.localStorage.removeItem(storageKey);
    return null;
  }
}

export function saveWalletSession(session: WalletSession): void {
  window.localStorage.setItem(storageKey, JSON.stringify(session));
}

export async function clearWalletSession(token?: string): Promise<void> {
  if (token) {
    await fetchJson(apiUrl("/api/auth/session"), {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => undefined);
  }
  window.localStorage.removeItem(storageKey);
}

async function createChallenge(address: string, role: ActingRole): Promise<ChallengeResponse> {
  const response = await fetchJson(apiUrl("/api/auth/challenge"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ address, role }),
  });
  if (!response.ok) throw new Error("Failed to create auth challenge");
  return (await response.json()) as ChallengeResponse;
}

function normalizeWalletSignature(sig: unknown): string {
  if (typeof sig === "string") {
    const t = sig.trim();
    if (t.length > 0) return t;
  }
  if (sig instanceof Uint8Array) {
    const hex = Array.from(sig)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return `0x${hex}`;
  }
  if (Array.isArray(sig) && sig.every((x) => typeof x === "number")) {
    return `0x${sig.map((n) => Number(n).toString(16).padStart(2, "0")).join("")}`;
  }
  if (sig && typeof sig === "object") {
    const o = sig as Record<string, unknown>;
    if (typeof o.signature === "string") return o.signature.trim();
    if (typeof o.sig === "string") return o.sig.trim();
    if (Array.isArray(o.signature)) return normalizeWalletSignature(o.signature);
    if (o.signature instanceof Uint8Array) return normalizeWalletSignature(o.signature);
  }
  throw new Error(
    "Wallet returned an unsupported signature format. Try again or use another wallet.",
  );
}

async function verifyChallenge(args: {
  address: string;
  role: ActingRole;
  nonce: string;
  signature: string;
}): Promise<WalletSession> {
  const response = await fetchJson(apiUrl("/api/auth/verify"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(args),
  });
  if (!response.ok) {
    let detail = "Wallet signature verification failed";
    try {
      const errBody = (await response.json()) as { error?: string };
      if (typeof errBody.error === "string" && errBody.error.length > 0) {
        detail = errBody.error;
      }
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }
  const data = (await response.json()) as {
    token: string;
    session: { address: string; role: ActingRole; createdAt: number; expiresAt: number };
  };
  return { token: data.token, ...data.session };
}

export async function establishWalletSession(args: {
  address: string;
  role: ActingRole;
  signMessage: (message: string) => Promise<unknown>;
}): Promise<WalletSession> {
  const challenge = await createChallenge(args.address, args.role);
  const rawSig = await args.signMessage(challenge.message);
  const signature = normalizeWalletSignature(rawSig);
  const session = await verifyChallenge({
    address: args.address,
    role: args.role,
    nonce: challenge.nonce,
    signature,
  });
  saveWalletSession(session);
  return session;
}
