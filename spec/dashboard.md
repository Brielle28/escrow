# Spec: Dashboards, Navigation & Global State (Plan C + Admin shell)

**Version:** 0.1 (draft)  
**Status:** Ready for implementation  
**Parent:** [`plan/V1.md`](../plan/V1.md) — Plan C (party dashboards), Plan D (admin), Plan G (settings)  
**Related:** [`spec/plan-a-escrow-workspace.md`](./plan-a-escrow-workspace.md) — workspace lives **inside** party dashboards  

---

## 1. Summary

Build **three separate dashboard experiences** sharing components but **not** sharing the same layout or auth gate:

| Dashboard | Base path | Auth | Layout |
|-----------|-----------|------|--------|
| **Client** | `/dashboard/client` | Wallet + role `client` | `ClientDashboardLayout` |
| **Freelancer** | `/dashboard/freelancer` | Wallet + role `freelancer` | `FreelancerDashboardLayout` |
| **Admin** | `/admin` | Wallet on **admin allowlist** (separate gate) | `AdminDashboardLayout` |

**Product language:** A **contract** is an escrow engagement (internally a `job`). Clients **publish work** (create a contract); both parties see **My contracts** as their list of engagements.

**Global state** (React context) holds session, wallet/network health, paginated job lists, and pending transaction flags. UI state never overrides chain-backed job status.

---

## 2. Goals and non-goals

### Goals

| ID | Goal |
|----|------|
| G1 | Client and freelancer each have a sidebar app with every V1 page listed in §5–§6 |
| G2 | Admin app is isolated: different layout, allowlist auth, no “switch to client” in V1 |
| G3 | **Contracts** hub: publish work + paginated list of all contracts for that role |
| G4 | Discovery: **Find talent** (client), **Find work** (freelancer) reuse or embed public market UIs |
| G5 | **Messages**, **Disputes**, **History**, **Settings**, **Help** reachable from every party dashboard |
| G6 | **Switch role** returns to `/connect` without disconnecting wallet (party dashboards only) |
| G7 | Workspace opens under dashboard (Plan A): `/dashboard/{role}/jobs/:jobId` |
| G8 | Global providers load once per dashboard tree; lists refetch after mutations |

### Non-goals (V1)

| Item | Reason |
|------|--------|
| Blog, About, marketing story pages inside dashboard | Stay on public site (`/`, `/about`, …) |
| Email/push notification delivery | Settings shows toggles **disabled** + “Coming soon” |
| Saved job searches, split payouts | Later |
| Admin “switch user” / impersonation | Security risk; use read-only job view |
| Full profile marketplace for talent | `/talent` stays discovery; deep profiles later |
| Plan E transaction modals | Plan E; dashboard only links/opens workspace |
| Plan B chat implementation | Messages **hub** in V1 can list threads; composer ships with Plan B |

---

## 3. What we removed (your list vs V1)

| You mentioned | Decision |
|---------------|----------|
| **Contract** (publish + list) | ✅ **Keep** — core; nav **Contracts** |
| **Disputes** | ✅ **Keep** — per role |
| **Transactions / history** | ✅ **Keep** — nav **History** |
| **Settings** | ✅ **Keep** |
| **Help and support** | ✅ **Keep** — in-app Help; links to public `/help`, `/contact` |
| **Job market** | ✅ **Freelancer only** as **Find work** (not client) |
| **Messages** | ✅ **Keep** — inbox hub (threads per contract) |
| **Switch user** | ✅ **Keep** as **Switch role** (client ↔ freelancer) |
| **Find user** (client) | ✅ **Find talent** → `/talent` (in-shell or linked) |
| **Find job** (freelancer) | ✅ **Find work** → `/jobs` |
| **Admin different auth/layout** | ✅ Required |
| **Duplicate “Contact” in nav** | ❌ Remove from sidebar — use **Help** → Contact link |
| **Blog in dashboard** | ❌ Public only |
| **Direct contracts** (marketing page) | ❌ Merged into **Contracts** |
| **Client browsing job market** | ❌ Clients hire via talent + publishing, not browsing `/jobs` |
| **Funding as top-level nav** | ❌ Action inside workspace |
| **Notifications center** | ❌ Stub under Settings only |

### Pages easy to forget (included in V1)

