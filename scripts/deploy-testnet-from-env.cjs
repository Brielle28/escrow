/**
 * Reads DEPLOYER_PRIVATE_KEY from backend/.env.local (no key on CLI / shell history).
 * Usage (repo root): node scripts/deploy-testnet-from-env.cjs
 */
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.join(__dirname, "..");
const envPath = path.join(root, "backend", ".env.local");
if (!fs.existsSync(envPath)) {
  console.error("Missing backend/.env.local — copy from backend/.env.example");
  process.exit(1);
}

let pk;
for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
  const trimmed = line.trim();
  if (trimmed.startsWith("#") || !trimmed) continue;
  const m = trimmed.match(/^DEPLOYER_PRIVATE_KEY\s*=\s*(.+)$/);
  if (m) pk = m[1].trim().replace(/^["']|["']$/g, "");
}
if (!pk || !pk.startsWith("0x") || pk.length !== 66) {
  console.error(
    "DEPLOYER_PRIVATE_KEY must be a single line 0x + 64 hex chars in backend/.env.local",
  );
  process.exit(1);
}

const target = path.join(
  root,
  "contracts",
  "escrow-rust",
  "target",
  "riscv64imac-unknown-none-elf",
  "release",
  "escrow-rust",
);
const outDir = path.join(root, "deployment");

const r = spawnSync(
  "offckb",
  [
    "deploy",
    "--network",
    "testnet",
    "-y",
    "--privkey",
    pk,
    "--target",
    target,
    "--output",
    outDir,
  ],
  { stdio: "inherit", shell: true, cwd: root },
);

if (r.error) {
  console.error(r.error);
  process.exit(1);
}
process.exit(r.status ?? 1);
