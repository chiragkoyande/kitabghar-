# KITAB GHAR — MASTER VALIDATION REPORT
**Web Technology Practical Manual Rectification & Evidence Pipeline Report**  
*Project:* Kitab Ghar (Neighbourhood Book-Rental Platform, Badlapur)  
*Status:* **COMPLETED & FULLY VERIFIED**  
*Format:* Pure Academic Black & White (Reference Format)  
*Location:* `manuals/` (All 10 Manuals + Merged Master in One Folder)  
*Date:* September 30, 2026  

---

## 1. Executive Summary

This rectification project resolved the fundamental architectural flaw in the previous manual generation pipeline: **it replaced application-centric assumptions with strict, curriculum-driven, evidence-first execution**.

Following reference guidelines modeled directly after the university reference manual (`WT_All_Experiments_KunalSoyane_3564.pdf`):
1. **Academic Black & White Styling:** All colored banners, brown borders, and yellow/gold highlight boxes were eliminated. Typography, tables, and borders are strictly black-and-white (`#000000` text on `#ffffff` background).
2. **Crisp Page Border Box:** Every page features a clean, professional black rectangular border box framing the content, with `Page X of Y` positioned inside the bottom margin.
3. **Immediate Page 1 Start:** The separate, empty cover page was removed. Each experiment begins immediately at the top of Page 1 with `Experiment No. X`, `Title:`, and `Aim:`.
4. **Consolidated Folder Output:** All generated experiment manuals reside together in a single folder (`manuals/`), alongside a unified master manual (`manuals/WT_All_Experiments_KitabGhar.pdf`) compiling all 10 experiments in sequence into a 122-page document.
5. **Authentic Evidence & Real Cloud Deployment:** Exactly **78 genuine screenshots** were captured and cataloged in a unified manifest (`evidence-manifest.json`). Experiment 10 documents live cloud deployment on Vercel via Vercel CLI (`vercel --prod`) bound to the production custom domain **`https://kitabghar.clients.chiragk.online`**, backed by a live **MongoDB Atlas** cloud replica set cluster (`cluster0.q552vyf.mongodb.net`).
6. **Verified Test Execution:** All **58 formal test cases** were executed and passed.

---

## 2. Experiment-by-Experiment Gap Analysis & Rectification Summary

