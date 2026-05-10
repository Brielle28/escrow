# Backend (off-chain, headless)

**TypeScript + `@ckb-ccc/ccc`** for integration tests, deploy helpers, and RPC — no React.

## Wallet session API (client + freelancer)

You can now run a lightweight auth server for wallet-backed sessions:

```bash
pnpm --filter escrow-backend dev
```

Base URL defaults to `http://localhost:8787` and provides:

- `POST /api/auth/challenge` (address + role => nonce/message)
- `POST /api/auth/verify` (address + role + nonce + signature => session token)
- `GET /api/auth/session` (Bearer token => session details)
- `DELETE /api/auth/session` (Bearer token => logout)

`FRONTEND_ORIGIN` and `PORT` can be configured in `.env.local`.

Default client and flows will align with your escrow deployment (`scripts.json`, cell deps) as you implement Week 3 in `Project_Documentation.md`.

**Local OffCKB:** Copy `.env.example` → `.env.local`. Set `CKB_RPC_URL` to what `offckb node` prints (proxy often `http://127.0.0.1:28114`). From `offckb accounts`, pick an index and set `DEPLOYER_ADDRESS` / `DEPLOYER_PRIVATE_KEY` (devnet genesis keys — never mainnet). See `plan/offckb-local-setup.md`.

**Phase D integration (CCC):** With `offckb node` running, `pnpm run build:contracts` (Rust escrow binary), ensure **`deployment/scripts.json`** has an **`escrow`** entry for your network, and:

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
