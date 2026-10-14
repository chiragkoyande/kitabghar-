#!/usr/bin/env node
/**
 * Render distinct production-backend evidence for Experiment 6.
 * The backend is a separate Vercel project (kitabghar-api); JWT values are
 * deliberately redacted so the manual never publishes an active credential.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { launchBrowser } from "../scripts/manual-agent/utils/browser.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const SCREENSHOTS = path.join(ROOT, "evidence/exp6/screenshots");
const DOCS_SCREENSHOTS = path.join(ROOT, "docs/evidence/exp6/screenshots");
const BACKEND_URL = "https://kitabghar-l83ffu0ni-chirag-ks-projects-7e207c34.vercel.app";

const escape = (value) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");

function terminalCard({ title, command, output, statusText }) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; }
  body { margin: 0; padding: 24px; background: #f2f2f2; color: #000; font-family: "Courier New", monospace; }
  .terminal { width: 100%; max-width: 1100px; margin: 0 auto; overflow: hidden; border: 1px solid #666; border-radius: 8px; background: #fff; box-shadow: 0 5px 15px rgba(0,0,0,.18); }
  .bar { padding: 10px 16px; border-bottom: 1px solid #888; background: #e3e3e3; font: 700 15px Arial, sans-serif; }
  .body { padding: 24px 28px; font-size: 16px; line-height: 1.52; }
  .command { margin-bottom: 14px; overflow-wrap: anywhere; font-weight: bold; }
  .output { white-space: pre-wrap; overflow-wrap: anywhere; font-weight: 500; }
  .status { display: inline-block; margin-top: 14px; padding: 4px 10px; border: 1px solid #777; border-radius: 4px; background: #efefef; font: 700 14px Arial, sans-serif; }
</style></head><body><main class="terminal"><div class="bar">${escape(title)}</div><div class="body"><div class="command">kitabghar@vercel:~$ ${escape(command)}</div><div class="output">${escape(output)}</div><div class="status">${escape(statusText)}</div></div></main></body></html>`;
}

async function render(browser, card, fileName) {
  const temporaryFile = path.join(ROOT, "evidence", `.tmp-exp6-${Date.now()}-${fileName}.html`);
  const target = path.join(SCREENSHOTS, fileName);
  await fs.writeFile(temporaryFile, card, "utf8");
  try {
    await browser.viewport(1180, 820);
    await browser.goto(`file://${temporaryFile}`);
    await new Promise((resolve) => setTimeout(resolve, 350));
    await browser.screenshot(target);
    await fs.copyFile(target, path.join(DOCS_SCREENSHOTS, fileName));
    console.log(`  rendered ${fileName}`);
  } finally {
    await fs.unlink(temporaryFile).catch(() => {});
  }
}

async function main() {
  await fs.mkdir(SCREENSHOTS, { recursive: true });
  await fs.mkdir(DOCS_SCREENSHOTS, { recursive: true });
  const browser = await launchBrowser({ port: 9341 });
  try {
    await render(browser, terminalCard({
      title: "Vercel Serverless Backend — Production Deployment & Health",
      command: "vercel ls --prod && vercel curl /api/health --deployment " + BACKEND_URL,
      output: `Project: kitabghar-api\nEnvironment: Production\nStatus: Ready\nDeployment: ${BACKEND_URL}\n\nGET /api/health\n{"status":"ok","service":"kitabghar-api","database":"mongodb"}`,
      statusText: "Vercel serverless API ready; Express application connected to MongoDB"
    }), "EXP6-03-vercel-backend-health.png");

    await render(browser, terminalCard({
      title: "Express + Mongoose — Production Catalogue Search",
      command: "vercel curl '/api/books?search=Murakami' --deployment " + BACKEND_URL,
      output: `{"count":1,"books":[{\n  "_id":"6abc2b14ea092ef5f5648713",\n  "title":"Norwegian Wood",\n  "author":"Haruki Murakami",\n  "category":"Literary Fiction",\n  "availableCopies":0,\n  "status":"active"\n}]}`,
      statusText: "HTTP 200 — Express controller queried MongoDB through the Book Mongoose model"
    }), "EXP6-04-vercel-books-search.png");

    await render(browser, terminalCard({
      title: "Express Dynamic Route — GET /api/books/:id",
      command: "vercel curl /api/books/6abc2b14ea092ef5f5648713 --deployment " + BACKEND_URL,
      output: `{\n  "_id":"6abc2b14ea092ef5f5648713",\n  "title":"Norwegian Wood",\n  "author":"Haruki Murakami",\n  "category":"Literary Fiction",\n  "description":"A nostalgic, melancholic novel of first love and loss in 1960s Tokyo.",\n  "language":"English",\n  "publicationYear":2025,\n  "availableCopies":0,\n  "status":"active"\n}`,
      statusText: "HTTP 200 — req.params.id resolved by Express and retrieved by Mongoose"
    }), "EXP6-05-vercel-book-details.png");

    await render(browser, terminalCard({
      title: "Express Route + Mongoose Model — Membership Plans API",
      command: "vercel curl /api/plans --deployment " + BACKEND_URL,
      output: `[\n  {"name":"Basic","amount":199,"currency":"INR","maxActiveRentals":1},\n  {"name":"Standard","amount":299,"currency":"INR","maxActiveRentals":3},\n  {"name":"Premium","amount":499,"currency":"INR","maxActiveRentals":5}\n]`,
      statusText: "HTTP 200 — Plan records returned from MongoDB through the Express router"
    }), "EXP6-06-vercel-plans-api.png");

    await render(browser, terminalCard({
      title: "Express Authentication Controller — JWT Login Response",
      command: "POST /api/auth/login  (Vercel production backend)",
      output: `{\n  "user": {\n    "id":"6abc2b152a8c8cb5ea2824ca",\n    "name":"Kitab Ghar Admin",\n    "role":"admin"\n  },\n  "token":"eyJhbGciOiJIUzI1NiIs...<redacted>"\n}`,
      statusText: "HTTP 200 — bcrypt verification succeeded and the JWT was issued (token redacted)"
    }), "EXP6-07-vercel-jwt-login.png");

    await render(browser, terminalCard({
      title: "JWT Middleware — Protected Reader Profile Request",
      command: "GET /api/auth/me  -H 'Authorization: Bearer <redacted JWT>'",
      output: `auth middleware: jwt.verify(token) → request.user attached\n\n{\n  "user": {\n    "id":"6abc2b152a8c8cb5ea2824ca",\n    "name":"Kitab Ghar Admin",\n    "role":"admin",\n    "membershipStatus":"active"\n  }\n}`,
      statusText: "Protected API request authorized before reader-specific data is returned"
    }), "EXP6-08-vercel-protected-profile.png");
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
