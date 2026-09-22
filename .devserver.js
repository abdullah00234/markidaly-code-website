import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isWin = process.platform === "win32";
const npmCmd = isWin ? "npm.cmd" : "npm";

const child = spawn(npmCmd, ["run", "dev"], {
  cwd: __dirname,
  stdio: "inherit",
  shell: isWin,
});

child.on("exit", (code) => process.exit(code ?? 0));
