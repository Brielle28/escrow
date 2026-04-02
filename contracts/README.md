# Contracts

| Path | Role |
|------|------|
| `escrow-rust/` | **On-chain** escrow type script — Rust → **RISC-V** (`cargo build --target riscv64imac-unknown-none-elf`). |

Protocol v1 is documented in `plan/rust-escrow-rewrite-spec.md` (repo root may gitignore `plan/`).

## Commands (from repo root)

```bash
pnpm run build:contracts   # compile escrow-rust for CKB-VM
pnpm run test              # cargo test in escrow-rust
```

**Rust:** install `riscv64imac-unknown-none-elf` (`rustup target add …`). The `ckb-std` crate is configured **without** the `libc` feature so you do not need a RISC-V GCC for C stubs on Windows.
