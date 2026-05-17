# Spec: Plan A — Escrow Workspace

**Version:** 0.2 (draft)  
**Status:** Ready for implementation  
**Parent:** [`plan/V1.md`](../plan/V1.md) — Plan A  
**Related:** [`plan/frontend/frontend-implementation-plan.md`](../plan/frontend/frontend-implementation-plan.md) §5  

---

## 1. Summary

Build the **escrow workspace** as a **detail view inside each role’s dashboard**, not a standalone top-level app area. Clients and freelancers work on **many jobs** via a **paginated job list** on the dashboard; selecting a row opens that job’s workspace (timeline, milestones, action panel) without leaving the dashboard shell.

| Role | Dashboard (list + pagination) | Workspace (one job) |
|------|------------------------------|---------------------|
| Client | `/dashboard/client` | `/dashboard/client/jobs/:jobId` |
| Freelancer | `/dashboard/freelancer` | `/dashboard/freelancer/jobs/:jobId` |
| Admin | `/admin/disputes` (inbox) | `/admin/jobs/:jobId` (read-only workspace; see §4) |

**Admin is not added to the client or freelancer dashboard.** Admin enters only when a **dispute (or support case)** exists, via the admin area, with optional read-only access to the same workspace UI.

Backend job/workspace APIs stay **`/api/jobs/:jobId/...`** (role-agnostic). Frontend routes are role-scoped for navigation, grouping, and pagination.

This spec covers **dashboard list APIs**, **workspace read APIs**, **milestone writes**, **membership authorization**, and **frontend layout/components**. It does **not** change on-chain contract logic or implement wallet transaction signing (that is **Plan E**).

---

## 2. Goals and non-goals

### Goals

| ID | Goal |
|----|------|
| G1 | Client dashboard lists jobs with **pagination** and **status buckets**; opening a row shows embedded workspace |
| G2 | Freelancer dashboard same pattern at `/dashboard/freelancer` |
| G3 | Workspace UI (header, timeline, milestones, action panel) renders inside dashboard layout with back link to list |
| G4 | Timeline shows lifecycle and chain-anchor events (newest first), with explorer links when `txHash` is present |
| G5 | Action panel shows **one primary CTA** (or informational state) from server `permissions`; disabled actions include **reasons** |
| G6 | Freelancer can update milestone status; each update creates a **timeline echo** event |
| G7 | **Concluded** jobs remain in dashboard **Completed** bucket (paginated); workspace is **read-only**, not deleted |
| G8 | Admin accesses job context only via **admin routes** after dispute/case creation; read-only workspace + banner |
| G9 | Non-members receive **403** (API) or access denied UI, not partial job data |

### Non-goals (explicitly out of scope for Plan A)

| Item | Handled in |
|------|------------|
| Rust / CKB contract changes | Never in Plan A |
| Building, signing, broadcasting fund/release/dispute/timeout txs | Plan E |
| Chat message send/receive | Plan B (workspace may show **placeholder** chat shell) |
| Post job, apply, match, terms confirm flows | Plan C (workspace **consumes** resulting job records) |
| Dispute creation UI and admin console | Plans F / D |
| Persistent SQLite (recommended before prod; Plan A may use JSON file store for speed) | V1 foundations |

---

## 3. Prerequisites (minimum before Plan A coding)

Plan A can start in parallel with foundations, but **shipping** requires:

1. **Bearer auth** — existing `POST /api/auth/verify` session; all workspace routes use `Authorization: Bearer <token>`.
2. **Job persistence** — at least one store with seed jobs in states `Matched`, `TermsConfirmed`, `Funded`, `Submitted` for manual QA.
3. **Shared types** — `JobStatus`, `WorkspacePayload`, `TimelineEvent`, `Milestone`, `WorkspacePermissions` in `backend/src/domain/` (frontend mirrors via import path or duplicated types until `packages/shared` exists).
4. **Frontend `apiClient`** — attaches bearer token, surfaces `401` / `403` / `404`.

Optional for Plan A MVP: full signature verification (still required before production).

---

## 4. User-facing behavior

### 4.0 Dashboard-first navigation (required)

The workspace is **always reached from the dashboard** (or deep-linked into the matching dashboard path). This keeps **grouping and pagination** on the list view and the **full workspace** on the detail view.

