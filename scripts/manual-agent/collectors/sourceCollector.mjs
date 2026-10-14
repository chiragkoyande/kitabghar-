import path from "node:path";
import { ensureDir, fromRoot, readText, relative, writeText } from "../utils/files.mjs";

export async function collectSource(experiment, evidenceDir) {
  const snippets = [];
  const snippetsDir = path.join(evidenceDir, "snippets");
  await ensureDir(snippetsDir);
  for (const definition of experiment.snippets || []) {
    const sourcePath = fromRoot(definition.file);
    const lines = (await readText(sourcePath)).split(/\r?\n/);
    const content = lines.slice(definition.startLine - 1, definition.endLine).join("\n");
    const output = path.join(snippetsDir, definition.name);
    await writeText(output, `${content}\n`);
    snippets.push({ ...definition, file: relative(sourcePath), output: relative(output), content });
  }
  return snippets;
}
