# Contracts (on-chain)

TypeScript lock scripts for **ckb-js-vm**, plus **unit tests** (Jest + `ckb-testtool` + `ckb-debugger`).

| Package | Role |
|---------|------|
| `on-chain-script` | Build `dist/index.bc` from `src/index.ts` |
| `on-chain-script-tests` | VM tests; reads `../on-chain-script/dist/index.bc` |

From **repository root**:

```bash
pnpm install
pnpm run build:contracts
pnpm run test
```

**Windows:** `ckb-debugger` must be on **`PATH`** for the terminal you use. If **PowerShell** cannot find it but **Git Bash** can, run `pnpm run build:contracts` and `pnpm run test` from Git Bash, or fix your system PATH.