```text
┌─────────────────────────────────────────────────────────────┐
│  DashboardLayout (nav, wallet, role badge)                   │
├─────────────────────────────────────────────────────────────┤
│  LIST (default)              │  DETAIL (when job selected)   │
│  • KPI strip                 │  • ← Back to jobs             │
│  • Tabs/buckets              │  • WorkspaceHeader            │
│  • Paginated job table       │  • Timeline | Ms | Actions    │
│  • [Open] per row →          │                               │
└─────────────────────────────────────────────────────────────┘
```

**Client** — `/dashboard/client`

| Bucket tab | Jobs included (examples) | Pagination |
|------------|--------------------------|------------|
| `needs_action` | Awaiting funding, review submission, terms | `page`, `limit` (default 20) |
| `active` | `funded`, in progress | same |
| `disputed` | `disputed`, `resolved` (open dispute) | same |
| `completed` | `completed`, `timeout_settled` | same |

Row actions: **Open** → `/dashboard/client/jobs/:jobId`.

**Freelancer** — `/dashboard/freelancer`

| Bucket tab | Jobs included | Pagination |
|------------|---------------|------------|
| `active` | `funded`, assigned work | yes |
| `applications` | Applied, not chosen (Plan C; list only in Plan A if seeded) | yes |
| `disputed` | Disputes involving freelancer | yes |
| `completed` | Terminal jobs | yes |

Row actions: **Open** → `/dashboard/freelancer/jobs/:jobId`.

**Optional UX (recommended):** On wide screens, **master–detail** — list left (40%), workspace right (60%) when `jobId` is in the URL; on mobile, list OR detail full screen with back navigation.

**Legacy redirect:** `GET /workspace/:jobId` may **302** to the correct dashboard path based on session role and membership (implement when convenient).

### 4.1 Who can access

| Principal | Dashboard | Workspace route |
|-----------|-----------|-----------------|
| Job `clientAddress` | `/dashboard/client` | `/dashboard/client/jobs/:jobId` |
| Job `freelancerAddress` | `/dashboard/freelancer` | `/dashboard/freelancer/jobs/:jobId` |
| Admin allowlist | `/admin` (not client/freelancer dashboard) | `/admin/jobs/:jobId` read-only |
| Anyone else | Denied / empty list | **403** on API |
| Wallet not connected | Redirect `/connect?returnUrl=…` | Same `returnUrl` to intended dashboard path |

Jobs in status `open` (no freelancer) **must not** expose workspace; show only on client recruiting views (Plan C), not in workspace buckets.

### 4.1.1 Concluded jobs (not removed)

When a job reaches a **terminal** status (`completed`, `timeout_settled`, or `resolved` after dispute):

| Surface | Behavior |
|---------|----------|
| Dashboard list | Job **moves** from `active` / `needs_action` to **`completed` bucket**; still paginated |
| Workspace | Still openable from Completed tab; **`permissions.readOnly`** or terminal flag; composer off; primary action **View settlement** |
| History | All timeline events **retained** (`GET /api/history/job/:jobId` — Plan F) |
| Data store | Job row **never deleted** in V1 |

Nothing is removed from monitoring — it is **reclassified** so active tabs stay actionable.

### 4.2 Page layout

**Desktop (≥1024px):** CSS grid or flex with approximate columns **30% | 40% | 30%**.

```
┌─────────────────────────────────────────────────────────────┐
│ WorkspaceHeader (title, badges, parties, network, links)     │
├──────────────┬─────────────────────────┬────────────────────┤
│ Timeline     │ Milestones + Chat slot  │ ActionPanel        │
│ (scroll)     │ (scroll)                │ (sticky)           │
└──────────────┴─────────────────────────┴────────────────────┘
```

**Mobile (<1024px):** stack order:

1. **Action panel** — collapsed summary card, expandable.
2. **Tabs:** Timeline | Milestones | Chat (chat may be “Coming in Plan B” stub).
3. **Agreement snapshot** — collapsible below header or inside center column.

### 4.3 Header contents

| Element | Source |
|---------|--------|
| Job title | `workspace.job.title` |
| Status badge | `workspace.job.status` |
| Viewer role badge | Session role or `"admin"` |
| Client address | Truncated + copy |
| Freelancer address | Truncated + copy, or “Not assigned” |
| Network indicator | CCC + env (`VITE_CKB_NETWORK`) |
| Link: Settlement | Visible when `status` ∈ terminal or post-submit states (stub link OK) |
| Link: Job history | `/history/job/:jobId` (stub OK); back link → dashboard list with preserved `?bucket=&page=` |