| Page | Role | Why |
|------|------|-----|
| **Overview** (home) | Client, freelancer, admin | KPIs + shortcuts |
| **Contract detail (recruiting)** | Client | Applicants before workspace |
| **Applications** | Freelancer | Pipeline before match |
| **Terms confirmation** | Client, freelancer | Pre-fund gate |
| **Workspace** | Client, freelancer | Plan A |
| **Settlement** | Client, freelancer | Sub-view or route from completed contract |
| **Onboarding** | Client, freelancer | One-time, not in sidebar |
| **Admin dispute console** | Admin | Plan D core |
| **Admin job inspector** | Admin | Read-only all jobs |
| **403 / wrong role** | All | Safe fallbacks |

---

## 4. Authentication & entry

### 4.1 Client & freelancer (shared mechanism, different role)

```text
/connect  →  wallet connect  →  role: client | freelancer  →  onboarding (if needed)
  →  /dashboard/client   OR   /dashboard/freelancer
```

- Session: existing bearer token + `ActingRole` in [`session.ts`](../frontend/src/utils/auth/session.ts).
- `ProtectedDashboard` wrapper: wrong role → redirect to other dashboard **or** `/connect?switch=1` with message.
- **Switch role:** clears role in session, keeps wallet, navigates to `/connect?switch=1&returnUrl=…`.

### 4.2 Admin (separate)

```text
/admin/login  →  connect wallet  →  verify address ∈ ADMIN_ALLOWLIST  →  /admin
```

| Rule | Detail |
|------|--------|
| Allowlist | `ADMIN_ADDRESSES` env (comma-separated CKB addresses) |
| Session | Separate token flag `isAdmin: true` **or** dedicated admin token type — **do not** reuse client/freelancer role session for admin routes |
| Layout | No party nav items (no Find work, no Publish contract) |
| Sign out | `/admin/login` — does not offer “switch to freelancer” |
| Party routes | `/dashboard/*` rejects admin token; `/admin/*` rejects party token |

### 4.3 Layout comparison

| Element | Client / Freelancer | Admin |
|---------|---------------------|-------|
| Sidebar color / brand | Product brand | Neutral / high-contrast “moderator” |
| Wallet chip | Yes | Yes (labeled Admin) |
| Role badge | Client / Freelancer | Admin |
| Switch role | Footer action | **Hidden** |
| Network guard banner | Yes | Yes |
| Public marketing links | Minimal (Help only) | Moderator docs only |

---

## 5. Client dashboard — pages & routes

**Shell:** `ClientDashboardLayout` — sidebar + top bar + `<Outlet />`.

### 5.1 Navigation (sidebar)

| # | Label | Route | Priority |
|---|-------|-------|----------|
| 1 | Overview | `/dashboard/client` | P0 |
| 2 | Contracts | `/dashboard/client/contracts` | P0 |
| 3 | Find talent | `/dashboard/client/talent` | P1 |
| 4 | Messages | `/dashboard/client/messages` | P1 |
| 5 | Disputes | `/dashboard/client/disputes` | P0 |
| 6 | History | `/dashboard/client/history` | P0 |
| 7 | Help | `/dashboard/client/help` | P1 |

**Footer actions (not main nav):** Settings (`/dashboard/client/settings`), **Switch role**.

### 5.2 Page specifications

#### Overview — `/dashboard/client`

| Section | Content |
|---------|---------|
| KPI tiles | Active contracts, needs funding, awaiting your review, open disputes |
| Needs action list | Top 5 rows from `needs_action` bucket with CTA |
| Quick actions | **Publish contract**, **Find talent** |

#### Contracts — `/dashboard/client/contracts`

| Section | Content |
|---------|---------|
| Header CTA | **Publish work** → `/dashboard/client/contracts/new` |
| Tabs / buckets | Drafts, Recruiting (`open`), Matched/Terms, Active, Review, Completed, Disputed |
| Table | Paginated: title, freelancer, status, next action, updated |
| Row click | Recruiting → contract detail; Active+ → workspace |

**Publish contract** — `/dashboard/client/contracts/new`

- Form: title, scope, budget (CKB), delivery date, escrow timeout, revision policy.
- Actions: Save draft, Publish (→ `open`).

**Contract detail (recruiting)** — `/dashboard/client/contracts/:jobId`

