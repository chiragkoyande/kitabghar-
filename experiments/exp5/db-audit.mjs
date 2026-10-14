import fs from "node:fs/promises";
import path from "node:path";
import mongoose from "../../server/node_modules/mongoose/index.js";
import { Book } from "../../server/models/Book.js";
import { Category } from "../../server/models/Category.js";

const root = path.resolve(import.meta.dirname, "../..");
const output = path.join(root, "experiments/exp5/crud-output.json");
const title = `__EXP5_EVIDENCE_${Date.now()}__`;
let createdId;

import dotenv from "../../server/node_modules/dotenv/lib/main.js";

dotenv.config({ path: path.resolve(root, "server/.env") });
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/kitabghar";

try {
  await mongoose.connect(mongoUri);
  const collections = (await mongoose.connection.db.listCollections().toArray()).map((entry) => entry.name).sort();
  const bookCount = await Book.countDocuments();
  const categoryCount = await Category.countDocuments();
  const created = await Book.create({ title, author: "Kitab Ghar Evidence Agent", description: "Temporary MongoDB CRUD evidence document.", category: "Evidence", language: "English", totalCopies: 1, availableCopies: 1 });
  createdId = created._id;
  const read = await Book.findById(createdId).lean();
  const updated = await Book.findByIdAndUpdate(createdId, { availableCopies: 0, status: "archived" }, { new: true }).lean();
  const deleted = await Book.deleteOne({ _id: createdId });
  const existsAfterDelete = Boolean(await Book.exists({ _id: createdId }));
  const result = { database: mongoose.connection.name, collections, bookCount, categoryCount, created: { id: String(createdId), title: created.title, status: created.status, availableCopies: created.availableCopies }, read: { category: read.category }, updated: { status: updated.status, availableCopies: updated.availableCopies }, deleted: { deletedCount: deleted.deletedCount, existsAfterDelete } };
  await fs.writeFile(output, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
} finally {
  if (createdId) await Book.deleteOne({ _id: createdId }).catch(() => undefined);
  await mongoose.disconnect().catch(() => undefined);
}