### 4.4 Timeline rules

- **Sort:** `createdAt` descending (newest first).
- **Pin card (optional V1.0.1):** “Current phase” summary at top — can defer.
- **Event types** (see §6.3): lifecycle, milestone, chain.
- **Do not** embed full chat bodies; at most `relatedMessageId` link for Plan B.

### 4.5 Action panel rules

- Inputs: `permissions` from API (preferred) **or** derive on client from `status` + `role` using the same pure function as backend tests.
- Exactly **one** `primaryAction` with `kind`: `button` | `link` | `info`.
- `secondaryActions[]` max 3 for V1.
- Every disabled action has `disabledReason: string` (non-empty).
- If `pendingTx` is set, primary action is blocked with reason “Transaction confirming…”.

**Plan A stub for chain actions:** Primary buttons for `fund` | `release` | `dispute` | `timeout` may call `onClick` that opens a toast: “Transaction flow ships in Plan E” — **only after** permissions say they are enabled.

### 4.6 Milestones

- Default seed: 2–3 milestones per demo job.
- Status enum: `planned` | `in_progress` | `done`.
- **Freelancer** may `PATCH` milestone status.
- **Client** read-only on milestones in V1 (no approve flow unless added later).
- On successful PATCH → append `timeline` event `milestone_updated`.

### 4.7 Agreement snapshot

- Shown when `termsSnapshot` is non-null (after terms confirmed).
- Collapsible panel: budget, delivery date, escrow timeout, revision policy, confirmation timestamps.
- Label: **Frozen terms** — edits not allowed from workspace.

### 4.8 Admin access (how admin is “added”)

Admin is **not** a third dashboard alongside client and freelancer. Admin is **attached to a job** when an **issue is raised** (typically `disputed`).

```text
Normal job (no dispute)
  Client / Freelancer dashboards only
  Admin: no routine access (optional future inspector)

Dispute opened (Plan F)
  1. Party submits dispute → job.status = disputed
  2. Backend creates dispute record + timeline lifecycle.disputed
  3. Job appears in admin dispute inbox (not in party "active" tab)
  4. Admin opens /admin/disputes/:disputeId (case console)
  5. From console: "View job workspace" → /admin/jobs/:jobId
```

| Step | System behavior |
|------|-----------------|
| **Eligibility** | Admin wallet address in server allowlist (`ADMIN_ADDRESSES` env) |
| **Auth** | Separate admin session or admin flag on verify; **never** use client/freelancer role token for write |
| **Inbox** | `GET /api/admin/disputes` — paginated queue (Plan D); Plan A may stub empty inbox |
| **Workspace** | `GET /api/jobs/:jobId/workspace` with admin principal → `permissions.readOnly = true`, `viewerRole = "admin"` |
| **UI** | `AdminJobWorkspacePage` at `/admin/jobs/:jobId`; banner: *“Viewing as admin. Escrow actions are disabled.”* |
| **After resolution** | Admin records decision; job may → `resolved` / `completed`; parties see outcome in **their** dashboard `completed` or `disputed` bucket; admin case **closed** |

**What admin can do in Plan A workspace (read-only):**

- View timeline, parties, frozen terms, milestones, chat (when Plan B exists).
- Cannot PATCH milestones, send chat, or trigger fund/release/dispute.

**What admin cannot do:**

- Appear in client/freelancer job lists.
- Act as client or freelancer on the same job without a separate wallet (product forbid).

### 4.9 Admin read-only UI rules

- `permissions.readOnly === true`
- Banner at top of workspace (all three regions).
- Link back to **Dispute console** (`/admin/disputes/:disputeId`), not client dashboard.
- API returns full timeline for moderation.

---

## 5. Domain model

### 5.1 Job status enum

```ts
type JobStatus =
  | "open"
  | "matched"
  | "terms_confirmed"
  | "funding_pending"
  | "funded"
  | "submitted"
  | "completed"
  | "disputed"
  | "resolved"
  | "timeout_eligible"
  | "timeout_settled";
```

Workspace is **allowed** when `status` is **not** `open` and `freelancerAddress` is set.

