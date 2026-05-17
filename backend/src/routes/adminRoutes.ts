import { Router } from "express";
import {
  createAdminSession,
  deleteAdminSession,
  getAdminSession,
  isAdminAddress,
} from "../auth/adminStore.js";
import type { AuthedRequest } from "../middleware/auth.js";
import { requireAdminAuth } from "../middleware/auth.js";

export const adminRoutes = Router();

type AdminVerifyBody = {
  address?: unknown;
};

adminRoutes.post("/api/admin/auth/verify", (req, res) => {
  const body = req.body as AdminVerifyBody;
  const address = typeof body.address === "string" ? body.address.trim() : "";
  if (!address) {
    res.status(400).json({ error: "Address required." });
    return;
  }
  if (!isAdminAddress(address)) {
    res.status(403).json({ error: "Wallet is not on the admin allowlist." });
    return;
  }
  const session = createAdminSession(address);
  res.json({
    token: session.token,
    session: {
      address: session.address,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
    },
  });
});

adminRoutes.get("/api/admin/session", requireAdminAuth, (req: AuthedRequest, res) => {
  const session = getAdminSession(req.adminSession!.token);
  if (!session) {
    res.status(401).json({ error: "Session expired." });
    return;
  }
  res.json({
    address: session.address,
    createdAt: session.createdAt,
    expiresAt: session.expiresAt,
  });
});

adminRoutes.delete("/api/admin/session", requireAdminAuth, (req: AuthedRequest, res) => {
  deleteAdminSession(req.adminSession!.token);
  res.status(204).send();
});

adminRoutes.get("/api/admin/overview", requireAdminAuth, (_req, res) => {
  res.json({
    openDisputes: 3,
    staleDisputes: 1,
    resolvedLast7d: 5,
    pendingEvidence: 2,
  });
});
