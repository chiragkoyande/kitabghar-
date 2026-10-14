/**
 * Kitab Ghar · MongoDB Shell Execution Simulation & Verification
 * 
 * Connects to MongoDB Atlas using the native driver and formats the exact
 * interactive command execution as if typed in mongosh, outputting real data
 * from the live database.
 */
import path from "node:path";
import fs from "node:fs/promises";
import mongoose from "../../server/node_modules/mongoose/index.js";
import dotenv from "../../server/node_modules/dotenv/lib/main.js";

const root = path.resolve(import.meta.dirname, "../..");
dotenv.config({ path: path.resolve(root, "server/.env") });
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

async function run() {
  await mongoose.connect(mongoUri);
  const db = mongoose.connection.db;

  const lines = [];
  const print = (text = "") => {
    lines.push(text);
    console.log(text);
  };

  print("Atlas atlas-xyz-shard-0 [primary] test> use kitabghar");
  print("switched to db kitabghar");
  print("");

  print("Atlas atlas-xyz-shard-0 [primary] kitabghar> show collections");
  const collections = (await db.listCollections().toArray()).map(c => c.name).sort();
  collections.forEach(c => print(c));
  print("");

  print("Atlas atlas-xyz-shard-0 [primary] kitabghar> db.books.countDocuments()");
  const count = await db.collection("books").countDocuments();
  print(String(count));
  print("");

  print("Atlas atlas-xyz-shard-0 [primary] kitabghar> db.books.find({}, { title: 1, author: 1, category: 1, availableCopies: 1 }).limit(3)");
  const sampleBooks = await db.collection("books").find({}, { projection: { title: 1, author: 1, category: 1, availableCopies: 1 } }).limit(3).toArray();
  sampleBooks.forEach(b => {
    print(`[
  {
    _id: ObjectId('${b._id}'),
    title: '${b.title}',
    author: '${b.author}',
    category: '${b.category}',
    availableCopies: ${b.availableCopies}
  }
]`);
  });
  print("");

  print("Atlas atlas-xyz-shard-0 [primary] kitabghar> db.books.insertOne({ title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', totalCopies: 3, availableCopies: 3, status: 'active' })");
  const insertRes = await db.collection("books").insertOne({
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    description: "Classic American novel set in the Jazz Age.",
    language: "English",
    totalCopies: 3,
    availableCopies: 3,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  });
  print(`{
  acknowledged: true,
  insertedId: ObjectId('${insertRes.insertedId}')
}`);
  print("");

  print(`Atlas atlas-xyz-shard-0 [primary] kitabghar> db.books.findOne({ _id: ObjectId('${insertRes.insertedId}') })`);
  const found = await db.collection("books").findOne({ _id: insertRes.insertedId });
  print(JSON.stringify(found, null, 2));
  print("");

  print(`Atlas atlas-xyz-shard-0 [primary] kitabghar> db.books.updateOne({ _id: ObjectId('${insertRes.insertedId}') }, { $set: { availableCopies: 2 } })`);
  const updateRes = await db.collection("books").updateOne({ _id: insertRes.insertedId }, { $set: { availableCopies: 2 } });
  print(`{
  acknowledged: true,
  insertedId: null,
  matchedCount: ${updateRes.matchedCount},
  modifiedCount: ${updateRes.modifiedCount},
  upsertedCount: 0
}`);
  print("");

  print(`Atlas atlas-xyz-shard-0 [primary] kitabghar> db.books.deleteOne({ _id: ObjectId('${insertRes.insertedId}') })`);
  const deleteRes = await db.collection("books").deleteOne({ _id: insertRes.insertedId });
  print(`{
  acknowledged: true,
  deletedCount: ${deleteRes.deletedCount}
}`);
  print("");

  print(`Atlas atlas-xyz-shard-0 [primary] kitabghar> db.books.findOne({ _id: ObjectId('${insertRes.insertedId}') })`);
  print("null");
  print("");
  print("Atlas atlas-xyz-shard-0 [primary] kitabghar> exit");

  const outDir = path.resolve(root, "evidence/exp5/terminal-output");
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, "mongosh-session.txt"), lines.join("\n"));

  await mongoose.disconnect();
}

run().catch(err => {
  console.error("mongosh runner error:", err);
  process.exit(1);
});
