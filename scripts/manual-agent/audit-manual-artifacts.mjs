import fs from "node:fs/promises";
import path from "node:path";
import { validateContent } from "./validators/contentValidator.mjs";
import { validateEvidence } from "./validators/evidenceValidator.mjs";
import { validatePdf } from "./validators/pdfValidator.mjs";
import { validateScreenshots } from "./validators/screenshotValidator.mjs";

const root = process.cwd();
const ids = process.argv.slice(2).map(Number).filter((id) => Number.isInteger(id) && id >= 1 && id <= 10);
if (!ids.length) throw new Error("Usage: node scripts/manual-agent/audit-manual-artifacts.mjs <experiment...>");

for (const id of ids) {
  const evidenceDir = path.join(root, "docs", "evidence", `exp${id}`);
  const [evidence, figures, testReport] = await Promise.all([
    fs.readFile(path.join(evidenceDir, "evidence.json"), "utf8").then(JSON.parse),
    fs.readFile(path.join(evidenceDir, "figure-manifest.json"), "utf8").then(JSON.parse),
    fs.readFile(path.join(evidenceDir, "test-results.json"), "utf8").then(JSON.parse),
  ]);
  const snippetDir = path.join(evidenceDir, "snippets");
  const snippets = await fs.readdir(snippetDir).catch(() => []);
  const padded = String(id).padStart(2, "0");
  const validation = {
    generatedAt: new Date().toISOString(),
    evidence: validateEvidence({ experiment: { id }, snippets, figures, testReport, evidence }),
    screenshots: await validateScreenshots(figures, evidenceDir, Math.min(7, evidence.screenshots_required || 7)),
    content: await validateContent(path.join(root, "docs", "manuals", "generated", `experiment-${padded}.html`)),
    pdf: await validatePdf(path.join(root, "docs", "manuals", "pdf", `experiment-${padded}.pdf`), figures.length),
  };
  await fs.writeFile(path.join(evidenceDir, "validation.json"), `${JSON.stringify(validation, null, 2)}\n`);
  console.log(`EXP${id}: ${validation.evidence.status}/${validation.screenshots.status}/${validation.content.status}/${validation.pdf.status}`);
}
