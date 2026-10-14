import fs from "node:fs/promises";
import { spawn } from "node:child_process";
import { once } from "node:events";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function launchBrowser({ port = 9222 } = {}) {
  const userDataDir = `/tmp/kitab-manual-chrome-${process.pid}-${Date.now()}`;
  const chrome = spawn("google-chrome", ["--headless=new", "--no-sandbox", "--disable-gpu", "--allow-file-access-from-files", `--remote-debugging-port=${port}`, `--user-data-dir=${userDataDir}`, "about:blank"], { stdio: "ignore" });
  let target;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      const targets = await response.json();
      target = targets.find((item) => item.type === "page");
      if (target) break;
    } catch {}
    await sleep(150);
  }
  if (!target) { chrome.kill("SIGTERM"); throw new Error("Chrome DevTools endpoint did not become available."); }
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await once(socket, "open");
  let nextId = 0;
  const pending = new Map();
  const diagnostics = [];
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.method === "Runtime.exceptionThrown") diagnostics.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text || "Uncaught runtime exception");
    if (message.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(message.params.type)) diagnostics.push(message.params.args.map((item) => item.value || item.description || "").join(" "));
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      message.error ? reject(new Error(message.error.message)) : resolve(message.result);
    }
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  await send("Page.enable");
  await send("Runtime.enable");
  return {
    async goto(url) { await send("Page.navigate", { url }); await sleep(500); },
    async waitFor(expression, { timeout = 10000, interval = 100 } = {}) {
      const started = Date.now();
      while (Date.now() - started < timeout) {
        if (await this.eval(expression)) return true;
        await sleep(interval);
      }
      return false;
    },
    async eval(expression) {
      try {
        const response = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
        if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text || "Browser evaluation failed.");
        return response.result.value;
      } catch (error) {
        throw new Error(`Browser evaluation failed for: ${String(expression).slice(0, 180)}\n${error.message}`);
      }
    },
    async viewport(width, height) { await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false }); },
    async screenshot(file) { const { data } = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false }); await fs.writeFile(file, Buffer.from(data, "base64")); },
    async printPdf(file, options = {}) {
      const defaultParams = {
        printBackground: true,
        preferCSSPageSize: true,
        displayHeaderFooter: false,
        marginTop: 0.55,
        marginBottom: 0.55,
        marginLeft: 0.55,
        marginRight: 0.55,
        ...options
      };
      const { data } = await send("Page.printToPDF", defaultParams);
      await fs.writeFile(file, Buffer.from(data, "base64"));
    },
    async close() {
      try { socket.close(); } catch {}
      chrome.kill("SIGTERM");
      const exited = await Promise.race([once(chrome, "exit").then(() => true), sleep(500).then(() => false)]);
      if (!exited) {
        try { chrome.kill("SIGKILL"); } catch {}
      }
      await fs.rm(userDataDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 }).catch(() => {});
    },
    diagnostics
  };
}
