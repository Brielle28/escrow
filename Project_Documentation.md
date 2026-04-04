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
| Frontend | **React + CCC** | Pending — after on-chain script and backend tests are solid |

**You do not use Rust or Capsule for the primary on-chain contract path.** The contract lives as **QuickJS bytecode** (or bundled JS) loaded via **`ckb-js-vm`**; your repo is a **`ckb-js-vm`** style TypeScript project, not a Capsule Rust crate.

**Network note:** Before assuming **mainnet**, check current **`ckb-js-vm`** deployment status in [Ecosystem scripts](https://docs.nervos.org/docs/ecosystem-scripts/introduction). Official docs recommend **Devnet / Testnet** for JS VM work until you confirm availability on your target network.

---

## Project Phases

```
Phase 1: Setup & Environment        ← We start here
Phase 2: Write the Escrow Lock Script (TypeScript → ckb-js-vm)
Phase 3: Deploy & Test Locally (OffCKB + CCC test scripts)
Phase 4: Move to Testnet
Phase 5: Frontend (Pending)
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
5. Run `pnpm install` and `pnpm build` in the project root; fix any environment issues until build succeeds
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

1. `pnpm build` (or your repo’s build) to produce deployment artifacts
2. Deploy to Devnet, e.g. `pnpm run deploy --network devnet` (or OffCKB deploy flow you adopt — align with [Simple Lock](https://docs.nervos.org/docs/dapp/simple-lock) **Deploy** section)
3. Save **`scripts.json`** / deployment metadata your **CCC** code will read for **code hashes**, **hash types**, and **cell deps**
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

6. Run each test from the terminal (e.g. `pnpm test:integration` or `tsx scripts/...`)

**Success check**

- All four scenarios **pass** against **local Devnet**
- You can point to **on-chain txs** (hashes) for each scenario
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

## Week 5 & Beyond — Frontend (Pending)

**Goal:** Build the React frontend that uses **CCC** to drive the same flows you already tested in TypeScript.

This phase starts only after Week 4 is complete for your chosen network.

**Planned UI:**

- Wallet connection (CCC connector)
- Depositor flow: lock funds
- Recipient / arbiter flows: correct witness construction for release or dispute paths
- Timeout refund flow for depositor
- Transaction status / links to explorer

Full frontend documentation can be added when you start this phase.

---

# Project Folder Structure (TypeScript + ckb-js-vm)

Use a **monorepo** similar to official examples (adjust names to taste):

```
escrow-ckb/
│
├── packages/
│   ├── escrow-lock/              ← TypeScript on-chain escrow lock (ckb-js-vm)
│   │   ├── src/
│   │   │   └── main.ts           ← entry; compiles to .bc / deploy bundle
│   │   └── package.json
│   │
│   └── escrow-lock-tests/        ← Unit tests (ckb-testtool)
│       └── ...
│
├── integration-tests/            ← TypeScript + CCC (local + testnet)
│   ├── lock-funds.ts
│   ├── release.ts
│   ├── timeout-refund.ts
│   └── dispute-refund.ts
│
├── scripts/
│   └── deploy.ts                 ← Optional wrapper around deploy CLI
│
├── deployment/                   ← Generated: scripts.json, cell deps (gitignore or commit per team policy)
│
├── frontend/                     ← React + CCC (PENDING)
│
├── package.json                  ← pnpm workspace root
├── pnpm-workspace.yaml
└── README.md
```

If you used **`pnpm create ckb-js-vm-app`**, you may keep that tool’s default package names (`on-chain-script`, `on-chain-script-tests`) and treat the above as a **logical** map.

---

# Current Status

| Phase | Status |
|-------|--------|
| Week 1 — Setup & Environment | Not started |
| Week 2 — Escrow lock (TypeScript / ckb-js-vm) | Not started |
| Week 3 — Deploy & integration tests (CCC) | Not started |
| Week 4 — Testnet & full testing | Not started |
| Week 5 — Frontend | Pending |

---

## Next Step

When you are ready, start with **Week 1**: OffCKB Devnet + a building **`ckb-js-vm`** TypeScript project + CCC wired for later integration tests.

---

## Reference Links

- [CKB JS VM: Mechanism and Capabilities](https://docs.nervos.org/docs/script/js/js-vm)
- [JavaScript / TypeScript Quick Start](https://docs.nervos.org/docs/script/js/js-quick-start)
- [Build a Simple Lock (full-stack example; on-chain TS + CCC)](https://docs.nervos.org/docs/dapp/simple-lock)
- [Ecosystem scripts (deployment status)](https://docs.nervos.org/docs/ecosystem-scripts/introduction)
- [CCC overview](https://docs.ckbccc.com/docs/ccc/)
