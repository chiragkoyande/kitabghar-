import fs from "node:fs/promises";
import path from "node:path";

export const root = path.resolve(new URL("../../../", import.meta.url).pathname);
export const fromRoot = (...parts) => path.join(root, ...parts);
export const relative = (file) => path.relative(root, file).replaceAll(path.sep, "/");
export const ensureDir = (dir) => fs.mkdir(dir, { recursive: true });
export const readText = (file) => fs.readFile(file, "utf8");
export const writeJson = async (file, value) => {
  await ensureDir(path.dirname(file));
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
};
export const writeText = async (file, value) => {
  await ensureDir(path.dirname(file));
  await fs.writeFile(file, value);
};
export const exists = async (file) => fs.access(file).then(() => true).catch(() => false);
export const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