### 5.2 Core entities

```ts
type MilestoneStatus = "planned" | "in_progress" | "done";

type Milestone = {
  id: string;
  jobId: string;
  title: string;
  dueDateIso: string | null;
  status: MilestoneStatus;
  sortOrder: number;
  updatedAt: number;
};

type TermsSnapshot = {
  budgetShannons: string; // string integer
  deliveryDateIso: string;
  escrowTimeoutHours: number;
  revisionPolicy: string | null;
  clientConfirmedAt: number | null;
  freelancerConfirmedAt: number | null;
};

type JobRecord = {
  id: string;
  title: string;
  description: string;
  status: JobStatus;
  clientAddress: string;
  freelancerAddress: string | null;
  termsSnapshot: TermsSnapshot | null;
  pendingTx: PendingTx | null;
  createdAt: number;
  updatedAt: number;
};

type PendingTx = {
  action: "fund" | "release" | "dispute" | "timeout";
  txHash: string;
  startedAt: number;
};
```

### 5.3 Permissions object (server-authored)

The backend is the source of truth for what the UI may offer.

```ts
type WorkspaceActionKind =
  | "confirm_terms"
  | "fund_escrow"
  | "submit_work"
  | "release"
  | "open_dispute"
  | "request_revision"
  | "execute_timeout"
  | "view_settlement";

type WorkspaceAction = {
  id: string;
  label: string;
  kind: WorkspaceActionKind;
  enabled: boolean;
  disabledReason: string | null;
  variant: "primary" | "secondary" | "danger";
};

type WorkspacePermissions = {
  readOnly: boolean;
  viewerRole: "client" | "freelancer" | "admin";
  primaryAction: WorkspaceAction | null;
  secondaryActions: WorkspaceAction[];
  canUpdateMilestones: boolean;
  canSendChat: boolean; // false in Plan A unless Plan B merged
};
```

---

## 6. API specification

Base path: `/api`  
Auth: `Authorization: Bearer <token>` on all routes below.

### 6.0 Dashboard job lists (pagination)

Role-scoped list endpoints power dashboard tabs. Workspace detail still uses §6.1.

#### `GET /api/dashboard/client/jobs`

**Query:**

| Param | Default | Description |
|-------|---------|-------------|
| `bucket` | `active` | `needs_action` \| `active` \| `disputed` \| `completed` |
| `page` | 1 | 1-based page index |
| `limit` | 20 | Page size (max 50) |

**Response `200`:**

```json
{
  "bucket": "active",
  "page": 1,
  "limit": 20,
  "total": 47,
  "totalPages": 3,
  "jobs": [
    {
      "id": "job_demo_funded",
      "title": "Landing page in React",
      "status": "funded",
      "freelancerAddress": "ckt1...",
      "updatedAt": 1710001000000,
      "nextActionHint": "Monitor progress"
    }
  ]
}
```

Filter: `clientAddress` === session address. Map `bucket` → status sets in backend (single function, unit tested).

#### `GET /api/dashboard/freelancer/jobs`

Same shape; filter `freelancerAddress` === session address. Buckets: `active` \| `applications` \| `disputed` \| `completed`.

#### Bucket → status mapping (reference)

| Client bucket | Statuses included |
|---------------|-------------------|
| `needs_action` | `matched`, `terms_confirmed`, `funding_pending`, `submitted` |
| `active` | `funded` |
| `disputed` | `disputed`, `resolved` |
| `completed` | `completed`, `timeout_settled` |

| Freelancer bucket | Statuses included |
|-------------------|-------------------|
| `active` | `funded`, `submitted` (waiting on client) |
| `applications` | application records (Plan C) |
| `disputed` | `disputed`, `resolved` |
| `completed` | `completed`, `timeout_settled` |

### 6.1 `GET /api/jobs/:jobId/workspace`

**Purpose:** Single payload to render the workspace shell.

**Membership:** client, freelancer, or admin.

**Response `200`:**

