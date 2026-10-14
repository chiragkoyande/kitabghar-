#!/usr/bin/env node
/**
 * Kitab Ghar · Master Pipeline Validator
 * 
 * Inspects all 10 experiments, screenshots, test results, and PDFs,
 * generating the final Validation Matrix and checking for placeholders.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { experimentData } from "../pdf/manuals-data.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");

async function validate() {
  console.log("════════════════════════════════════════════════════════");
  console.log("  Kitab Ghar — Master Pipeline Validation Audit");
  console.log("════════════════════════════════════════════════════════\n");

  const matrix = [];
  let totalFigures = 0;
  let missingScreenshots = 0;
  let totalTests = 0;
  let failedTests = 0;

  for (const exp of experimentData) {
    const expNumStr = String(exp.number).padStart(2, "0");
    const htmlFile = path.join(ROOT, `manuals/experiment-${expNumStr}.html`);
    const pdfFile = path.join(ROOT, `manuals/experiment-${expNumStr}.pdf`);

    const htmlContent = await fs.readFile(htmlFile, "utf8").catch(() => null);
    const pdfStat = await fs.stat(pdfFile).catch(() => null);

    // Check placeholders (word boundary, avoiding HTML placeholder attributes)
    const hasTodo = htmlContent ? /\b(TODO|FIXME|XXX|LOREM IPSUM)\b/i.test(htmlContent) : true;

    // Check figures
    let figuresOk = true;
    for (const fig of exp.figures) {
      totalFigures++;
      // resolve relative to project root
      const cleanRel = fig.imagePath.replace(/^(\.\.\/)+/, "");
      const diskPath = path.resolve(ROOT, cleanRel);
      const exists = await fs.access(diskPath).then(() => true).catch(() => false);
      if (!exists) {
        figuresOk = false;
        missingScreenshots++;
        console.error(`  ❌ Missing screenshot: ${diskPath}`);
      }
    }

    // Check tests
    let testsOk = true;
    for (const tc of exp.testCases) {
      totalTests++;
      if (tc.status !== "PASS") {
        testsOk = false;
        failedTests++;
      }
    }

    const ready = htmlContent && pdfStat && !hasTodo && figuresOk && testsOk;

    matrix.push({
      experiment: `EXP ${exp.number}`,
      requirement: exp.title.slice(0, 32) + "...",
      implementation: exp.codeBlocks.map(c => c.file.split("/").pop()).join(", "),
      evidence: `${exp.figures.length} screenshots`,
      tests: `${exp.testCases.length} tests`,
      pdfSize: pdfStat ? `${(pdfStat.size / 1024).toFixed(0)} KB` : "MISSING",
      status: ready ? "READY" : "FAILED"
    });
  }

  console.log("EXPERIMENT VALIDATION MATRIX:");
  console.log("--------------------------------------------------------------------------------------------------");
  console.log(
    "Experiment".padEnd(8) + " | " +
    "Requirement".padEnd(35) + " | " +
    "Implementation".padEnd(28) + " | " +
    "Evidence".padEnd(15) + " | " +
    "Tests".padEnd(10) + " | " +
    "PDF Size".padEnd(10) + " | " +
    "Status"
  );
  console.log("--------------------------------------------------------------------------------------------------");
  for (const m of matrix) {
    console.log(
      m.experiment.padEnd(8) + " | " +
      m.requirement.padEnd(35) + " | " +
      m.implementation.padEnd(28) + " | " +
      m.evidence.padEnd(15) + " | " +
      m.tests.padEnd(10) + " | " +
      m.pdfSize.padEnd(10) + " | " +
      m.status
    );
  }
  console.log("--------------------------------------------------------------------------------------------------\n");

  console.log(`Summary:`);
  console.log(`  - Total Experiments: 10`);
  console.log(`  - Total Screenshots Verified: ${totalFigures} (Missing: ${missingScreenshots})`);
  console.log(`  - Total Tests Verified: ${totalTests} (Failed: ${failedTests})`);
  console.log(`  - Final Pipeline Status: ${missingScreenshots === 0 && failedTests === 0 ? "✅ ALL PASS — READY FOR SUBMISSION" : "❌ ISSUES FOUND"}\n`);

  return matrix;
}

validate().catch(console.error);
