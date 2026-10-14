# Experiment 5 — MongoDB CRUD Operations

## College Requirement

Install and configure MongoDB. Create database, collections, documents, and perform CRUD operations.

## Demonstration Structure

This experiment uses **two complementary approaches**:

### Part A: MongoDB Shell (`mongosh`)

**File:** `mongosh-demo.js`

Interactive shell commands demonstrating:
- `show dbs` — list databases
- `use kitabghar` — switch to application database
- `show collections` — list all collections
- `db.books.find()` — read documents
- `db.books.insertOne()` — create a document
- `db.books.updateOne()` — update a document
- `db.books.deleteOne()` — delete a document

**How to run:**
```bash
# Option 1: Pipe the script into mongosh
mongosh < experiments/exp5/mongosh-demo.js

# Option 2: Paste commands interactively in mongosh for screenshot capture
mongosh
# Then paste each section manually
```

### Part B: Mongoose ODM (Node.js)

**File:** `db-audit.mjs`

Programmatic CRUD using the Kitab Ghar Mongoose models:
- `Book.create()` — INSERT
- `Book.findById()` — SELECT
- `Book.findByIdAndUpdate()` — UPDATE
- `Book.deleteOne()` — DELETE

**How to run:**
```bash
node experiments/exp5/db-audit.mjs
```

Output is saved to `crud-output.json`.

## Database Configuration

- **Database:** `kitabghar` (local MongoDB or MongoDB Atlas)
- **Connection:** `mongodb://127.0.0.1:27017/kitabghar` (local) or Atlas URI in `server/.env`
- **Collections:** books, categories, users, plans, subscriptions, rentals, payments, notifications, orders, admins
- **Seed data:** 77 books loaded via `cd server && npm run seed`

## Evidence Required

1. mongosh `show dbs` output
2. mongosh `show collections` output
3. mongosh `find()` output showing existing books
4. mongosh `insertOne()` output
5. mongosh `updateOne()` output
6. mongosh `deleteOne()` output
7. Mongoose CRUD output (crud-output.json)
8. MongoDB Compass collection view (if available)