```json
{
  "job": {
    "id": "job_demo_funded",
    "title": "Landing page in React",
    "description": "...",
    "status": "funded",
    "clientAddress": "ckt1...",
    "freelancerAddress": "ckt1...",
    "termsSnapshot": { },
    "pendingTx": null,
    "createdAt": 1710000000000,
    "updatedAt": 1710001000000
  },
  "milestones": [
    {
      "id": "ms_1",
      "jobId": "job_demo_funded",
      "title": "Wireframes",
      "dueDateIso": "2026-06-01T00:00:00.000Z",
      "status": "done",
      "sortOrder": 0,
      "updatedAt": 1710000500000
    }
  ],
  "permissions": {
    "readOnly": false,
    "viewerRole": "freelancer",
    "primaryAction": {
      "id": "submit_work",
      "label": "Submit work",
      "kind": "submit_work",
      "enabled": true,
      "disabledReason": null,
      "variant": "primary"
    },
    "secondaryActions": [],
    "canUpdateMilestones": true,
    "canSendChat": false
  }
}
```

**Errors:**

| Code | When |
|------|------|
| 401 | Missing/invalid token |
| 403 | Authenticated but not a member |
| 404 | Unknown job or workspace not available (`open` / no freelancer) |

### 6.2 `GET /api/jobs/:jobId/timeline`

**Purpose:** Paginated timeline for left column.

**Query:**

| Param | Default | Description |
|-------|---------|-------------|
| `limit` | 50 | Max events (cap 100) |
| `before` | — | ISO timestamp or event id cursor for older page |

**Response `200`:**

```json
{
  "events": [
    {
      "id": "evt_3",
      "jobId": "job_demo_funded",
      "type": "chain.fund_confirmed",
      "title": "Escrow funded",
      "body": "1,000 CKB locked in escrow.",
      "txHash": "0xabc...",
      "actorAddress": "ckt1...",
      "actorRole": "client",
      "createdAt": 1710000800000
    }
  ],
  "nextCursor": null
}
```

### 6.3 Timeline event types

| `type` | When created |
|--------|----------------|
| `lifecycle.matched` | Client selects freelancer |
| `lifecycle.terms_confirmed` | Both parties confirmed |
| `lifecycle.submitted` | Freelancer submits work |
| `lifecycle.completed` | Release confirmed (Plan E hook) |
| `lifecycle.disputed` | Dispute opened |
| `milestone.updated` | Milestone PATCH |
| `chain.fund_confirmed` | Plan E tx report |
| `chain.release_confirmed` | Plan E |
| `chain.timeout_executed` | Plan E |
| `system.note` | Admin or support (optional) |

### 6.4 `PATCH /api/jobs/:jobId/milestones/:milestoneId`

**Body:**

```json
{ "status": "in_progress" }
```

**Rules:**

- Caller must be job freelancer (not admin in V1).
- Job status must be `funded` or `submitted` (configurable; document in code).
- Valid transitions: `planned`→`in_progress`→`done` (allow `planned`→`done` for simplicity).

**Side effect:** Insert `milestone.updated` timeline row.

**Response `200`:** Updated `Milestone`.

### 6.5 Permission matrix (reference implementation)

Backend function `computeWorkspacePermissions(job, session, isAdmin)` — **must be unit tested**.

| status | client primary | freelancer primary |
|--------|----------------|-------------------|
| `matched` | Confirm terms (link) | Confirm terms (link) |
| `terms_confirmed` / `funding_pending` | Fund escrow | Waiting (info) |
| `funded` | Monitor (info) | Submit work |
| `submitted` | Release | Waiting (info) |
| `submitted` + pendingTx | Disabled + reason | Disabled + reason |
| `completed` / `timeout_settled` | View settlement | View settlement |
| `disputed` | Open dispute detail (link) | Same |

Secondary examples: client in `submitted` → `open_dispute`, `request_revision` (disabled with reason until Plan F).

---

## 7. Backend implementation guide

### 7.1 Suggested file layout

```text
backend/src/
  domain/
    types.ts
    jobStatus.ts
    permissions.ts      # computeWorkspacePermissions + tests
  store/
    jobsStore.ts          # CRUD + seed
    timelineStore.ts
  middleware/
    requireAuth.ts
    requireJobMember.ts
  routes/
    workspaceRoutes.ts
  server.ts               # mount routes
```

### 7.2 Middleware chain

```text
requireAuth → requireJobMember (or admin) → handler
```

`requireJobMember` attaches `req.job`, `req.membership: "client" | "freelancer" | "admin"`.

### 7.3 Seed data (development)

Provide `POST /api/dev/seed` **only when** `NODE_ENV=development`:

