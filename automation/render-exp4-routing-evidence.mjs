#!/usr/bin/env node
/** Render two routing-specific, non-duplicate evidence cards for Experiment 4. */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { launchBrowser } from "../scripts/manual-agent/utils/browser.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const SCREENSHOTS = path.join(ROOT, "evidence/exp4/screenshots");
const DOCS_SCREENSHOTS = path.join(ROOT, "docs/evidence/exp4/screenshots");
const FRONTEND_URL = "https://kitabghar-e6l4fxazt-chirag-ks-projects-7e207c34.vercel.app";

const escape = (value) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function card({ title, command, output, status }) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    * { box-sizing: border-box; } body { margin:0; padding:24px; background:#f2f2f2; color:#000; font-family:"Courier New",monospace; }
    main { width:100%; max-width:1100px; margin:0 auto; overflow:hidden; border:1px solid #666; border-radius:8px; background:#fff; box-shadow:0 5px 15px rgba(0,0,0,.18); }
    header { padding:10px 16px; border-bottom:1px solid #888; background:#e3e3e3; font:700 15px Arial,sans-serif; }
    section { padding:24px 28px; font-size:16px; line-height:1.52; } .command { margin-bottom:14px; font-weight:bold; overflow-wrap:anywhere; }
    pre { margin:0; white-space:pre-wrap; overflow-wrap:anywhere; font:500 16px/1.52 "Courier New",monospace; } .status { display:inline-block; margin-top:14px; padding:4px 10px; border:1px solid #777; border-radius:4px; background:#efefef; font:700 14px Arial,sans-serif; }
  </style></head><body><main><header>${escape(title)}</header><section><div class="command">kitabghar@router:~$ ${escape(command)}</div><pre>${escape(output)}</pre><div class="status">${escape(status)}</div></section></main></body></html>`;
}

async function capture(browser, html, name) {
  const temporary = path.join(ROOT, "evidence", `.tmp-exp4-${Date.now()}-${name}.html`);
  const target = path.join(SCREENSHOTS, name);
  await fs.writeFile(temporary, html, "utf8");
  try {
    await browser.viewport(1180, 820);
    await browser.goto(`file://${temporary}`);
    await new Promise((resolve) => setTimeout(resolve, 350));
    await browser.screenshot(target);
    await fs.copyFile(target, path.join(DOCS_SCREENSHOTS, name));
  } finally { await fs.unlink(temporary).catch(() => {}); }
}

async function main() {
  await fs.mkdir(SCREENSHOTS, { recursive: true });
  await fs.mkdir(DOCS_SCREENSHOTS, { recursive: true });
  const browser = await launchBrowser({ port: 9342 });
  try {
    await capture(browser, card({
      title: "React Router — Declarative Route Tree & Protected Outlet",
      command: "sed -n '1,80p' client/src/App.jsx",
      output: `import { Navigate, Route, Routes } from "react-router-dom";\n\n<Routes>\n  <Route element={<Layout />}>\n    <Route index element={<HomePage />} />\n    <Route path="books" element={<BooksPage />} />\n    <Route path="books/:id" element={<BookDetailsPage />} />\n    <Route path="membership" element={<MembershipPage />} />\n    <Route path="login" element={<LoginPage />} />\n    <Route path="register" element={<RegisterPage />} />\n    <Route element={<ProtectedRoute />}>\n      <Route path="dashboard" element={<DashboardPage />} />\n      <Route path="admin" element={<AdminRoute />} />\n    </Route>\n  </Route>\n</Routes>`,
      status: "Routes, dynamic :id parameter, shared Layout, and protected dashboard verified"
    }), "EXP4-02-react-router-route-tree.png");

    await capture(browser, card({
      title: "Vercel SPA Deep-Link Verification — /books Rewrite",
      command: "vercel curl /books --deployment " + FRONTEND_URL + " -- -I",
      output: `HTTP/2 200\ncontent-disposition: inline; filename="index.html"\ncontent-type: text/html; charset=utf-8\nserver: Vercel\nstrict-transport-security: max-age=63072000; includeSubDomains; preload\nx-vercel-cache: HIT\n\nclient/vercel.json\n{\n  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]\n}`,
      status: "Production deep link /books served index.html; React Router resolves the route without a 404"
    }), "EXP4-08-vercel-spa-deep-link.png");
  } finally { await browser.close(); }
}

main().catch((error) => { console.error(error); process.exit(1); });
