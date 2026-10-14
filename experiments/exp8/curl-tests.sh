#!/usr/bin/env bash
# ============================================================
# Kitab Ghar · Experiment 8 — REST API Endpoint Testing (curl)
# ============================================================
#
# This script tests the Kitab Ghar REST API using curl.
# Equivalent to Postman testing — uses identical HTTP methods,
# headers, and request bodies.
#
# Prerequisites:
#   1. MongoDB running (local or Atlas)
#   2. Server running: cd server && npm run dev
#
# Usage:
#   bash experiments/exp8/curl-tests.sh
#
# The server should be running on port 5000 (default).
# ============================================================

BASE="http://localhost:5000/api"
BOLD="\033[1m"
GREEN="\033[32m"
RED="\033[31m"
YELLOW="\033[33m"
RESET="\033[0m"

echo -e "${BOLD}════════════════════════════════════════════════════${RESET}"
echo -e "${BOLD}  Kitab Ghar REST API — curl Test Suite${RESET}"
echo -e "${BOLD}════════════════════════════════════════════════════${RESET}"
echo ""

# ─── TEST 1: Health Check (GET /api/health → 200 OK) ────────────────
echo -e "${BOLD}TEST 1: GET /api/health → Expected: 200 OK${RESET}"
echo -e "${YELLOW}$ curl -s -w '\\nHTTP Status: %{http_code}\\n' ${BASE}/health${RESET}"
curl -s -w "\nHTTP Status: %{http_code}\n" "${BASE}/health"
echo ""
echo "────────────────────────────────────────────────────"

# ─── TEST 2: Get All Books (GET /api/books → 200 OK) ────────────────
echo -e "${BOLD}TEST 2: GET /api/books → Expected: 200 OK (paginated list)${RESET}"
echo -e "${YELLOW}$ curl -s -w '\\nHTTP Status: %{http_code}\\n' ${BASE}/books | head -c 500${RESET}"
curl -s -w "\nHTTP Status: %{http_code}\n" "${BASE}/books" | head -c 500
echo ""
echo ""
echo "────────────────────────────────────────────────────"

# ─── TEST 3: Get All Categories (GET /api/categories → 200 OK) ──────
echo -e "${BOLD}TEST 3: GET /api/categories → Expected: 200 OK${RESET}"
echo -e "${YELLOW}$ curl -s -w '\\nHTTP Status: %{http_code}\\n' ${BASE}/categories${RESET}"
curl -s -w "\nHTTP Status: %{http_code}\n" "${BASE}/categories"
echo ""
echo "────────────────────────────────────────────────────"

# ─── TEST 4: Unauthorized Create (POST /api/books → 401) ────────────
echo -e "${BOLD}TEST 4: POST /api/books (no auth) → Expected: 401 Unauthorized${RESET}"
echo -e "${YELLOW}$ curl -s -w '\\nHTTP Status: %{http_code}\\n' -X POST -H 'Content-Type: application/json' \\
  -d '{\"title\":\"Test Book\",\"author\":\"Test\"}' ${BASE}/books${RESET}"
curl -s -w "\nHTTP Status: %{http_code}\n" -X POST \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Book","author":"Test","description":"Unauthorized test"}' \
  "${BASE}/books"
echo ""
echo "────────────────────────────────────────────────────"

# ─── TEST 5: Admin Login (POST /api/auth/login → 200 OK + Token) ────
echo -e "${BOLD}TEST 5: POST /api/auth/login → Expected: 200 OK + JWT token${RESET}"
echo -e "${YELLOW}$ curl -s -w '\\nHTTP Status: %{http_code}\\n' -X POST -H 'Content-Type: application/json' \\
  -d '{\"email\":\"admin@kitabghar.local\",\"password\":\"KitabGhar@2026!\"}' ${BASE}/auth/login${RESET}"
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kitabghar.local","password":"KitabGhar@2026!"}' \
  "${BASE}/auth/login")
HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -1)
BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')
echo "$BODY"
echo "HTTP Status: $HTTP_CODE"
TOKEN=$(echo "$BODY" | grep -o '"token":"[^"]*"' | head -1 | cut -d'"' -f4)
echo ""
echo "────────────────────────────────────────────────────"

