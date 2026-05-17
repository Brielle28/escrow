import type { NextFunction, Request, Response } from "express";
import { getAdminSession } from "../auth/adminStore.js";
import { getSession } from "../auth/store.js";
import type { ActingRole } from "../domain/types.js";

export type AuthedRequest = Request & {
  session?: { address: string; role: ActingRole; token: string };
  adminSession?: { address: string; token: string };
};

function readBearer(req: Request): string | null {
  const header = req.header("authorization");
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  return token;
}

export function requirePartyAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const token = readBearer(req);
  if (!token) {
    res.status(401).json({ error: "Missing bearer token." });
    return;
  }
  const session = getSession(token);
  if (!session) {
    res.status(401).json({ error: "Session expired or invalid." });
    return;
  }
  req.session = { address: session.address, role: session.role, token: session.token };
  next();
}

export function requireRole(role: ActingRole) {
  return (req: AuthedRequest, res: Response, next: NextFunction): void => {
    if (!req.session || req.session.role !== role) {
      res.status(403).json({ error: "Wrong role for this resource." });
      return;
    }
    next();
  };
}

export function requireAdminAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const token = readBearer(req);
  if (!token) {
    res.status(401).json({ error: "Missing bearer token." });
    return;
  }
  const session = getAdminSession(token);
  if (!session) {
    res.status(401).json({ error: "Admin session expired or invalid." });
    return;
  }
  req.adminSession = { address: session.address, token: session.token };
  next();
}
