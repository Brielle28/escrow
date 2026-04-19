import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Repo root: backend/src/integration → ../../../ */
export function repoRoot(): string {
  return join(__dirname, "..", "..", "..");
}

export function deploymentDir(): string {
  return join(repoRoot(), "deployment");
}
