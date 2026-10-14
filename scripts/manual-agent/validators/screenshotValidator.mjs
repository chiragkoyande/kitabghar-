import fs from "node:fs/promises";
import path from "node:path";

export async function validateScreenshots(figures, evidenceDir, minimum = 7) {
  const errors = [];
  const entries = [];
  for (const figure of figures) {
    const file = path.join(evidenceDir, figure.file);
    try {
      const stat = await fs.stat(file);
      if (stat.size < 10_000) errors.push(`${figure.file} is unexpectedly small.`);
      entries.push({ file: figure.file, bytes: stat.size });
    } catch { errors.push(`${figure.file} is missing.`); }
  }
  if (figures.length < minimum) errors.push(`Only ${figures.length} screenshots exist; minimum is ${minimum}.`);
  if (figures.length > 12) errors.push(`Screenshot count ${figures.length} exceeds maximum of 12.`);
  return { status: errors.length ? "FAIL" : "PASS", count: figures.length, entries, errors };
}