| Exp | College Curriculum Requirement | Previous State & Deficiency | Rectification Implemented | Evidence Captured | Final Status |
|:---:|:---|:---|:---|:---|:---:|
| **1** | Design a Responsive Registration Form using Bootstrap and perform client-side validation using JavaScript. | Standalone form existed but lacked explicit `setCustomValidity()` usage and relied on manual validation messages. | Enhanced `experiments/exp1/script.js` with HTML5 Constraint Validation API (`setCustomValidity` and `checkValidity`). Validated age (13+), 10-digit Indian phone regex, password strength, and confirm password matching. | 8 screenshots capturing empty submit, invalid email, invalid mobile, password mismatch, valid submission, 375px mobile grid, and confirmation modal. | **READY** |
| **2** | Develop JavaScript programs using ES6 Features (Arrow Functions, Anonymous Functions, Arrays, Events, Popup Boxes). | **CRITICAL GAP:** No standalone demo existed. Only a README pointing to the main React application. | Built complete standalone suite: `experiments/exp2/index.html`, `es6-demo.js`, and `es6-node.mjs` with 5 independent interactive cards using Kitab Ghar catalogue data. | 8 screenshots capturing overview, arrow function pricing, anonymous callbacks in `setTimeout` & `forEach`, `map`/`filter`/`reduce`, DOM events (`input`/`change`/`click`), and native `alert()`, `confirm()`, and `prompt()` dialogs. | **READY** |
| **3** | Create a React Application using Functional Components, JSX, Props, and State. | README pointer only; lacked clear component-to-concept traceability. | Authored `experiments/exp3/README.md` with explicit line-by-line mapping of Functional Components (`BookCard`, `App`), JSX templates, unidirectional Props, and `useState` state hooks. | 8 screenshots of component tree, props passing to `BookCard`, state-driven live search, and conditional rendering. | **READY** |
| **4** | Develop a Single Page Application (SPA) using React Router, Hooks, and Component Lifecycle methods. | Good standalone app existed, but relationship to main app was undocumented. | Documented dual routing model: main app switchboard (`client/src/App.jsx`) and standalone SPA (`experiments/exp4/`). Traced `useParams()`, `useNavigate()`, and zero-reload network activity. | 8 screenshots covering home route `/`, wizard transitions, `/books`, dynamic `/books/:id`, `/membership`, `/login`, and protected `/dashboard`. | **READY** |
| **5** | Install/configure MongoDB. Create database, collections, documents, and perform CRUD operations. | **HIGH GAP:** Only ran a programmatic Mongoose script; lacked shell commands and showed main app UI screenshots instead of database state. | Built `mongosh-demo.js` and `mongosh-runner.mjs`. Connected to live MongoDB Atlas cluster, executed `use kitabghar`, `show collections`, `countDocuments()`, `insertOne()`, `findOne()`, `updateOne()`, and `deleteOne()`. | 8 screenshots showing authentic mongosh session: database switching, collection inventory, document counts (79 books), READ projection, CREATE, READ verify, UPDATE, and DELETE. | **READY** |
| **6** | Develop a Node.js Application using Express.js and Mongoose to connect with MongoDB. | No dedicated documentation folder; relied entirely on `server/`. | Authored `experiments/exp6/README.md` walking through the 3-tier architecture: Express setup, middleware chain (Helmet, CORS, body parser), Mongoose connection, schemas, and controllers. | 8 screenshots showing `/api/health`, `/api/books` JSON response, model schemas, JWT login, and authenticated reader dashboard. | **READY** |
| **7** | Develop basic Node.js applications demonstrating REPL, HTTP Server, File System, Buffers, Streams, and Event Loop. | **HIGH GAP:** All 6 concepts were combined into a single 51-line script (`node-demo.mjs`). | Split into 6 independent, runnable scripts: `01-repl-demo.mjs`, `02-http-server.mjs`, `03-filesystem.mjs`, `04-buffers.mjs`, `05-streams.mjs`, and `06-event-loop.mjs`. | 8 screenshots showing REPL arithmetic, raw HTTP server handling routes on port 5007, sync/async file I/O, binary buffer encodings, 30-chunk stream piping, event loop phase order, and EventEmitter. | **READY** |
| **8** | Build RESTful API using Express and test endpoints using Postman / curl. | **HIGH GAP:** Only programmatic `fetch()` was used; no curl or Postman evidence was recorded. | Developed automated curl test suite (`experiments/exp8/curl-tests.sh`) testing all CRUD verbs and HTTP status codes (200, 201, 400, 401, 404). Documented curl/Postman equivalence. | 8 screenshots showing GET health (200), GET books (200), GET categories (200), unauth POST (401), admin login (200), auth POST (201), PUT update (200), and DELETE (200). | **READY** |
| **9** | Full-Stack MERN Integration (React + Express + Node + MongoDB). | Relied on implicit integration without tracing an end-to-end request lifecycle. | Authored `experiments/exp9/README.md` tracing a complete reader journey from React UI action -> Fetch API -> Express Router -> Mongoose -> MongoDB Atlas -> JSON response -> Virtual DOM re-render. | 8 screenshots illustrating full-stack homepage, 3-tier recommendation engine, live catalogue API fetch, dynamic details cart, UPI payments, and mobile responsive MERN. | **READY** |
| **10** | Deploy MERN application to cloud and demonstrate end-to-end functionality. | Previous version had generic cloud placeholders. | Real cloud deployment executed: React frontend deployed to Vercel via Vercel CLI (`vercel --prod`) at custom domain `https://kitabghar.clients.chiragk.online`, persistent storage configured on MongoDB Atlas replica set (`cluster0.q552vyf.mongodb.net`), SPA rewrite rules validated in `vercel.json`. | 6 screenshots/terminal cards: live production homepage, live catalogue `/books`, live membership `/membership`, live login `/login`, Vercel CLI deployment session, and MongoDB Atlas connection. | **READY** |

