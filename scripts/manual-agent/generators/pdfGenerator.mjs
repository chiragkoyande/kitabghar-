import path from "node:path";
import { pathToFileURL } from "node:url";
import { manualConfig } from "../config/manual-config.js";
import { fromRoot, ensureDir } from "../utils/files.mjs";
import { run } from "../utils/command.mjs";

export async function generatePdf(experiment, htmlPath) {
  const output = fromRoot(manualConfig.outputPdf, `experiment-${String(experiment.id).padStart(2, "0")}.pdf`);
  const unframedOutput = `${output}.unframed`;
  await ensureDir(path.dirname(output));
  const rendered = await run("google-chrome", ["--headless=new", "--no-sandbox", "--disable-gpu", "--no-pdf-header-footer", `--print-to-pdf=${unframedOutput}`, pathToFileURL(htmlPath).href], { timeout: 60000 });
  if (rendered.code !== 0) throw new Error(`Chrome PDF rendering failed: ${rendered.stderr}`);
  const bordered = await run("python3", [fromRoot("scripts/manual-agent/utils/add-pdf-page-border.py"), unframedOutput, output]);
  if (bordered.code !== 0) throw new Error(`PDF page-border pass failed: ${bordered.stderr}`);
  const cleanup = await import("node:fs/promises");
  await cleanup.rm(unframedOutput, { force: true });
  return output;
}