- `job_demo_matched` — status `matched`, 0 milestones optional
- `job_demo_funded` — status `funded`, 3 milestones, timeline prefilled
- `job_demo_submitted` — status `submitted`, for client release CTA testing

Document seed addresses matching two test wallets if available.

### 7.4 Explorer links

Backend may return `explorerUrl` on timeline events, or frontend builds from `txHash` + `VITE_EXPLORER_BASE_URL`. Prefer **frontend** build to avoid env duplication.

### 7.5 Contract / chain

- **No** imports from `escrowPayload` required for Plan A handlers.
- Timeline `chain.*` events may be inserted manually in seed data or via a stub `POST /api/dev/jobs/:id/events` in development.

---

## 8. Frontend implementation guide

### 8.1 Suggested file layout

```text
frontend/src/
  layouts/DashboardLayout.tsx
  pages/dashboard/
    ClientDashboardPage.tsx       # list + optional outlet
    ClientJobWorkspacePage.tsx    # workspace detail
    FreelancerDashboardPage.tsx
    FreelancerJobWorkspacePage.tsx
  pages/admin/
    AdminJobWorkspacePage.tsx     # read-only; Plan D adds dispute pages
  components/Dashboard/
    JobListTable.tsx
    JobBucketTabs.tsx
    JobListPagination.tsx
  components/Workspace/
    WorkspaceHeader.tsx
    WorkspaceTimeline.tsx
    WorkspaceTimelineEvent.tsx
    WorkspaceMilestones.tsx
    WorkspaceActionPanel.tsx
    WorkspaceAgreementSnapshot.tsx
    WorkspaceAccessDenied.tsx
    WorkspaceChatPlaceholder.tsx   # Plan B replaces
  hooks/
    useWorkspace.ts
    useWorkspaceTimeline.ts
  utils/Workspace/
    actionPanelCopy.ts
    explorerUrl.ts
  api/
    workspaceApi.ts
  guards/
    RequireJobMember.tsx           # wraps page; uses workspace fetch
```

### 8.2 Routing

Add to `AppRouter.tsx` (nested under `DashboardLayout`):

```ts
{
  path: "/dashboard/client",
  element: <DashboardLayout role="client" />,
  children: [
    { index: true, element: <ClientDashboardPage /> },
    { path: "jobs/:jobId", element: <ClientJobWorkspacePage /> },
  ],
},
{
  path: "/dashboard/freelancer",
  element: <DashboardLayout role="freelancer" />,
  children: [
    { index: true, element: <FreelancerDashboardPage /> },
    { path: "jobs/:jobId", element: <FreelancerJobWorkspacePage /> },
  ],
},
{
  path: "/admin/jobs/:jobId",
  element: <AdminJobWorkspacePage />,  // admin guard; read-only workspace
},
// Optional legacy redirect:
{ path: "/workspace/:jobId", element: <WorkspaceRedirect /> },
```

**Shared workspace component:** Export `EscrowWorkspaceView` from `components/Workspace/` — used by `ClientJobWorkspacePage`, `FreelancerJobWorkspacePage`, and `AdminJobWorkspacePage` (pass `backTo` and `readOnly` props).

**ClientJobWorkspacePage** flow:

1. `RequireWalletSession role="client"`.
2. `useWorkspace(jobId)` → loading / error / data.
3. On 403 → `WorkspaceAccessDenied`; back link → `/dashboard/client`.
4. Header **← Back to jobs** preserves bucket query: `/dashboard/client?bucket=active&page=2`.

**AdminJobWorkspacePage** flow:

1. Admin guard (allowlist).
2. Same `EscrowWorkspaceView` with `readOnly` + admin banner.
3. Back link → `/admin/disputes/:disputeId` (from query `?disputeId=` or case lookup).

### 8.3 Data fetching

**Dashboard list:** `useDashboardJobs({ role, bucket, page, limit })` → `GET /api/dashboard/{client|freelancer}/jobs`.

**Workspace detail:** parallel `GET workspace` + `GET timeline` when `jobId` route param present.

After milestone PATCH: refetch workspace + timeline.

Preserve list state in URL query (`?bucket=completed&page=2`) so back navigation restores pagination.

Polling: **not required** in Plan A; Plan E may add `pendingTx` polling later.

### 8.4 Pure functions (testable)

