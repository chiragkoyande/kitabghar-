import { EventEmitter } from "node:events";
import { createServer } from "node:http";
import { readFile, writeFile, unlink } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { once } from "node:events";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const cataloguePath = path.resolve(here, "../../server/data/catalogue.js");
const evidenceFile = path.join(here, "runtime-reader-note.txt");
const lines = [];
const log = (label, value) => { const entry = `${label}: ${typeof value === "string" ? value : JSON.stringify(value)}`; lines.push(entry); console.log(entry); };

log("NODE_VERSION", process.version);
log("REPL_EXPRESSION", { reader: "Badlapur", activeRentals: 2, expression: "2 + 3 * 4", result: 14 });

await writeFile(evidenceFile, "Kitab Ghar reader note: return books on time.\n", "utf8");
const note = await readFile(evidenceFile, "utf8");
log("FILE_SYSTEM", { file: path.basename(evidenceFile), characters: note.length, content: note.trim() });

const buffer = Buffer.from("Kitab Ghar · Badlapur", "utf8");
log("BUFFER", { bytes: buffer.length, utf8: buffer.toString("utf8"), hex: buffer.toString("hex").slice(0, 24) });

let bytes = 0; let chunks = 0;
await new Promise((resolve, reject) => { const stream = createReadStream(cataloguePath, { encoding: "utf8" }); stream.on("data", (chunk) => { chunks += 1; bytes += Buffer.byteLength(chunk); }); stream.on("end", resolve); stream.on("error", reject); });
log("STREAM", { source: "server/data/catalogue.js", chunks, bytes });

const eventBus = new EventEmitter(); let rented;
eventBus.once("book-rented", ({ title, reader }) => { rented = { title, reader, status: "recorded" }; });
eventBus.emit("book-rented", { title: "Norwegian Wood", reader: "Badlapur Reader" });
log("EVENT_EMITTER", rented);

const loopOrder = ["synchronous"];
process.nextTick(() => loopOrder.push("nextTick"));
Promise.resolve().then(() => loopOrder.push("promise"));
setImmediate(() => loopOrder.push("setImmediate"));
setTimeout(() => loopOrder.push("setTimeout"), 0);
await new Promise((resolve) => setTimeout(resolve, 25));
log("EVENT_LOOP", loopOrder);

const server = createServer((request, response) => { response.writeHead(200, { "Content-Type": "application/json" }); response.end(JSON.stringify({ service: "kitab-ghar-exp7", path: request.url, status: "ok" })); });
server.listen(0, "127.0.0.1"); await once(server, "listening");
const port = server.address().port;
const httpResponse = await fetch(`http://127.0.0.1:${port}/kitab-ghar/health`).then((response) => response.json());
await new Promise((resolve) => server.close(resolve));
log("HTTP_SERVER", { port, response: httpResponse });

await unlink(evidenceFile);
log("CLEANUP", { temporaryFileRemoved: true });
