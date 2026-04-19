# Backend (off-chain, headless)

**TypeScript + `@ckb-ccc/ccc`** for integration tests, deploy helpers, and RPC — no React.

Default client and flows will align with your escrow deployment (`scripts.json`, cell deps) as you implement Week 3 in `Project_Documentation.md`.

**Local OffCKB:** Copy `.env.example` → `.env.local`. Set `CKB_RPC_URL` to what `offckb node` prints (proxy often `http://127.0.0.1:28114`). From `offckb accounts`, pick an index and set `DEPLOYER_ADDRESS` / `DEPLOYER_PRIVATE_KEY` (devnet genesis keys — never mainnet). See `plan/offckb-local-setup.md`.

**Phase D integration (CCC):** With `offckb node` running, `pnpm run build:contracts`, deploy artifacts in `deployment/scripts.json`, and:

```bash
offckb system-scripts --export-style ccc -o deployment/system-scripts.devnet.json
```

Then from repo root:

```bash
pnpm test:integration
```

Or from `backend/`: `pnpm integration:devnet`. Optional: `INTEGRATION_SPEND_MODE=release|dispute|timeout` (default `release`). Implementation: `src/integration/runIntegration.ts`.

```bash
# from repo root
pnpm --filter escrow-backend run typecheck
```
