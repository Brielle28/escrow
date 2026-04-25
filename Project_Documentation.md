# Escrow on CKB — Project Documentation

---

## What Are We Building?

We are building a **decentralized escrow system** on the **Nervos CKB blockchain**.

An escrow is a system where a neutral middleman holds funds between two parties until both fulfill their obligations. In our case, the middleman is not a human — it is **code living on the CKB blockchain**. This means no one can cheat, no one can run away with the funds, and no human trust is required.

---

## How It Works (Plain English)

1. **Depositor (Buyer)** locks funds into the escrow
2. **Recipient (Seller)** delivers the service or product
3. Both parties confirm obligations are met (according to the rules encoded on-chain)
4. Funds are **released** to the recipient when the lock script accepts the transaction
5. If there is a dispute, an **Arbiter** participates in the unlock path the script allows
6. If nothing happens and time expires, the depositor can take the **refund** path the script allows

---

## Tech Stack (Backend-First)

| Layer | Tool | Purpose |
|-------|------|---------|
| On-chain logic | **TypeScript** | Escrow **lock script** compiled for **`ckb-js-vm`** (QuickJS on CKB-VM) |
| On-chain runtime | **`ckb-js-vm`** | Executes your script bytecode on-chain ([mechanism & capabilities](https://docs.nervos.org/docs/script/js/js-vm)) |
| Standard library | **`@ckb-js-std/*`** | Syscalls and helpers inside the VM (same family as the official [Simple Lock](https://docs.nervos.org/docs/dapp/simple-lock) tutorial) |
| Local chain | **OffCKB** (`@offckb/cli`) | Local **Devnet**, accounts, deploy, deposit ([OffCKB](https://github.com/ckb-devrel/offckb)) |
| App / integration tests | **TypeScript + CCC** | Build transactions, query cells, send txs — **no frontend required** for backend validation |
| Staging | **CKB Pudge Testnet** | Public testnet before any mainnet plan |
| Frontend | **React + CCC** | **`frontend/`** — Vite + **`@ckb-ccc/connector-react`** (wallet shell); escrow flows come after script + backend are stable |

**You do not use Rust or Capsule for the primary on-chain contract path.** The contract lives as **QuickJS bytecode** (or bundled JS) loaded via **`ckb-js-vm`**; your repo is a **`ckb-js-vm`** style TypeScript project, not a Capsule Rust crate.

**Network note:** Before assuming **mainnet**, check current **`ckb-js-vm`** deployment status in [Ecosystem scripts](https://docs.nervos.org/docs/ecosystem-scripts/introduction). Official docs recommend **Devnet / Testnet** for JS VM work until you confirm availability on your target network.

---

## Project Phases

```
Phase 1: Setup & Environment        ← We start here
Phase 2: Write the Escrow Lock Script (TypeScript → ckb-js-vm)
Phase 3: Deploy & Test Locally (OffCKB + CCC test scripts)
Phase 4: Move to Testnet
Phase 5: Frontend (shell started; flows after Week 3–4)
```

---

# Week by Week Roadmap

---

## Week 1 — Setup & Environment

**Goal:** Install tooling, run a **local CKB Devnet** (via OffCKB), and confirm you can build a minimal **`ckb-js-vm`** project.

**What to achieve:**

- Node.js (LTS), **pnpm**, TypeScript working
- **OffCKB** installed; local node runs and produces blocks
- A **scaffolded** `ckb-js-vm` app (or equivalent monorepo) that **builds** without errors
- **CCC** available for later integration tests (same major version family as tutorials if you follow Nervos examples)

**How to achieve it:**

1. Install **Node.js** (LTS) and **pnpm**
2. Install **OffCKB** globally: `@offckb/cli` (see [OffCKB](https://github.com/ckb-devrel/offckb))
3. Start local Devnet: `offckb node` — confirm blocks / tip advances
4. Scaffold a **`ckb-js-vm`** TypeScript contract project, for example: `pnpm create ckb-js-vm-app` (see [JS Quick Start](https://docs.nervos.org/docs/script/js/js-quick-start))
5. From the **repository root**, run `pnpm install` then `pnpm run build:contracts` (see **Day-to-day commands** below); fix any environment issues until the on-chain package builds
6. Install **CCC** in the folder where integration tests will live (or add a workspace package for tests)
7. Initialize **git** and a clear **folder layout** (see below)

**Success check**

- OffCKB Devnet runs; you can query tip / chain info
- On-chain TypeScript package **builds** (outputs deployable artifacts such as bytecode under `dist/` or your tool’s convention)
- No blocking install or compile errors

---

## Week 2 — Write the Escrow Lock Script (TypeScript)

**Goal:** Implement the **escrow lock script** in **TypeScript** for **`ckb-js-vm`**, with explicit **script args** and **witness** rules for each unlock path.

**What the script must enforce (on-chain):**

1. **Release** — Valid witness proves **Arbiter + Recipient** authorization (e.g. both signatures or a layout your script defines) → spend allowed toward recipient-controlled outputs as your design specifies
2. **Refund (dispute)** — Valid witness proves **Arbiter + Depositor** authorization → refund path allowed
3. **Timeout refund** — **Lock time / epoch condition** is satisfied **and** witness satisfies **Depositor** authorization (your doc’s rule: depositor must still sign after timeout)

**Design work (before coding loops):**

- Encode in **lock script `args`**: hashes or identifiers for **depositor**, **recipient**, **arbiter** (and any timelock parameters), remembering that **`ckb-js-vm`** scripts use a **35-byte prefix** in `args` before your custom payload ([JS VM args](https://docs.nervos.org/docs/script/js/js-vm))
- Define **witness layout** per branch (what each party puts in `witness` / `WitnessArgs`) so the script can verify it deterministically
- Prefer **QuickJS bytecode** (`.bc`) for deployment to reduce **cycle** usage versus raw source where possible ([JS Quick Start](https://docs.nervos.org/docs/script/js/js-quick-start))

**How to achieve it:**

1. In your **`ckb-js-vm`** package, implement `main()` (or entry pattern) using **`@ckb-js-std/core`** and bindings — same style as [Simple Lock script logic](https://docs.nervos.org/docs/dapp/simple-lock)
2. Parse **script args** (with correct **offset** past the JS-VM prefix)
3. Load **witness** / transaction context; branch on **release**, **refund**, **timeout refund**
4. Verify **crypto** (e.g. signature checks, hashes) and **time conditions** using CKB syscalls available in your std version
5. Return **success (0)** or a **defined error code** on failure
6. Add **unit tests** with **`ckb-testtool`** in your tests package ([JS tests](https://docs.nervos.org/docs/script/js/js-tests))

**Success check**

- TypeScript compiles to the artifact your deploy step expects (e.g. `.bc`)
- Unit tests cover all **three** unlock paths and negative cases (wrong keys, wrong time, malformed witness)
- You can articulate the **exact** witness format for each path (document it in code comments or a short `SCRIPT.md`)

---

## Week 3 — Deploy Locally & Write Integration Tests (CCC)

**Goal:** Deploy the escrow script to **OffCKB Devnet** and validate **end-to-end** behavior using **TypeScript scripts** and **CCC** (no React required).

**What to achieve:**

- Script deployed to local chain; **cell deps** include **`ckb-js-vm`** and your **resource / bytecode cell** as required by JS contracts ([JS VM vs traditional contracts](https://docs.nervos.org/docs/script/js/js-vm))
- All **four** scenarios below pass from the terminal

**How to achieve it:**

1. In one terminal, start local devnet: **`pnpm devnet:node`** (same as `offckb node`) — leave it running.
2. After bytecode or chain changes: **`pnpm run prep:devnet`** — runs **`build:contracts`** → **`deploy:devnet`** (OffCKB deploy, updates **`deployment/scripts.json`**) → **`system-scripts:devnet`** (refreshes **`deployment/system-scripts.devnet.json`** for CCC). See **Day-to-day commands** below for individual steps.
3. **`scripts.json`** / deployment metadata are produced under **`deployment/`** for **CCC** (**code hashes**, **hash types**, **cell deps** including **`ckb-js-vm`** + bytecode cell — align with [Simple Lock](https://docs.nervos.org/docs/dapp/simple-lock) **Deploy** section).
4. Write **integration** TypeScript modules (CCC) that:
   - Create cells locked by your escrow lock
   - Build transactions that exercise each path with the correct **witness**
5. Run scenarios:

```
Test 1 → Depositor locks funds successfully
Test 2 → Recipient path: release succeeds with correct witness (e.g. arbiter + recipient)
Test 3 → Timeout path: after timelock, depositor can complete timeout refund per script rules
Test 4 → Dispute path: arbiter + depositor refund (or your defined dispute outcome) succeeds
```

6. Run each test from the terminal: **`pnpm test:integration`** (from repo root), or set **`INTEGRATION_SPEND_MODE=release|dispute|timeout`** in **`backend/`** for a specific spend path.

**Success check**

- All four scenarios **pass** against **local Devnet**
- You can point to **on-chain txs** (**hashes**) for each scenario — see **Transaction hashes** under Day-to-day commands (these are for **debugging**, **audit**, and **regression**, not “who the arbiter is”).
- **`scripts.json` / cell deps** are correct (no missing `ckb-js-vm` dep, wrong args layout, or wrong bytecode cell reference)

---

## Week 4 — Testnet & Full Testing

**Goal:** Repeat deployment and integration tests on **CKB Pudge Testnet** (or current public testnet you standardize on).

**What to achieve:**

- Escrow lock live on testnet **if** **`ckb-js-vm`** is supported there per [Ecosystem scripts](https://docs.nervos.org/docs/ecosystem-scripts/introduction)
- Same four scenarios pass on testnet
- Explorer links documented for regression

**How to achieve it:**

1. Fund a testnet wallet from the **Pudge (or current) faucet**
2. Deploy with `--network testnet` (or equivalent); refresh deployment artifacts for testnet
3. Point CCC client / RPC at **testnet**
4. Re-run all four integration scenarios
5. Verify on **CKB testnet explorer** (use the explorer URL that matches your network)
6. Document **deployment** (tx hash, cell deps, script args convention) for the team

**Success check**

- Testnet deployment succeeds and integration tests pass
- You are confident the **witness + time + authorization** logic matches the Week 2 spec

---

## Week 5 & Beyond — Frontend

**Goal:** Build the React frontend that uses **CCC** to drive the same flows you already tested in TypeScript.

**Current repo state:** `frontend/` is a **Vite + React** app (`escrow-web`) with **`@ckb-ccc/connector-react`** (`CccProvider`, connect wallet, testnet/mainnet client switcher). Escrow actions (lock, release, refund) are **not** implemented yet—add them after the on-chain script and backend flows are stable.

**Planned UI (remaining):**

- Depositor flow: lock funds
- Recipient / arbiter flows: witness construction for release or dispute paths
- Timeout refund flow for depositor
- Transaction status / links to explorer

---

# Project folder structure (repo layout)

Single **pnpm workspace** at the repository root (`pnpm-workspace.yaml` lists `contracts/*`, `backend`, `frontend`). Three concerns stay in separate top-level folders:

```
escrow/                              ← repository root (name on disk may be escrow or escrow-ckb)
├── contracts/                       ← On-chain (ckb-js-vm)
│   ├── on-chain-script/             ← TypeScript lock script → dist/index.bc (dist/ is gitignored)
│   └── on-chain-script-tests/       ← Jest + ckb-testtool (ckb-debugger on PATH)
│
├── backend/                         ← Headless TypeScript + @ckb-ccc/ccc (package: escrow-backend)
│   ├── src/
│   └── package.json
│
├── frontend/                        ← Vite + React, package name escrow-web + @ckb-ccc/connector-react
│   ├── src/
│   └── package.json
│
├── package.json                     ← Root workspace scripts (install, build:contracts, test, dev, …)
├── pnpm-workspace.yaml
├── pnpm-lock.yaml                   ← commit this for reproducible installs
├── .gitignore
├── Project_Documentation.md
└── README.md
```

**`deployment/`** holds **`scripts.json`** and **`system-scripts.devnet.json`** produced by **`pnpm run deploy:devnet`** / **`pnpm run prep:devnet`**; commit or gitignore—team choice (see `.gitignore` optional `deployment/` comment).

---

## Day-to-day commands (run from repository root)

These are the commands you will use most often after cloning:

| Command | What it does |
|---------|----------------|
| **`pnpm install`** | Installs dependencies for **contracts**, **backend**, and **frontend** (respects `pnpm-lock.yaml`). |
| **`pnpm run setup:tools`** | **Windows helper**: downloads and extracts **`ckb-debugger.exe`** into **`tools/`** (run once per machine, or whenever you need to refresh tooling). |
| **`pnpm run build:contracts`** | Builds the on-chain script: bundle → **`dist/index.js`** → **`dist/index.bc`**. Requires **`ckb-debugger`** (use `setup:tools` on Windows, or ensure debugger is on `PATH`). |
| **`pnpm run test`** | Runs **Jest** + **ckb-testtool** tests under **`contracts/on-chain-script-tests/`** (same **`ckb-debugger`** requirement). |
| **`pnpm run dev`** | Starts the **Vite** dev server for **`frontend/`** (default **http://localhost:5173**). |
| **`pnpm devnet:node`** | Starts **OffCKB** local devnet (`offckb node`). Keep this terminal open while developing; integration tests expect RPC to be up. |
| **`pnpm run deploy:devnet`** | Deploys **`contracts/on-chain-script/dist/index.bc`** and writes **`deployment/scripts.json`** (requires devnet running; uses **`offckb deploy -y`**). Run after **`build:contracts`** if bytecode changed. |
| **`pnpm run system-scripts:devnet`** | Exports CCC-style system scripts to **`deployment/system-scripts.devnet.json`** (`offckb system-scripts`). Refresh after devnet/tooling changes so **`ckb-js-vm`** deps match your chain. |
| **`pnpm run prep:devnet`** | One-shot: **`build:contracts`** → **`deploy:devnet`** → **`system-scripts:devnet`**. Use before **`test:integration`** when you changed the contract or reset the chain. |
| **`pnpm run deploy:testnet`** | Deploys bytecode to **CKB public testnet** — pass **`--privkey`** yourself, or prefer **`pnpm run deploy:testnet:env`**. Updates **`deployment/scripts.json`** `testnet` section. |
| **`pnpm run deploy:testnet:env`** | Same as **`deploy:testnet`** but **`--privkey`** is read from **`backend/.env.local`** **`DEPLOYER_PRIVATE_KEY`** (nothing secret pasted in the terminal). Requires funded testnet balance on that key. |
| **`pnpm run system-scripts:testnet`** | Writes **`deployment/system-scripts.testnet.json`** for CCC (**Pudge** deps). |
| **`pnpm run prep:testnet`** | **`build:contracts`** → **`deploy:testnet`** → **`system-scripts:testnet`**. |
| **`pnpm run prep:testnet:env`** | Same chain, but deploy uses **`DEPLOYER_PRIVATE_KEY`** from **`backend/.env.local`**. Prefer this so you never type the key on the CLI. |
| **`pnpm test:integration`** | Local **devnet** integration (default **`CKB_NETWORK=devnet`**). **`INTEGRATION_SPEND_MODE`** optional. |
| **`pnpm test:integration:testnet`** | Same runner with **`CKB_NETWORK=testnet`**; set **`backend/.env.local`** **`CKB_RPC_URL`** to testnet RPC (e.g. **`https://testnet.ckb.dev/rpc`**) and a **funded** **`DEPLOYER_PRIVATE_KEY`**. See **`artifacts/WEEK4_TESTNET_STATUS.md`**. |

**Transaction hashes (fund / spend txs)**

Saving or logging **transaction hashes** is optional but useful for:

- **Debugging** — trace which tx failed or which cell was created.
- **Audit / transparency** — anyone (buyer, seller, **arbiter**, support, or an external reviewer) can look up the same txs on an **explorer** and verify what happened on-chain.

Each **`pnpm test:integration`** attempt **appends one JSON line** to **`artifacts/integration-tx-history.jsonl`**:

- **`"status":"success"`** — fund tx **and** spend tx both completed (`fundTxHash`, `spendTxHash`, **`arbiterPubkeyHash`**, etc.).
- **`"status":"failed"`** — anything threw before finishing (RPC/setup error, verification failure, missing cell, etc.). Includes **`error`** message and any partial **`fundTxHash` / `spendTxHash`** if those steps ran before failure.

Use **`status`** in a future UI to show **only successes** to end users; **`failed`** lines are for **developers / ops** (debugging regression, partial on-chain state).

**What a hash does and does *not* do:** On CKB, any transaction that is **committed** in a block has a **tx hash** and can be looked up. Failed runs may still leave **partial** txs on-chain — the **`failed`** history line preserves what we know **off-chain**.

**“Who is at fault?”** Tx hashes show **what the chain accepted** — which unlock **path** ran (**release**, **dispute**, or **timeout**) and which **locks / signatures** the script verified. They do **not** by themselves prove someone was “wrong” in a business sense; they prove **rules were satisfied** on that tx. For disputes, humans (or contracts off-chain) decide liability; the chain proves **which authorized path** was executed.

In production the **three roles map to users** (wallets / people): **depositor**, **recipient**, **arbiter** — not abstract roles only. Integration uses **deterministic fake keys** for speed; live apps use **real user keys** encoded into the escrow payload.

**Who is the arbiter in this repo?**

- **Integration / dev (`runIntegration.ts`):** The arbiter is **not** a fixed person — it is a **deterministic test key** derived from **`INTEGRATION_PARTY_SEED`** (default `escrow-phase-d-devnet`) plus the role suffix **`arbiter`**. Its **public-key hash** is baked into the on-chain escrow payload (`arbiterPkHash`). The same derivation produces **depositor** and **recipient** keys (`depositor`, `recipient` suffixes).
- **Production:** The arbiter is whoever the **buyer and seller agree on** before locking funds — encoded in the escrow **payload** as **`arbiterPkHash`** (and enforced by signatures from that party on **release** and **dispute** paths). Your backend or UI will supply real keys when you move past local integration.

**Windows quick start for tooling**

```bash
pnpm install
pnpm run setup:tools
pnpm run build:contracts
pnpm run test
```

**Also useful**

- **`pnpm run build`** — builds every workspace package that defines a **`build`** script (contracts + backend typecheck + frontend production build).
- **`pnpm --filter escrow-backend run typecheck`** — TypeScript check for **`backend/`** only.

---

## Git: what is safe to commit

With the root **`.gitignore`**, **`git add .`** from the repo root should **not** stage **`node_modules`**, **`dist/`**, **`.env*`**, caches, or log files. **`pnpm-lock.yaml`** is **not** ignored—**commit it** so installs are reproducible. If you add a **`deployment/`** folder later, decide as a team whether to track it; there is an optional ignore rule commented in **`.gitignore`**.

---

# Current Status

| Phase | Status |
|-------|--------|
| Week 1 — Setup & Environment | Done (tooling + OffCKB pattern in repo) |
| Week 2 — Escrow lock (TypeScript / ckb-js-vm) | Done (script + VM tests; iterate as needed) |
| Week 3 — Deploy & integration tests (CCC) | Done for **local OffCKB devnet** (`pnpm test:integration`; deploy/prep scripts in root **`package.json`**) |
| Week 4 — Testnet & full testing | Not started — see **`plan/week-4-testnet-spec.md`** |
| Week 5 — Frontend | Shell (wallet + layout); flows pending |

---

## Next Step

Start **Week 4** using the specification **`plan/week-4-testnet-spec.md`** (testnet deploy, testnet-specific deployment metadata, CCC integration against public testnet RPC, four scenarios + documented explorer hashes). Alternatively advance **backend API + frontend** escrow actions using the same CCC patterns validated in **`backend/src/integration/`** — typically after testnet confidence or in parallel if staffed.

---

## Reference Links

- [CKB JS VM: Mechanism and Capabilities](https://docs.nervos.org/docs/script/js/js-vm)
- [JavaScript / TypeScript Quick Start](https://docs.nervos.org/docs/script/js/js-quick-start)
- [Build a Simple Lock (full-stack example; on-chain TS + CCC)](https://docs.nervos.org/docs/dapp/simple-lock)
- [Ecosystem scripts (deployment status)](https://docs.nervos.org/docs/ecosystem-scripts/introduction)
- [CCC overview](https://docs.ckbccc.com/docs/ccc/)
