import express, { type Request } from "express";
import cors from "cors";
import { consumeChallenge, createChallenge, createSession, deleteSession, getSession } from "./auth/store.js";
import type { ActingRole } from "./auth/types.js";

type ChallengeBody = {
  address?: unknown;
  role?: unknown;
};

type VerifyBody = {
  address?: unknown;
  role?: unknown;
  nonce?: unknown;
  signature?: unknown;
};

function normalizeSignatureFromBody(raw: unknown): string | null {
  if (typeof raw === "string") {
    const s = raw.trim();
    return s.length ? s : null;
  }
  if (Array.isArray(raw) && raw.every((x) => typeof x === "number" && Number.isFinite(x))) {
    return bytesTo0xHex(Uint8Array.from(raw));
  }
  return null;
}

function bytesTo0xHex(bytes: Uint8Array): string {
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i]!.toString(16).padStart(2, "0");
  }
  return `0x${hex}`;
}

function normalizeRole(role: unknown): ActingRole | null {
  return role === "client" || role === "freelancer" ? role : null;
}

function normalizeAddress(address: unknown): string | null {
  if (typeof address !== "string") return null;
  const trimmed = address.trim();
  if (!trimmed) return null;
  return trimmed;
}

function readBearerToken(req: Request): string | null {
  const header = req.header("authorization");
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  return token;
}

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:5173",
    credentials: false,
  }),
);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/challenge", (req, res) => {
  const body = req.body as ChallengeBody;
  const address = normalizeAddress(body.address);
  const role = normalizeRole(body.role);

  if (!address || !role) {
    res.status(400).json({ error: "Invalid address or role." });
    return;
  }

  const challenge = createChallenge(address, role);
  res.json({
    address: challenge.address,
    role: challenge.role,
    nonce: challenge.nonce,
    message: challenge.message,
    expiresAt: challenge.expiresAt,
  });
});

app.post("/api/auth/verify", (req, res) => {
  const body = req.body as VerifyBody;
  const address = normalizeAddress(body.address);
  const role = normalizeRole(body.role);
  const nonce = typeof body.nonce === "string" ? body.nonce : "";
  const signature = normalizeSignatureFromBody(body.signature);

  if (!address || !role || !nonce || !signature) {
    res.status(400).json({
      error:
        "Missing required auth fields. Ensure the wallet returned a signature (string or hex bytes).",
    });
    return;
  }

  const challenge = consumeChallenge(address, role, nonce);
  if (!challenge) {
    res.status(401).json({ error: "Challenge invalid or expired. Request a new challenge from /api/auth/challenge." });
    return;
  }

  // TODO: Verify signature cryptographically against challenge.message and address.
  // For now, we require a non-trivial signature payload from the connected wallet.
  if (signature.length < 8) {
    res.status(401).json({ error: "Signature rejected." });
    return;
  }

  const session = createSession(address, role);
  res.json({
    token: session.token,
    session: {
      address: session.address,
      role: session.role,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
    },
  });
});

app.get("/api/auth/session", (req, res) => {
  const token = readBearerToken(req);
  if (!token) {
    res.status(401).json({ error: "Missing bearer token." });
    return;
  }

  const session = getSession(token);
  if (!session) {
    res.status(401).json({ error: "Session expired or invalid." });
    return;
  }

  res.json({
    address: session.address,
    role: session.role,
    createdAt: session.createdAt,
    expiresAt: session.expiresAt,
  });
});

app.delete("/api/auth/session", (req, res) => {
  const token = readBearerToken(req);
  if (token) {
    deleteSession(token);
  }
  res.status(204).send();
});

const port = Number(process.env.PORT ?? 8787);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`escrow-backend auth server listening on :${port}`);
});
