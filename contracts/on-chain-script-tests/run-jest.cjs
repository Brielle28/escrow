/**
 * Prepend repo `tools/` (ckb-debugger) to PATH so ckb-testtool can spawn it.
 */
const { spawnSync } = require("child_process");
const path = require("path");

const toolsDir = path.join(__dirname, "..", "..", "tools");
const key = process.platform === "win32" ? "Path" : "PATH";
process.env[key] = toolsDir + path.delimiter + process.env[key];

const result = spawnSync(
  "jest",
  process.argv.slice(2),
  { stdio: "inherit", shell: true },
);
process.exit(result.status ?? 1);