Extract `getActionPanelDisplay(permissions)` for labels and layout only — **do not** reimplement permission rules on client for enabling/disabling; use API `enabled` flags.

### 8.5 Styling

- Reuse `LandingLayout` or introduce `AppLayout` with authenticated nav.
- Match existing tokens: `brand-500`, rounded-3xl cards, `gray-900` headings (see `JobDetailView`, dashboards).

### 8.6 Phased delivery checklist

| Phase | Deliverable |
|-------|-------------|
| A1 | Backend stores + seed + membership middleware |
| A2 | `GET dashboard/.../jobs` (paginated buckets) + `GET workspace` |
| A3 | `GET timeline` + `PATCH milestone` |
| A4 | `DashboardLayout` + client/freelancer list + pagination |
| A5 | `EscrowWorkspaceView` on `/dashboard/*/jobs/:jobId` |
| A6 | Timeline + milestones + action panel |
| A7 | Completed bucket + read-only terminal workspace |
| A8 | Admin read-only `/admin/jobs/:jobId` + banner |
| A9 | Chat placeholder component |

---

## 9. Testing strategy

### 9.1 Testing pyramid

```text
        ┌─────────────┐
        │ Manual QA   │  Demo scripts, two browsers/wallets
        ├─────────────┤
        │ API integ.  │  supertest / fetch against running server
        ├─────────────┤
        │ Unit        │  permissions matrix, parsers, pure UI helpers
        └─────────────┘
```

**Not in Plan A scope:** On-chain integration tests (remain in `backend/src/integration/`).

### 9.2 Backend unit tests

**Runner:** Node.js built-in `node:test` + `node:assert` (no new deps) **or** Vitest if the repo standardizes on it later.

**Location:** `backend/src/domain/permissions.test.ts`

| Case | Assert |
|------|--------|
| Client + `funded` | Primary `submit_work` disabled; freelancer gets `submit_work` enabled |
| Client + `submitted` | Primary `release` enabled |
| Freelancer + `funding_pending` | Primary info/waiting, not fund |
| `pendingTx` set | All chain actions disabled; reason mentions confirming |
| Admin viewer | `readOnly`, all actions disabled |
| `open` job | `assertWorkspaceAllowed` throws / returns false |

### 9.3 Backend API integration tests

**Runner:** `node:test` with supertest **or** raw `fetch` to `app` listening on ephemeral port.

**Location:** `backend/test/workspace.api.test.ts`

**Setup:**

- In-memory store reset per test.
- Create session tokens via auth helpers (mock verify if needed).

| Test | Steps | Expected |
|------|-------|----------|
| Client list | `GET /api/dashboard/client/jobs?bucket=active&page=1` | Paginated, only caller's jobs |
| Completed bucket | Terminal job | Appears in `bucket=completed`, not `active` |
| Happy path | Seed job, client token, `GET workspace` | 200, correct `permissions.viewerRole` |
| Admin workspace | Admin token, disputed job | 200, `readOnly: true` |
| Timeline | `GET timeline` | Events descending |
| Milestone | Freelancer PATCH `in_progress` | 200, new timeline event |
| Forbidden | Random address token | 403 |
| No auth | No header | 401 |
| Unknown job | Bad id | 404 |

### 9.4 Frontend unit tests

**Runner:** Vitest (add to `frontend` when implementing) + React Testing Library optional.

**Priority:** Pure functions only in Plan A (fast, no wallet).

**Location:** `frontend/src/utils/Workspace/*.test.ts`

| Case | Assert |
|------|--------|
| `buildExplorerUrl(hash, network)` | Correct URL for testnet/devnet |
| `formatTimelineEvent(event)` | Title/body rendering |

**Component smoke (optional):** `WorkspaceActionPanel` renders primary label from fixture permissions.

### 9.5 Frontend manual QA checklist

Use two browsers (or normal + incognito) with different wallets / roles.

| # | Steps | Expected |
|---|-------|----------|
| 1 | Freelancer dashboard → open job from **Active** tab | Navigates to `/dashboard/freelancer/jobs/:id` |
| 2 | Paginate list (page 2), open job, press back | Returns to same bucket + page |
| 3 | Unrelated wallet opens workspace URL | Access denied |
| 4 | Client opens same job | Submit disabled; milestones read-only |
| 5 | PATCH milestone as freelancer | Status updates; timeline new row |
| 6 | Complete job (seed) | Leaves **Active**, appears under **Completed**; workspace read-only |
| 7 | Admin opens `/admin/jobs/:id` for disputed seed | Banner + disabled actions |
| 8 | Mobile width | List/detail stack; action panel on top in detail |
| 9 | Timeline row with `txHash` | Explorer link opens |

