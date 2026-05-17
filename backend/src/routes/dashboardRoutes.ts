import { Router } from "express";
import { parseClientBucket, parseFreelancerBucket } from "../domain/buckets.js";
import type { AuthedRequest } from "../middleware/auth.js";
import { requirePartyAuth, requireRole } from "../middleware/auth.js";
import { getOverview, listClientJobs, listFreelancerJobs } from "../store/jobsStore.js";

function parsePage(raw: unknown): number {
  const n = Number(raw);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

function parseLimit(raw: unknown): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 1) return 20;
  return Math.min(50, Math.floor(n));
}

export const dashboardRoutes = Router();

dashboardRoutes.get(
  "/api/dashboard/client/overview",
  requirePartyAuth,
  requireRole("client"),
  (req: AuthedRequest, res) => {
    const overview = getOverview(req.session!.address, "client");
    res.json(overview);
  },
);

dashboardRoutes.get(
  "/api/dashboard/client/jobs",
  requirePartyAuth,
  requireRole("client"),
  (req: AuthedRequest, res) => {
    const bucket = parseClientBucket(typeof req.query.bucket === "string" ? req.query.bucket : undefined);
    const page = parsePage(req.query.page);
    const limit = parseLimit(req.query.limit);
    res.json(listClientJobs(req.session!.address, bucket, page, limit));
  },
);

dashboardRoutes.get(
  "/api/dashboard/freelancer/overview",
  requirePartyAuth,
  requireRole("freelancer"),
  (req: AuthedRequest, res) => {
    const overview = getOverview(req.session!.address, "freelancer");
    res.json(overview);
  },
);

dashboardRoutes.get(
  "/api/dashboard/freelancer/jobs",
  requirePartyAuth,
  requireRole("freelancer"),
  (req: AuthedRequest, res) => {
    const bucket = parseFreelancerBucket(typeof req.query.bucket === "string" ? req.query.bucket : undefined);
    const page = parsePage(req.query.page);
    const limit = parseLimit(req.query.limit);
    res.json(listFreelancerJobs(req.session!.address, bucket, page, limit));
  },
);
