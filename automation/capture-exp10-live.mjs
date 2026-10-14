#!/usr/bin/env node
/**
 * Kitab Ghar · Live Cloud Deployment Evidence Capture (Experiment 10)
 * 
 * Captures live production evidence directly from the deployed Vercel application:
 * URL: https://kitabghar.clients.chiragk.online
 * Database: MongoDB Atlas Replica Set Cluster
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { launchBrowser } from "../scripts/manual-agent/utils/browser.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const EVIDENCE_EXP10 = path.join(ROOT, "evidence/exp10/screenshots");
const DOCS_EXP10 = path.join(ROOT, "docs/evidence/exp10/screenshots");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function captureLiveEvidence() {
  console.log("════════════════════════════════════════════════════════");
  console.log("  Kitab Ghar — Capturing Live Vercel Deployment Evidence");
  console.log("  Target URL: https://kitabghar.clients.chiragk.online");
  console.log("════════════════════════════════════════════════════════\n");

  await fs.mkdir(EVIDENCE_EXP10, { recursive: true });
  await fs.mkdir(DOCS_EXP10, { recursive: true });

  const browser = await launchBrowser({ port: 9338 });
  console.log("Chrome launched for live production capture.\n");

  try {
    await browser.viewport(1280, 850);

    // 1. Live Production Home
    console.log("Capturing Live Production Homepage...");
    await browser.goto("https://kitabghar.clients.chiragk.online");
    await sleep(2500);
    const shot1 = path.join(EVIDENCE_EXP10, "01-deployment-evidence.png");
    await browser.screenshot(shot1);
    await fs.copyFile(shot1, path.join(DOCS_EXP10, "01-deployment-evidence.png"));
    console.log("  📸 01-deployment-evidence.png (Live Homepage)");

    // 2. Live Books Catalogue
    console.log("Capturing Live Books Catalogue...");
    await browser.goto("https://kitabghar.clients.chiragk.online/books");
    await sleep(2500);
    const shot2 = path.join(EVIDENCE_EXP10, "02-deployment-evidence.png");
    await browser.screenshot(shot2);
    await fs.copyFile(shot2, path.join(DOCS_EXP10, "02-deployment-evidence.png"));
    console.log("  📸 02-deployment-evidence.png (Live Books Catalogue)");

    // 3. Live Membership Page
    console.log("Capturing Live Membership Page...");
    await browser.goto("https://kitabghar.clients.chiragk.online/membership");
    await sleep(2000);
    const shot3 = path.join(EVIDENCE_EXP10, "03-deployment-evidence.png");
    await browser.screenshot(shot3);
    await fs.copyFile(shot3, path.join(DOCS_EXP10, "03-deployment-evidence.png"));
    console.log("  📸 03-deployment-evidence.png (Live Membership Page)");

    // 4. Live Login Route
    console.log("Capturing Live Login Route...");
    await browser.goto("https://kitabghar.clients.chiragk.online/login");
    await sleep(1800);
    const shot4 = path.join(EVIDENCE_EXP10, "04-deployment-evidence.png");
    await browser.screenshot(shot4);
    await fs.copyFile(shot4, path.join(DOCS_EXP10, "04-deployment-evidence.png"));
    console.log("  📸 04-deployment-evidence.png (Live Login Route)");

  } finally {
    await browser.close();
  }

  console.log("\n✅ Live production screenshots captured successfully.");
}

captureLiveEvidence().catch(err => {
  console.error("Capture failed:", err);
  process.exit(1);
});