---

## 3. Master Validation Matrix

All 10 experiments were verified against the automated validation auditor:

```
--------------------------------------------------------------------------------------------------
Experiment | Requirement                         | Implementation               | Evidence        | Tests      | PDF Size   | Status
--------------------------------------------------------------------------------------------------
EXP 1    | Design a Responsive Registration... | script.js, script.js         | 8 screenshots   | 6 tests    | 847 KB     | READY
EXP 2    | Develop JavaScript Programs usin... | es6-demo.js, es6-demo.js     | 8 screenshots   | 6 tests    | 922 KB     | READY
EXP 3    | Create a React Application using... | BookCard.jsx, Pages.jsx      | 8 screenshots   | 5 tests    | 2471 KB    | READY
EXP 4    | Develop a Single Page Applicatio... | App.jsx, BookDetailsPage.jsx | 8 screenshots   | 5 tests    | 2061 KB    | READY
EXP 5    | Install and Configure MongoDB. C... | mongosh-demo.js, db-audit.mjs | 8 screenshots   | 7 tests    | 553 KB     | READY
EXP 6    | Develop a Node.js Application us... | server.js, Book.js           | 8 screenshots   | 5 tests    | 2197 KB    | READY
EXP 7    | Develop Basic Node.js Applicatio... | 02-http-server.mjs, ...      | 8 screenshots   | 6 tests    | 757 KB     | READY
EXP 8    | Build a RESTful API using Expres... | bookController.js, curl...   | 8 screenshots   | 8 tests    | 566 KB     | READY
EXP 9    | Develop a Full-Stack MERN Applic... | api.js, Pages.jsx            | 8 screenshots   | 5 tests    | 2041 KB    | READY
EXP 10   | Deploy a MERN Stack Web Applicat... | vercel.json, db.js           | 6 screenshots   | 5 tests    | 600 KB     | READY
--------------------------------------------------------------------------------------------------

Summary:
  - Total Experiments: 10
  - Total Screenshots Verified: 78 (Missing: 0)
  - Total Tests Verified: 58 (Failed: 0)
  - Final Pipeline Status: ALL PASS — READY FOR SUBMISSION
```

---

## 4. Single-Folder Deliverables Structure

All practical manuals reside in the unified `manuals/` directory:

```
kitabghar/
├── manuals/
│   ├── experiment-01.pdf                # Experiment 1 (Responsive Registration Form)
│   ├── experiment-02.pdf                # Experiment 2 (ES6 Language Features)
│   ├── experiment-03.pdf                # Experiment 3 (React Components & Props)
│   ├── experiment-04.pdf                # Experiment 4 (React Router SPA Navigation)
│   ├── experiment-05.pdf                # Experiment 5 (MongoDB CRUD & Shell)
│   ├── experiment-06.pdf                # Experiment 6 (Express.js & Mongoose Backend)
│   ├── experiment-07.pdf                # Experiment 7 (Node.js Core Internals)
│   ├── experiment-08.pdf                # Experiment 8 (RESTful API Testing via curl)
│   ├── experiment-09.pdf                # Experiment 9 (Full-Stack MERN Integration)
│   ├── experiment-10.pdf                # Experiment 10 (Cloud Deployment Architecture)
│   └── WT_All_Experiments_KitabGhar.pdf # Consolidated Master Manual (All 10 Exp, 122 pages)
```

---

## 5. Verification Commands Used

```bash
# 1. Compile all 10 Black & White HTML manuals and print PDFs into manuals/
node automation/pdf/generate-all-manuals.mjs

# 2. Run master pipeline validator
node automation/validation/validate-pipeline.mjs
```

---

## 6. Conclusion

The Kitab Ghar Web Technology Practical Manuals now precisely reflect the university standard: clean Black & White typography, zero extraneous cover pages, no colored highlights or boxes, genuine execution evidence for every experiment, and all manuals compiled cleanly in a single folder.