- Applicant list, select freelancer → `matched`.
- Not used after workspace phase (redirect to workspace when appropriate).

**Workspace** — `/dashboard/client/jobs/:jobId`  
(Spec: [`plan-a-escrow-workspace.md`](./plan-a-escrow-workspace.md))

**Terms** — `/dashboard/client/contracts/:jobId/terms`  
- Agreement snapshot, confirm (client side).

**Settlement** — `/dashboard/client/contracts/:jobId/settlement`  
- Terminal outcome + tx hashes (read-only).

#### Find talent — `/dashboard/client/talent`

- Embed or full-page reuse of [`FindTalentPage`](../frontend/src/pages/FindTalentPage.tsx) inside dashboard layout.
- Purpose: discover freelancers **before** or **outside** a live contract.
- CTA on profile: “Invite to contract” (V1.1) or link to publish flow.

#### Messages — `/dashboard/client/messages`

| Section | Content |
|---------|---------|
| Thread list | One row per contract with recent message preview + unread count |
| Thread detail | `/dashboard/client/messages/:jobId` — job-scoped chat (Plan B) |
| Empty state | “Messages appear when you have an active contract” |

V1 without Plan B: list contracts; opening thread shows workspace chat placeholder.

#### Disputes — `/dashboard/client/disputes`

| Section | Content |
|---------|---------|
| List | Contracts in `disputed` / `resolved` with status |
| Detail | `/dashboard/client/disputes/:disputeId` — category, narrative, evidence, admin notes (visible subset) |
| CTA | Open dispute from workspace only in V1 (list is read-mostly) |

#### History — `/dashboard/client/history`

| Section | Content |
|---------|---------|
| Filters | Contract, event type, date range |
| Rows | Timestamp, event, tx hash, explorer link |
| Drill-down | `/dashboard/client/history?jobId=` or per-job sub-route |

#### Help — `/dashboard/client/help`

| Section | Content |
|---------|---------|
| FAQ accordion | Escrow flow, disputes, wallet |
| Links | Public [`/help`](../frontend/src/pages/HelpCenterPage.tsx), [`/trust-and-safety`](../frontend/src/pages/TrustSafetyPage.tsx), **Contact** |
| Chat disclaimer | Payouts follow on-chain rules, not chat |

#### Settings — `/dashboard/client/settings`

| Section | Content |
|---------|---------|
| Profile | Display name, bio (optional) → `PATCH /api/me/profile` |
| Wallet | Address (read-only), disconnect |
| Network | Current chain, mismatch warning |
| Notifications | Toggles disabled + copy “Coming soon” |
| Legal links | Privacy, Terms (open public pages) |

#### Onboarding — `/onboarding/client` (no sidebar)

- First visit after role select; redirect to Overview when complete.

---

## 6. Freelancer dashboard — pages & routes

**Shell:** `FreelancerDashboardLayout`.

### 6.1 Navigation (sidebar)

| # | Label | Route | Priority |
|---|-------|-------|----------|
| 1 | Overview | `/dashboard/freelancer` | P0 |
| 2 | My contracts | `/dashboard/freelancer/contracts` | P0 |
| 3 | Find work | `/dashboard/freelancer/jobs` | P0 |
| 4 | Applications | `/dashboard/freelancer/applications` | P0 |
| 5 | Messages | `/dashboard/freelancer/messages` | P1 |
| 6 | Disputes | `/dashboard/freelancer/disputes` | P0 |
| 7 | History | `/dashboard/freelancer/history` | P0 |
| 8 | Help | `/dashboard/freelancer/help` | P1 |

**Footer:** Settings, **Switch role**.

### 6.2 Page specifications

#### Overview — `/dashboard/freelancer`

| Section | Content |
|---------|---------|
| KPI tiles | Active contracts, pending applications, disputes, completed |
| Quick actions | **Find work**, open latest active contract |

#### My contracts — `/dashboard/freelancer/contracts`

- Same bucket/pagination model as client but freelancer-centric columns (client name, budget).
- Rows → `/dashboard/freelancer/jobs/:jobId` workspace.
- **No** publish CTA (freelancers don’t publish jobs).

#### Find work — `/dashboard/freelancer/jobs`

