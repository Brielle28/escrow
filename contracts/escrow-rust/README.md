# `escrow-rust` (CKB-VM RISC-V)

Escrow **type script** — protocol v1 is specified in `plan/rust-escrow-rewrite-spec.md` (if present in your checkout).

## Build

From repo root (Rust + `riscv64imac-unknown-none-elf` target):

```bash
pnpm run build:contracts
```

Artifact: `target/riscv64imac-unknown-none-elf/release/escrow-rust`

## Deploy & integration

1. `offckb node` (or use public testnet RPC).
2. `pnpm run deploy:devnet` or `pnpm run prep:devnet` — updates `./deployment/` (ensure OffCKB writes or you merge the **`escrow`** entry into `deployment/scripts.json`).
3. CCC integration (`pnpm test:integration`) reads **`deployment/scripts.json`** → `"devnet"|"testnet"` → **`escrow`** (`codeHash`, `hashType`, `cellDeps`). Type script **`args`** are the **169-byte v1 payload** only.
