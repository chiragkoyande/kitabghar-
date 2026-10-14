#!/usr/bin/env node
/**
 * Kitab Ghar · Generate ONLY the combined all-in-one PDF
 *
 * Builds all 10 experiments into temporary PDFs, applies page border boxes,
 * merges them into WT_All_Experiments_KitabGhar.pdf, then cleans up temps.
 * Does NOT overwrite individual experiment-XX.pdf files.
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

async function generateCombinedOnly() {
  console.log("════════════════════════════════════════════════════════");
  console.log("  Kitab Ghar — Generating Combined All-In-One PDF Only");
  console.log("  Individual experiment PDFs will NOT be modified.");
  console.log("════════════════════════════════════════════════════════\n");

  const manualsDir = path.join(ROOT, "manuals");
  await fs.mkdir(manualsDir, { recursive: true });

  const browser = await launchBrowser({ port: 9337 });
  console.log("Chrome launched for PDF compilation.\n");

  const tempPdfFiles = [];
  const tempFiles = []; // track all temp files for cleanup

  try {
    for (const exp of experimentData) {
      const expNumStr = String(exp.number).padStart(2, "0");
      console.log(`Processing Experiment ${exp.number}: ${exp.title.slice(0, 45)}...`);

      // Build HTML with updated template (figure title below image, centered)
      // Use "manuals" targetDir so relative paths resolve correctly from manuals/
      const html = buildHtmlManual(exp, "manuals");
      const htmlFile = path.join(manualsDir, `.tmp-combined-${expNumStr}.html`);
      const rawPdfFile = path.join(manualsDir, `.tmp-raw-${expNumStr}.pdf`);

      tempFiles.push(htmlFile, rawPdfFile);

      await fs.writeFile(htmlFile, html, "utf8");

      // Render HTML to PDF
      await browser.goto(`file://${htmlFile}`);
      await new Promise(r => setTimeout(r, 600));
      await browser.printPdf(rawPdfFile);

      tempPdfFiles.push(rawPdfFile);
      console.log(`  ✅ Temp raw PDF ready: experiment-${expNumStr}.pdf`);
    }
  } finally {
    await browser.close();
  }

  // Merge all raw PDFs into one unbordered master PDF
  console.log("\nMerging all 10 experiments into master raw PDF...");
  const rawMergedPdf = path.join(manualsDir, ".tmp-master-raw.pdf");
  tempFiles.push(rawMergedPdf);

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
  await exec("python3", ["-c", mergeScript, ...tempPdfFiles, rawMergedPdf]);

  // Apply clean black box page border and continuous sequential page numbering
  console.log("Applying professional border box and continuous page numbering...");
  const mergedPdfFile = path.join(manualsDir, "WT_All_Experiments_KitabGhar.pdf");
  const borderScript = path.join(ROOT, "scripts/manual-agent/utils/add-pdf-page-border.py");
  await exec("python3", [borderScript, rawMergedPdf, mergedPdfFile]);
  console.log(`  ✅ Master Consolidated Manual: manuals/WT_All_Experiments_KitabGhar.pdf`);

  // Also copy to docs
  const docsPdfDir = path.join(ROOT, "docs/manuals/pdf");
  await fs.mkdir(docsPdfDir, { recursive: true });
  await fs.copyFile(mergedPdfFile, path.join(docsPdfDir, "WT_All_Experiments_KitabGhar.pdf")).catch(() => {});

  // Clean up temp files
  for (const f of tempFiles) {
    await fs.unlink(f).catch(() => {});
  }
  console.log("  🧹 Cleaned up temporary files.\n");

  console.log("════════════════════════════════════════════════════════");
  console.log("  Combined PDF Updated. Individual PDFs Unchanged.");
  console.log("════════════════════════════════════════════════════════\n");
}

generateCombinedOnly().catch(err => {
  console.error("Combined PDF generation failed:", err);
  process.exit(1);
});