- Reuse [`MarketJobsPage`](../frontend/src/pages/MarketJobsPage.tsx) in dashboard shell.
- Job detail → `/dashboard/freelancer/jobs/:jobId/apply` or public `/jobs/:jobId` with apply CTA.
- This is the **job market** for freelancers only.

#### Applications — `/dashboard/freelancer/applications`

| Column | Content |
|--------|---------|
| Job title | Link to job detail |
| Status | `applied` \| `rejected` \| `chosen` |
| Applied date | ISO |
| Action | View application, withdraw (if allowed) |

#### Apply — `/dashboard/freelancer/jobs/:jobId/apply`

- Cover message, confirm rate, submit → `POST /api/jobs/:jobId/applications`.

#### Workspace — `/dashboard/freelancer/jobs/:jobId`  
(Plan A spec)

#### Terms — `/dashboard/freelancer/contracts/:jobId/terms`

#### Settlement — `/dashboard/freelancer/contracts/:jobId/settlement`

#### Messages / Disputes / History / Help / Settings

- Same structure as client (§5.2) with freelancer routes and copy (“client” instead of “freelancer” where needed).

#### Onboarding — `/onboarding/freelancer`

---

## 7. Admin dashboard — pages & routes

**Shell:** `AdminDashboardLayout` — **no** Switch role, **no** Contracts publish, **no** Find work/talent.

### 7.1 Navigation (sidebar)

| # | Label | Route | Priority |
|---|-------|-------|----------|
| 1 | Overview | `/admin` | P0 |
| 2 | Disputes | `/admin/disputes` | P0 |
| 3 | All contracts | `/admin/jobs` | P1 |
| 4 | Activity log | `/admin/activity` | P1 |
| 5 | Help | `/admin/help` | P1 |

**Footer:** Settings (admin profile + sign out only).

### 7.2 Page specifications

#### Admin login — `/admin/login`

- Connect wallet → verify allowlist → issue admin session → redirect `/admin`.
- Failed allowlist: clear message, no data leak.

#### Overview — `/admin`

| KPI | Content |
|-----|---------|
| Open disputes | Count + link to inbox |
| Stale disputes | > SLA threshold |
| Resolved (7d) | Count |
| Quick link | Dispute queue |

#### Disputes inbox — `/admin/disputes`

| Section | Content |
|---------|---------|
| Table | Paginated: id, contract title, age, status, parties |
| Filters | Status, sort by age |
| Row action | Open console |

#### Dispute console — `/admin/disputes/:disputeId`

| Section | Content |
|---------|---------|
| Case file | Category, narratives, evidence |
| Timeline export | Read-only lifecycle |
| Chat export | Plan B |
| Checklist | Triaged → Awaiting evidence → Decided → Closed |
| Actions | Request evidence, record decision |
| Link | **View contract workspace** → `/admin/jobs/:jobId` (read-only) |

#### All contracts — `/admin/jobs`

- Search by id, client address, freelancer address, status.
- Paginated table → read-only workspace.

#### Admin workspace — `/admin/jobs/:jobId`

- Plan A `EscrowWorkspaceView` with `readOnly` + banner.
- Back → dispute console when `?disputeId=` present.

#### Activity log — `/admin/activity`

- Global audit: admin actions, decisions, timestamps.
- Party **History** is separate (their txs); this is **moderator audit**.

#### Help — `/admin/help`

- Moderator playbook: dispute standards, what chat is / isn’t evidence, escalation.
- No public marketing fluff.

#### Settings — `/admin/settings`

- Display name (optional), connected address, sign out.
- No profile marketplace fields.

---

## 8. Global state architecture

### 8.1 Provider tree

Mount at app root (inside `CccProvider`):

```text
CccProvider
  └── SessionProvider          # party: token, address, role, signOut, refresh
        └── NetworkGuardProvider
              └── PendingTxProvider
                    └── Router
                          ├── Public routes (no SessionProvider required for read-only marketing)
                          ├── ClientDashboardLayout (+ DashboardJobsProvider role=client)
                          ├── FreelancerDashboardLayout (+ DashboardJobsProvider role=freelancer)
                          └── AdminDashboardLayout (+ AdminSessionProvider)
```

`AdminSessionProvider` is a **sibling branch**, not nested under party `SessionProvider`.

