import { escapeHtml } from "../utils/files.mjs";

export function figureSection(figures, experimentId) {
  return figures.map((figure) => `<article class="figure"><h3>${escapeHtml(figure.figure)} — ${escapeHtml(figure.title)}</h3><p><strong>Figure Number:</strong> ${escapeHtml(figure.figure)}<br><strong>Figure Heading:</strong> ${escapeHtml(figure.title)}</p><img src="../../evidence/exp${experimentId}/${escapeHtml(figure.file)}" alt="${escapeHtml(figure.title)}" /><p class="caption">${escapeHtml(figure.figure)} — ${escapeHtml(figure.title)}</p><p><strong>Explanation of Screenshot:</strong> ${escapeHtml(figure.purpose)} ${escapeHtml(figure.what_it_demonstrates)} Linked source evidence: ${escapeHtml(figure.code_refs.join(", "))}.</p></article>`).join("\n");
}
