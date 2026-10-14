import { spawn } from "node:child_process";

export function run(command, args, { cwd, timeout = 30000 } = {}) {
  return new Promise((resolve) => {
    const process = spawn(command, args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => process.kill("SIGTERM"), timeout);
    process.stdout.on("data", (chunk) => { stdout += chunk; });
    process.stderr.on("data", (chunk) => { stderr += chunk; });
    process.on("close", (code) => { clearTimeout(timer); resolve({ code, stdout, stderr }); });
    process.on("error", (error) => { clearTimeout(timer); resolve({ code: 1, stdout, stderr: `${stderr}${error.message}` }); });
  });
}
