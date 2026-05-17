import { randomBytes } from "node:crypto";
import {
  computeOverviewCounts,
  matchesBucket,
  statusesForClientBucket,
  statusesForFreelancerBucket,
  type ClientBucket,
  type FreelancerBucket,
} from "../domain/buckets.js";
import { nextActionHint } from "../domain/nextActionHint.js";
import type {
  ActingRole,
  DashboardOverview,
  JobListItem,
  JobRecord,
  JobStatus,
  PaginatedJobs,
} from "../domain/types.js";

const jobs = new Map<string, JobRecord>();

function id(prefix: string): string {
  return `${prefix}_${randomBytes(6).toString("hex")}`;
}

function now(): number {
  return Date.now();
}

function toListItem(job: JobRecord, role: ActingRole): JobListItem {
  return {
    id: job.id,
    title: job.title,
    status: job.status,
    clientAddress: job.clientAddress,
    freelancerAddress: job.freelancerAddress,
    budgetCkb: job.budgetCkb,
    updatedAt: job.updatedAt,
    nextActionHint: nextActionHint(job.status, role),
  };
}

function seedTemplates(): Omit<JobRecord, "id" | "createdAt" | "updatedAt" | "clientAddress" | "freelancerAddress">[] {
  const delivery = new Date(Date.now() + 30 * 86400000).toISOString();
  return [
    {
      title: "CKB escrow dashboard UI",
      description: "Build client and freelancer dashboards with workspace integration.",
      status: "funded",
      budgetCkb: "1200",
      deliveryDateIso: delivery,
    },
    {
      title: "Smart contract integration tests",
      description: "Extend integration runner for fund and release paths.",
      status: "submitted",
      budgetCkb: "800",
      deliveryDateIso: delivery,
    },
    {
      title: "Landing page copy refresh",
      description: "Update marketing pages for escrow trust model.",
      status: "open",
      budgetCkb: "400",
      deliveryDateIso: delivery,
    },
    {
      title: "Dispute moderation playbook",
      description: "Document admin flows for MVP dispute resolution.",
      status: "disputed",
      budgetCkb: "600",
      deliveryDateIso: delivery,
    },
    {
      title: "Wallet onboarding flow",
      description: "Completed connect + role selection improvements.",
      status: "completed",
      budgetCkb: "500",
      deliveryDateIso: delivery,
    },
  ];
}

export function ensureDevJobsForAddress(address: string, role: ActingRole): void {
  if (process.env.NODE_ENV === "production") return;

  const hasAny =
    role === "client"
      ? [...jobs.values()].some((j) => j.clientAddress === address)
      : [...jobs.values()].some((j) => j.freelancerAddress === address);

  if (hasAny) return;

  const peerAddress = `ckt1q${randomBytes(10).toString("hex")}`;
  const t = now();

  for (const template of seedTemplates()) {
    const job: JobRecord = {
      ...template,
      id: id("job"),
      clientAddress: role === "client" ? address : peerAddress,
      freelancerAddress:
        template.status === "open" ? null : role === "freelancer" ? address : peerAddress,
      createdAt: t,
      updatedAt: t,
    };
    jobs.set(job.id, job);
  }
}

function listForAddress(address: string, role: ActingRole): JobRecord[] {
  ensureDevJobsForAddress(address, role);
  return [...jobs.values()].filter((j) =>
    role === "client" ? j.clientAddress === address : j.freelancerAddress === address,
  );
}

export function getOverview(address: string, role: ActingRole): DashboardOverview {
  const mine = listForAddress(address, role);
  return computeOverviewCounts(mine, role);
}

function paginateJobs(items: JobListItem[], bucket: string, page: number, limit: number): PaginatedJobs {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * limit;
  return {
    bucket,
    page: safePage,
    limit,
    total,
    totalPages,
    jobs: items.slice(start, start + limit),
  };
}

export function listClientJobs(
  address: string,
  bucket: ClientBucket,
  page: number,
  limit: number,
): PaginatedJobs {
  const statuses = statusesForClientBucket(bucket);
  const filtered = listForAddress(address, "client")
    .filter((j) => matchesBucket(j.status, statuses))
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map((j) => toListItem(j, "client"));

  return paginateJobs(filtered, bucket, page, limit);
}

export function listFreelancerJobs(
  address: string,
  bucket: FreelancerBucket,
  page: number,
  limit: number,
): PaginatedJobs {
  const statuses = statusesForFreelancerBucket(bucket);
  const filtered = listForAddress(address, "freelancer")
    .filter((j) => matchesBucket(j.status, statuses))
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map((j) => toListItem(j, "freelancer"));

  return paginateJobs(filtered, bucket, page, limit);
}

export function getJobById(jobId: string): JobRecord | null {
  return jobs.get(jobId) ?? null;
}

export function createJob(input: {
  clientAddress: string;
  title: string;
  description: string;
  budgetCkb: string;
  deliveryDateIso: string;
  status?: JobStatus;
}): JobRecord {
  const t = now();
  const job: JobRecord = {
    id: id("job"),
    title: input.title,
    description: input.description,
    status: input.status ?? "draft",
    clientAddress: input.clientAddress,
    freelancerAddress: null,
    budgetCkb: input.budgetCkb,
    deliveryDateIso: input.deliveryDateIso,
    createdAt: t,
    updatedAt: t,
  };
  jobs.set(job.id, job);
  return job;
}