### 8.2 Context responsibilities

| Context | State | Actions |
|---------|-------|---------|
| **SessionProvider** | `session`, `status: idle\|loading\|authenticated\|anonymous` | `signOut`, `refreshSession`, `requireRole` |
| **NetworkGuardProvider** | `expectedNetwork`, `actualNetwork`, `isValid` | `refreshChain` |
| **PendingTxProvider** | `pendingByJobId: Record<jobId, PendingTx>` | `setPending`, `clearPending` |
| **DashboardJobsProvider** | `bucket`, `page`, `jobs[]`, `total`, `kpis`, `isLoading` | `setBucket`, `setPage`, `refetch` |
| **AdminSessionProvider** | `adminSession`, `isAllowlisted` | `adminSignOut` |

### 8.3 Data loading rules

| Rule | Detail |
|------|--------|
| Source of truth | Backend job `status` and `permissions` |
| After mutation | `refetch()` workspace + dashboard list for affected `jobId` |
| Optimistic updates | Chat send only (Plan B) |
| KPIs | From `GET /api/dashboard/{role}/overview` or derived from list totals |
| Cache | React state only in V1; no Redux |

### 8.4 URL state for pagination

Persist list context in query string:

```text
/dashboard/client/contracts?bucket=active&page=2
```

Workspace back links preserve query.

---

## 9. Backend API (Plan C scope)

### 9.1 Party — client

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/dashboard/client/overview` | KPI counts |
| GET | `/api/dashboard/client/jobs` | Paginated buckets (see Plan A spec §6.0) |
| POST | `/api/client/jobs` | Publish contract |
| PATCH | `/api/client/jobs/:jobId` | Edit draft / open |
| GET | `/api/client/jobs/:jobId` | Detail + applicants |
| POST | `/api/client/jobs/:jobId/select-freelancer` | Match |
| POST | `/api/jobs/:jobId/terms/confirm` | Client confirm |

### 9.2 Party — freelancer

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/dashboard/freelancer/overview` | KPIs |
| GET | `/api/dashboard/freelancer/jobs` | My contracts buckets |
| GET | `/api/freelancer/applications` | Applications list |
| POST | `/api/jobs/:jobId/applications` | Apply |
| POST | `/api/jobs/:jobId/terms/confirm` | Freelancer confirm |

### 9.3 Shared party

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/me/profile` | Profile |
| PATCH | `/api/me/profile` | Update profile |
| GET | `/api/history` | Transaction history (filters) |
| GET | `/api/disputes` | My disputes (role-filtered) |
| GET | `/api/disputes/:id` | Dispute detail |
| GET | `/api/messages` | Thread index (Plan B) |

### 9.4 Admin

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/admin/auth/verify` | Allowlist check + admin token |
| GET | `/api/admin/overview` | Admin KPIs |
| GET | `/api/admin/disputes` | Inbox |
| GET | `/api/admin/disputes/:id` | Console |
| POST | `/api/admin/disputes/:id/decision` | Resolve |
| GET | `/api/admin/jobs` | Inspector list |
| GET | `/api/admin/activity` | Audit log |

---

## 10. Frontend file structure

```text
frontend/src/
  layouts/
    ClientDashboardLayout.tsx
    FreelancerDashboardLayout.tsx
    AdminDashboardLayout.tsx
    DashboardSidebar.tsx
  providers/
    SessionProvider.tsx
    AdminSessionProvider.tsx
    NetworkGuardProvider.tsx
    PendingTxProvider.tsx
    DashboardJobsProvider.tsx
  guards/
    RequireClientSession.tsx
    RequireFreelancerSession.tsx
    RequireAdminSession.tsx
  pages/dashboard/client/     # Overview, Contracts, Messages, …
  pages/dashboard/freelancer/
  pages/admin/
  api/
    dashboardApi.ts
    jobsApi.ts
    adminApi.ts
  components/Dashboard/
    DashboardKpiStrip.tsx
    ContractTable.tsx
    BucketTabs.tsx
    Pagination.tsx
```

---

## 11. Route map (complete V1)

### Public (unchanged, outside dashboard)

`/`, `/jobs`, `/jobs/:jobId`, `/talent`, `/talent/:id`, `/help`, `/contact`, `/connect`, legal pages.

### Client

