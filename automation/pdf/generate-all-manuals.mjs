#!/usr/bin/env node
/**
 * Kitab Ghar · Master Manual & PDF Generation Script
 * 
 * Compiles academic-grade Black & White HTML practical manuals for Experiments 1 through 10,
 * prints them to PDF via Chrome DevTools Protocol, puts all experiment manuals in ONE folder (manuals/),
 * and creates a merged all-in-one PDF document.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { launchBrowser } from "../../scripts/manual-agent/utils/browser.mjs";
import { buildHtmlManual } from "./manual-template.mjs";
import { experimentData } from "./manuals-data.mjs";

const exec = promisify(execFile);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");

async function generateManuals() {
  console.log("════════════════════════════════════════════════════════");
  console.log("  Kitab Ghar — Compiling All 10 Laboratory Manuals");
  console.log("  Format: Academic Black & White (No Cover Page)");
  console.log("  Destination: manuals/ (Single Consolidated Folder)");
  console.log("════════════════════════════════════════════════════════\n");

  const manualsDir = path.join(ROOT, "manuals");
  const docsManualDir = path.join(ROOT, "docs/manuals/generated");
  const docsPdfDir = path.join(ROOT, "docs/manuals/pdf");

  await fs.mkdir(manualsDir, { recursive: true });
  await fs.mkdir(docsManualDir, { recursive: true });
  await fs.mkdir(docsPdfDir, { recursive: true });

  const browser = await launchBrowser({ port: 9336 });
  console.log("Chrome launched for PDF compilation.\n");

  const generatedPdfFiles = [];

  try {
    for (const exp of experimentData) {
      const expNumStr = String(exp.number).padStart(2, "0");
      console.log(`Processing Experiment ${exp.number}: ${exp.title.slice(0, 45)}...`);

      // 1. Build HTML string (pure Black & White, starts immediately on page 1)
      const html = buildHtmlManual(exp, "manuals");
      const docsHtml = buildHtmlManual(exp, "docs");

      const htmlFile = path.join(manualsDir, `experiment-${expNumStr}.html`);
      const docsHtmlFile = path.join(docsManualDir, `experiment-${expNumStr}.html`);
      const pdfFile = path.join(manualsDir, `experiment-${expNumStr}.pdf`);
      const docsPdfFile = path.join(docsPdfDir, `experiment-${expNumStr}.pdf`);

      await fs.writeFile(htmlFile, html, "utf8");
      await fs.writeFile(docsHtmlFile, docsHtml, "utf8");

      // 2. Render directly to PDF with Chrome DevTools Protocol
      const rawPdfFile = path.join(manualsDir, `raw-experiment-${expNumStr}.pdf`);
      await browser.goto(`file://${htmlFile}`);
      await new Promise(r => setTimeout(r, 600));
      await browser.printPdf(rawPdfFile);

      // 3. Apply clean black box border and page numbering to every page
      const borderScript = path.join(ROOT, "scripts/manual-agent/utils/add-pdf-page-border.py");
      await exec("python3", [borderScript, rawPdfFile, pdfFile]);
      await fs.unlink(rawPdfFile).catch(() => {});

      // Copy to docs/manuals/pdf
      await fs.copyFile(pdfFile, docsPdfFile);

      generatedPdfFiles.push(pdfFile);
      console.log(`  ✅ Generated PDF (with Box Border): manuals/experiment-${expNumStr}.pdf`);
    }
  } finally {
    await browser.close();
  }

  // 3. Create merged master manual containing all 10 experiments in sequence
  console.log("\nMerging all 10 experiments into master manual...");
  const mergedPdfFile = path.join(manualsDir, "WT_All_Experiments_KitabGhar.pdf");
  const mergeScript = `
import sys
from PyPDF2 import PdfMerger

merger = PdfMerger()
for pdf in sys.argv[1:-1]:
    merger.append(pdf)
merger.write(sys.argv[-1])
merger.close()
print("Merged successfully")
`;
  try {
    await exec("python3", ["-c", mergeScript, ...generatedPdfFiles, mergedPdfFile]);
    await fs.copyFile(mergedPdfFile, path.join(docsPdfDir, "WT_All_Experiments_KitabGhar.pdf"));
    console.log(`  ✅ Master Consolidated Manual: manuals/WT_All_Experiments_KitabGhar.pdf`);
  } catch (mergeErr) {
    console.error("  ⚠️ Merge failed:", mergeErr.message);
  }

  console.log("\n════════════════════════════════════════════════════════");
  console.log("  All 10 Experiment PDFs Generated in: manuals/");
  console.log("════════════════════════════════════════════════════════\n");
}

generateManuals().catch(err => {
  console.error("PDF generation failed:", err);
  process.exit(1);
});
