import { escapeHtml } from "../utils/files.mjs";

export function codeSection(snippets) {
  return snippets.map((snippet, index) => `<h3>7.${index + 1} ${escapeHtml(snippet.purpose)}</h3><p><strong>File:</strong> ${escapeHtml(snippet.file)} (lines ${snippet.startLine}–${snippet.endLine})</p><pre><code>${escapeHtml(snippet.content)}</code></pre><p>${escapeHtml(snippet.purpose)}</p>`).join("\n");
}
