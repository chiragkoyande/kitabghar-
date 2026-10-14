import { readText } from "../utils/files.mjs";

export async function validateContent(htmlPath) {
  const text = await readText(htmlPath);
  const required = ["Experiment Number", "Experiment Title", "Aim", "Case Study", "Tools Used", "Methodology", "Theory", "Functions / Methods Used", "Procedure", "Code", "Output", "Test Cases", "Result", "Conclusion"];
  const missing = required.filter((heading) => !text.includes(heading));
  const figures = (text.match(/Figure \d+\.[1-8]/g) || []).length;
  return { status: missing.length ? "FAIL" : "PASS", missingHeadings: missing, figureReferences: figures, errors: missing.length ? [`Missing headings: ${missing.join(", ")}`] : [] };
}