### 9.6 Regression gates (CI)

Add scripts when implementing:

```json
// backend/package.json
"test": "node --import tsx --test src/**/*.test.ts test/**/*.test.ts"

// frontend/package.json (when Vitest added)
"test": "vitest run"
```

**CI minimum for Plan A merge:**

- `pnpm --filter escrow-backend test` passes
- `pnpm --filter escrow-web typecheck` passes
- Manual QA checklist signed off once for seed jobs

### 9.7 Test data lifecycle

| Environment | Data |
|-------------|------|
| Local dev | `POST /api/dev/seed` idempotent reset |
| CI | In-memory seed inside test `before` hook |
| Staging | One shared demo job documented in README |

---

## 10. Acceptance criteria (definition of done)

Aligned with [`plan/V1.md`](../plan/V1.md) Plan A:

- [ ] `GET /api/dashboard/client/jobs` and `GET /api/dashboard/freelancer/jobs` with **pagination** and **buckets**.
- [ ] `GET /api/jobs/:jobId/workspace` and `GET /api/jobs/:jobId/timeline` with membership checks.
- [ ] `PATCH` milestone endpoint with timeline side effect.
- [ ] Workspace embedded at `/dashboard/client/jobs/:jobId` and `/dashboard/freelancer/jobs/:jobId`.
- [ ] Dashboard list → workspace → back preserves bucket/page query.
- [ ] **Completed** bucket + read-only workspace for terminal jobs (data not deleted).
- [ ] Admin read-only at `/admin/jobs/:jobId` per §4.8 (dispute-driven access).
- [ ] Timeline shows seeded lifecycle + milestone events; explorer link when `txHash` present.
- [ ] Action panel driven by server `permissions`; disabled actions show reasons.
- [ ] Agreement snapshot visible when terms exist.
- [ ] Admin read-only mode with banner.
- [ ] Backend unit tests for permission matrix; API integration tests for 401/403/200 paths.
- [ ] Manual QA checklist completed for at least `job_demo_funded` and `job_demo_submitted`.

---

## 11. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Plan C not ready — no real jobs | Dev seed endpoints + JSON store |
| Client/server permission drift | Single `computeWorkspacePermissions`; frontend trusts API |
| Chat expected but missing | Placeholder + `canSendChat: false` |
| Users click Fund with no Plan E | Stub handler or disabled until Plan E lands |
| List/workspace route drift | Single `EscrowWorkspaceView`; role pages are thin wrappers |

---

## 12. Open questions

| # | Question | Default if unresolved |
|---|----------|------------------------|
| 1 | Allow workspace at `matched` before terms? | Yes — primary action “Confirm terms” links to Plan C route |
| 2 | JSON file vs SQLite for V1 store? | JSON file acceptable for Plan A dev |
| 3 | Polling for `pendingTx` in Plan A? | No — static flag from seed only |
| 4 | Master–detail on desktop vs full-page detail? | Master–detail ≥1024px if time permits; else full-page + back |
| 5 | Standalone `/workspace/:jobId`? | Optional 302 redirect only; not primary navigation |

---

## 13. References

- [`plan/V1.md`](../plan/V1.md) — Plan A, B, C, E boundaries  
- [`plan/frontend/frontend-implementation-plan.md`](../plan/frontend/frontend-implementation-plan.md) — §5 Workspace layout  
- [`plan/frontend/frontend-user-story.md`](../plan/frontend/frontend-user-story.md) — Epic B2 chat (adjacent)  
- [`backend/src/server.ts`](../backend/src/server.ts) — existing auth routes  
- [`frontend/src/utils/auth/session.ts`](../frontend/src/utils/auth/session.ts) — bearer token client  

---

## Document history

| Version | Date | Notes |
|---------|------|-------|
| 0.1 | 2026-05-17 | Initial spec |
| 0.2 | 2026-05-17 | Dashboard-embedded workspace, pagination, concluded-job behavior, admin access model |
