/**
 * Kitab Ghar · Experiment 5 — MongoDB Shell (mongosh) CRUD Demonstration
 *
 * This script contains the exact mongosh commands to be executed interactively.
 * Run with: mongosh < experiments/exp5/mongosh-demo.js
 *
 * Or paste each section into an interactive mongosh session for evidence capture.
 *
 * Purpose: Demonstrate database creation, collection listing, and CRUD operations
 * using the MongoDB shell, complementing the Mongoose-based db-audit.mjs script.
 */

// ─── 1. Show existing databases ──────────────────────────────────────
print("\n═══ STEP 1: Show Databases ═══");
show dbs;

// ─── 2. Switch to kitabghar database ─────────────────────────────────
print("\n═══ STEP 2: Use kitabghar Database ═══");
use kitabghar;

// ─── 3. Show collections ────────────────────────────────────────────
print("\n═══ STEP 3: Show Collections ═══");
show collections;

// ─── 4. Count documents in books collection ─────────────────────────
print("\n═══ STEP 4: Count Books ═══");
print("Total books: " + db.books.countDocuments());

// ─── 5. READ — Find first 3 books ──────────────────────────────────
print("\n═══ STEP 5: READ — Find First 3 Books ═══");
db.books.find({}, { title: 1, author: 1, category: 1, availableCopies: 1 }).limit(3).pretty();

// ─── 6. READ — Find a specific book by title ───────────────────────
print("\n═══ STEP 6: READ — Find Book by Title ═══");
db.books.findOne({ title: /Norwegian/i });

// ─── 7. CREATE — Insert a test book ────────────────────────────────
print("\n═══ STEP 7: CREATE — Insert Test Book ═══");
var insertResult = db.books.insertOne({
  title: "The Great Gatsby",
  author: "F. Scott Fitzgerald",
  description: "A story of decadence and excess. Inserted for Experiment 5 CRUD evidence.",
  category: "Fiction",
  language: "English",
  totalCopies: 3,
  availableCopies: 3,
  status: "active",
  createdAt: new Date()
});
print("Inserted ID: " + insertResult.insertedId);

// ─── 8. READ — Verify the inserted book exists ─────────────────────
print("\n═══ STEP 8: READ — Verify Inserted Book ═══");
db.books.findOne({ _id: insertResult.insertedId });

// ─── 9. UPDATE — Change availability and add a field ────────────────
print("\n═══ STEP 9: UPDATE — Modify Book Availability ═══");
var updateResult = db.books.updateOne(
  { _id: insertResult.insertedId },
  { $set: { availableCopies: 1, status: "limited" } }
);
print("Matched: " + updateResult.matchedCount + ", Modified: " + updateResult.modifiedCount);

// ─── 10. READ — Verify the update ──────────────────────────────────
print("\n═══ STEP 10: READ — Verify Update ═══");
db.books.findOne(
  { _id: insertResult.insertedId },
  { title: 1, availableCopies: 1, status: 1 }
);

// ─── 11. DELETE — Remove the test book ──────────────────────────────
print("\n═══ STEP 11: DELETE — Remove Test Book ═══");
var deleteResult = db.books.deleteOne({ _id: insertResult.insertedId });
print("Deleted count: " + deleteResult.deletedCount);

// ─── 12. READ — Verify deletion ────────────────────────────────────
print("\n═══ STEP 12: READ — Verify Deletion ═══");
var exists = db.books.findOne({ _id: insertResult.insertedId });
print("Book exists after delete: " + (exists !== null));

print("\n═══ CRUD Demonstration Complete ═══");
print("Database: kitabghar");
print("Collection: books");
print("Operations performed: CREATE, READ, UPDATE, DELETE");