if [ -z "$TOKEN" ]; then
  echo -e "${RED}ERROR: Could not extract JWT token. Remaining tests require auth.${RESET}"
  echo "Make sure the server is running and seeded (cd server && npm run seed)"
  exit 1
fi

echo -e "${GREEN}Token extracted successfully. Proceeding with authenticated tests.${RESET}"
echo ""

# ─── TEST 6: Create Book (POST /api/books → 201 Created) ────────────
echo -e "${BOLD}TEST 6: POST /api/books (authenticated) → Expected: 201 Created${RESET}"
echo -e "${YELLOW}$ curl -s -w '\\nHTTP Status: %{http_code}\\n' -X POST \\
  -H 'Content-Type: application/json' -H 'Authorization: Bearer \$TOKEN' \\
  -d '{...}' ${BASE}/books${RESET}"
CREATE_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "title": "__EXP8_CURL_TEST_BOOK__",
    "author": "Kitab Ghar Evidence Agent",
    "description": "Temporary book created for REST API curl testing evidence.",
    "category": "Evidence",
    "language": "English",
    "totalCopies": 2,
    "availableCopies": 2
  }' \
  "${BASE}/books")
CREATE_CODE=$(echo "$CREATE_RESPONSE" | tail -1)
CREATE_BODY=$(echo "$CREATE_RESPONSE" | sed '$d')
echo "$CREATE_BODY"
echo "HTTP Status: $CREATE_CODE"
BOOK_ID=$(echo "$CREATE_BODY" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo ""
echo "────────────────────────────────────────────────────"

# ─── TEST 7: Update Book (PUT /api/books/:id → 200 OK) ──────────────
echo -e "${BOLD}TEST 7: PUT /api/books/${BOOK_ID} → Expected: 200 OK${RESET}"
echo -e "${YELLOW}$ curl -s -w '\\nHTTP Status: %{http_code}\\n' -X PUT \\
  -H 'Content-Type: application/json' -H 'Authorization: Bearer \$TOKEN' \\
  -d '{\"availableCopies\":1}' ${BASE}/books/${BOOK_ID}${RESET}"
curl -s -w "\nHTTP Status: %{http_code}\n" -X PUT \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{"availableCopies": 1}' \
  "${BASE}/books/${BOOK_ID}"
echo ""
echo "────────────────────────────────────────────────────"

# ─── TEST 8: Delete Book (DELETE /api/books/:id → 200 OK) ───────────
echo -e "${BOLD}TEST 8: DELETE /api/books/${BOOK_ID} → Expected: 200 OK${RESET}"
echo -e "${YELLOW}$ curl -s -w '\\nHTTP Status: %{http_code}\\n' -X DELETE \\
  -H 'Authorization: Bearer \$TOKEN' ${BASE}/books/${BOOK_ID}${RESET}"
curl -s -w "\nHTTP Status: %{http_code}\n" -X DELETE \
  -H "Authorization: Bearer ${TOKEN}" \
  "${BASE}/books/${BOOK_ID}"
echo ""
echo "────────────────────────────────────────────────────"

echo ""
echo -e "${BOLD}════════════════════════════════════════════════════${RESET}"
echo -e "${GREEN}${BOLD}  All 8 REST API tests completed.${RESET}"
echo -e "${BOLD}════════════════════════════════════════════════════${RESET}"
echo ""
echo "Tests performed:"
echo "  1. GET  /api/health       → 200 (Health check)"
echo "  2. GET  /api/books        → 200 (List all books)"
echo "  3. GET  /api/categories   → 200 (List categories)"
echo "  4. POST /api/books        → 401 (Unauthorized create)"
echo "  5. POST /api/auth/login   → 200 (Admin login + JWT)"
echo "  6. POST /api/books        → 201 (Authenticated create)"
echo "  7. PUT  /api/books/:id    → 200 (Update book)"
echo "  8. DELETE /api/books/:id  → 200 (Delete book)"
