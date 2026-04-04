# On-chain script unit tests

Bootstrapped with [`create-ckb-js-vm-app`](https://github.com/nervosnetwork/ckb-js-vm).

## Prerequisite: `ckb-debugger`

Tests use **`ckb-testtool`**, which shells out to **`ckb-debugger`** (the [CKB standalone debugger](https://github.com/nervosnetwork/ckb-standalone-debugger)) to run your script bytecode locally.

Install a **ckb-debugger** binary and ensure it is on your **`PATH`** (so `ckb-debugger --version` works in the same terminal you use for `pnpm test`).

## Run tests

From repo `js-vm/` root:

```bash
pnpm run test
```

Or from this package:

```bash
pnpm test
```

The `test` script uses **`cross-env`** so **`NODE_OPTIONS`** works on **Windows** and **Unix**.
