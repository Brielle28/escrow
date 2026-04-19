import { config } from "dotenv";
import { join } from "node:path";
import { repoRoot } from "./paths.js";

export function loadEnv(): void {
  config({ path: join(repoRoot(), "backend", ".env.local") });
  config({ path: join(repoRoot(), "backend", ".env") });
}
