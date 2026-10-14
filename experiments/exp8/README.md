# Experiment 8 — RESTful API Testing with Express + curl

## College Requirement

Build a RESTful API using Express.js and test API endpoints using Postman.

## Implementation

This experiment uses the **actual Kitab Ghar Express API** (`server/`) and tests it using:

1. **`curl-tests.sh`** — A comprehensive curl test suite exercising all CRUD endpoints
2. **`api-demo.mjs`** — Programmatic API testing using Node.js fetch()
3. **`postman/kitab-ghar-api.postman_collection.json`** — Postman collection (if Postman GUI available)

### Note on Testing Method

Terminal `curl` is used as the primary verification tool in this headless environment.
curl sends identical HTTP requests to Postman — same methods, headers, and request bodies.
The Postman collection is provided for GUI-based testing when available.

## How to Run

```bash
# Terminal 1: Start the server
cd server && npm run dev

# Terminal 2: Run curl tests
bash experiments/exp8/curl-tests.sh

# Or run programmatic tests
node experiments/exp8/api-demo.mjs
```

## Test Matrix

| Test | Method | Endpoint | Expected Status | Description |
|------|--------|----------|----------------|-------------|
| 1 | GET | `/api/health` | 200 OK | Health check |
| 2 | GET | `/api/books` | 200 OK | List all books |
| 3 | GET | `/api/categories` | 200 OK | List categories |
| 4 | POST | `/api/books` (no auth) | 401 Unauthorized | Rejected — no token |
| 5 | POST | `/api/auth/login` | 200 OK | Admin login + JWT |
| 6 | POST | `/api/books` (auth) | 201 Created | Create book |
| 7 | PUT | `/api/books/:id` | 200 OK | Update book |
| 8 | DELETE | `/api/books/:id` | 200 OK | Delete book |

## Evidence Required

1. Server health check response (200)
2. GET all books response (200, JSON array)
3. GET categories response (200)
4. POST without auth (401 error)
5. POST login with JWT token (200)
6. POST create book with auth (201)
7. PUT update book (200)
8. DELETE book (200)
