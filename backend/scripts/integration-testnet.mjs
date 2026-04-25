/**
 * Sets CKB_NETWORK=testnet for this process tree (`.env.local` can omit it).
 * Requires testnet `CKB_RPC_URL` + funded `DEPLOYER_PRIVATE_KEY` in `backend/.env.local`.
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const backendRoot = path.join(fileURLToPath(new URL(".", import.meta.url)), "..");
const r = spawnSync("npx", ["tsx", "src/integration/runIntegration.ts"], {
  cwd: backendRoot,
  stdio: "inherit",
  env: { ...process.env, CKB_NETWORK: "testnet" },
  shell: true,
});

process.exit(r.status ?? 1);
