import { spawn } from "node:child_process";
import { fromRoot } from "../utils/files.mjs";
import { launchBrowser } from "../utils/browser.mjs";

const waitFor = async (url) => {
  let lastError = "";
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try { const response = await fetch(url); if (response.ok) return response.status; } catch (error) { lastError = error.message; }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`Static server did not respond: ${lastError}`);
};

export async function startExperimentRuntime(experiment) {
  if (![1, 2, 3, 4, 6, 9].includes(experiment.id)) throw new Error(`Runtime collection has not yet been implemented for Experiment ${experiment.id}.`);
  if (experiment.id === 1 || experiment.id === 3) {
    const apiPort = experiment.id === 1 ? 5005 : 5002;
    const clientPort = experiment.id === 1 ? 5180 : 5177;
    const api = spawn(process.execPath, ["server.js"], { cwd: fromRoot("server"), stdio: "ignore", env: { ...process.env, PORT: String(apiPort), CLIENT_ORIGIN: `http://localhost:${clientPort}` } });
    try {
      await waitFor(`http://127.0.0.1:${apiPort}/api/health`);
      const client = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "--host", "localhost", "--port", String(clientPort), "--force"], { cwd: fromRoot("client"), stdio: "ignore", env: { ...process.env, VITE_API_URL: `http://127.0.0.1:${apiPort}/api` } });
      try {
        await waitFor(`http://localhost:${clientPort}/`);
        const browser = await launchBrowser({ port: 9222 });
        return {
          url: `http://localhost:${clientPort}/`,
          apiUrl: `http://127.0.0.1:${apiPort}/api`,
          apiPort,
          clientPort,
          browser,
          command: `PORT=${apiPort} CLIENT_ORIGIN=http://localhost:${clientPort} node server.js + VITE_API_URL=http://127.0.0.1:${apiPort}/api node node_modules/vite/bin/vite.js --host localhost --port ${clientPort} --force`,
          async close() { await browser.close(); client.kill("SIGTERM"); api.kill("SIGTERM"); }
        };
      } catch (error) { client.kill("SIGTERM"); throw error; }
    } catch (error) { api.kill("SIGTERM"); throw error; }
  }
  if (experiment.id === 2 || experiment.id === 4 || experiment.id === 6 || experiment.id === 9) {
    const apiPort = experiment.id === 2 ? 5001 : 5003;
    const clientPort = experiment.id === 2 ? 5176 : 5178;
    const api = spawn("npm", ["run", "dev"], { cwd: fromRoot("server"), stdio: "ignore", env: { ...process.env, PORT: String(apiPort), CLIENT_ORIGIN: `http://127.0.0.1:${clientPort}` } });
    try {
      await waitFor(`http://127.0.0.1:${apiPort}/api/health`);
      const client = spawn("npm", ["run", "dev", "--", "--host", "127.0.0.1", "--port", String(clientPort)], { cwd: fromRoot("client"), stdio: "ignore", env: { ...process.env, VITE_API_URL: `http://127.0.0.1:${apiPort}/api` } });
      try {
        await waitFor(`http://127.0.0.1:${clientPort}/`);
        const browser = await launchBrowser({ port: 9222 });
        return {
          url: `http://127.0.0.1:${clientPort}/`,
          apiUrl: `http://127.0.0.1:${apiPort}/api`,
          apiPort,
          clientPort,
          browser,
          command: `PORT=${apiPort} CLIENT_ORIGIN=http://127.0.0.1:${clientPort} npm run dev (server) + VITE_API_URL=http://127.0.0.1:${apiPort}/api npm run dev -- --host 127.0.0.1 --port ${clientPort} (client)`,
          async close() { await browser.close(); client.kill("SIGTERM"); api.kill("SIGTERM"); }
        };
      } catch (error) { client.kill("SIGTERM"); throw error; }
    } catch (error) { api.kill("SIGTERM"); throw error; }
  }
  const port = experiment.id === 1 ? 4173 : experiment.id === 2 ? 5176 : 4176;
  const directory = experiment.id === 2 ? fromRoot("client") : fromRoot(experiment.path);
  const isReact = experiment.id === 4;
  const isMainClient = experiment.id === 2;
  const server = isReact || isMainClient
    ? spawn("npm", ["run", "dev", "--", "--host", "127.0.0.1", "--port", String(port)], { cwd: directory, stdio: "ignore" })
    : spawn("python3", ["-m", "http.server", String(port), "--directory", directory], { stdio: "ignore" });
  try {
    const pagePath = isReact || isMainClient ? "" : "index.html";
    await waitFor(`http://127.0.0.1:${port}/${pagePath}`);
    const browser = await launchBrowser({ port: 9222 });
    return {
      url: `http://127.0.0.1:${port}/${pagePath}`, browser,
      command: isReact || isMainClient ? `npm run dev -- --host 127.0.0.1 --port ${port}` : `python3 -m http.server ${port} --directory ${experiment.path}`,
      async close() { await browser.close(); server.kill("SIGTERM"); }
    };
  } catch (error) { server.kill("SIGTERM"); throw error; }
}