```text
/dashboard/client
/dashboard/client/contracts
/dashboard/client/contracts/new
/dashboard/client/contracts/:jobId
/dashboard/client/contracts/:jobId/terms
/dashboard/client/contracts/:jobId/settlement
/dashboard/client/jobs/:jobId                    # workspace
/dashboard/client/talent
/dashboard/client/messages
/dashboard/client/messages/:jobId
/dashboard/client/disputes
/dashboard/client/disputes/:disputeId
/dashboard/client/history
/dashboard/client/help
/dashboard/client/settings
/onboarding/client
```

### Freelancer

```text
/dashboard/freelancer
/dashboard/freelancer/contracts
/dashboard/freelancer/contracts/:jobId/terms
/dashboard/freelancer/contracts/:jobId/settlement
/dashboard/freelancer/jobs/:jobId                 # workspace
/dashboard/freelancer/jobs                         # find work (market)
/dashboard/freelancer/jobs/:jobId/apply
/dashboard/freelancer/applications
/dashboard/freelancer/messages
/dashboard/freelancer/messages/:jobId
/dashboard/freelancer/disputes
/dashboard/freelancer/disputes/:disputeId
/dashboard/freelancer/history
/dashboard/freelancer/help
/dashboard/freelancer/settings
/onboarding/freelancer
```

### Admin

```text
/admin/login
/admin
/admin/disputes
/admin/disputes/:disputeId
/admin/jobs
/admin/jobs/:jobId                                 # read-only workspace
/admin/activity
/admin/help
/admin/settings
```

---

## 12. Implementation phases

| Phase | Deliverable |
|-------|-------------|
| C1 | `SessionProvider`, layouts, sidebar, Overview placeholders |
| C2 | Global `apiClient` + dashboard overview + paginated contract lists |
| C3 | Publish contract + recruiting detail + applications |
| C4 | Terms confirm routes |
| C5 | Messages/Disputes/History/Help/Settings pages (wired or stub) |
| C6 | Find talent / Find work in-shell |
| C7 | Admin layout + login + overview + disputes inbox |
| C8 | Switch role + onboarding redirects |
| C9 | Integrate Plan A workspace routes under both party dashboards |

**Dependency:** Plan A workspace (A4–A5) should use layouts from **C1**.

---

## 13. Testing strategy

### 13.1 Backend

| Area | Tests |
|------|-------|
| Job CRUD | Create draft, publish, edit only when allowed |
| Applications | Apply once, list by freelancer |
| Match + terms | State transitions `open`→`matched`→`terms_confirmed` |
| Dashboard buckets | Correct pagination totals per bucket |
| Admin allowlist | 403 for non-allowlisted wallet |

### 13.2 Frontend

| Area | Tests |
|------|-------|
| `computeBucketQuery` | URL ↔ state |
| Guards | Wrong role cannot mount client layout |
| KPI component | Renders from fixture |

### 13.3 Manual QA matrix

| # | Scenario |
|---|----------|
| 1 | Client publishes contract → appears under Recruiting |
| 2 | Freelancer applies → client sees applicant |
| 3 | Client selects freelancer → both see contract under Matched/Active |
| 4 | Switch role client→freelancer lands on `/connect` then freelancer dashboard |
| 5 | Admin non-allowlist cannot enter `/admin` |
| 6 | Admin opens dispute → job workspace read-only |
| 7 | Completed contract only in Completed tab |
| 8 | History shows tx hash with explorer link |

---

## 14. Acceptance criteria (Plan C + admin shell)

- [ ] Three layouts with sidebars per §5–§7.
- [ ] Client: Contracts (publish + list + recruiting), Find talent, Messages, Disputes, History, Help, Settings, Switch role.
- [ ] Freelancer: My contracts, Find work, Applications, same shared pages.
- [ ] Admin: separate login, Overview, Disputes (+ console), All contracts, Activity, Help, Settings — **no** party discovery nav.
- [ ] Global providers per §8; refetch after job mutations.
- [ ] Workspace nested under dashboard (Plan A).
- [ ] Removed items stay public-only (§3 table).

---

## 15. Document history

| Version | Date | Notes |
|---------|------|-------|
| 0.1 | 2026-05-17 | Initial dashboard spec; consolidates V1 Plan C + admin shell |
