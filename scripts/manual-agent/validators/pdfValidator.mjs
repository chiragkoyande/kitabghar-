import { run } from "../utils/command.mjs";

export async function validatePdf(pdfPath, expectedFigureCount = 8) {
  const info = await run("pdfinfo", [pdfPath]);
  const text = await run("pdftotext", [pdfPath, "-"]);
  const pages = Number((info.stdout.match(/^Pages:\s+(\d+)/m) || [])[1] || 0);
  const errors = [];
  if (info.code !== 0 || pages < 1) errors.push("PDF has no readable pages.");
  if (text.code !== 0 || !text.stdout.includes("Experiment Number")) errors.push("PDF text extraction did not contain the manual content.");
  if (!text.stdout.includes("Page 1 of")) errors.push("PDF page-number footer was not found in extracted text.");
  if ((text.stdout.match(/Figure \d+\.\d+/g) || []).length < expectedFigureCount) errors.push("Not all figure captions were present in PDF text.");
  return { status: errors.length ? "FAIL" : "PASS", pages, errors, textLength: text.stdout.length };
}
