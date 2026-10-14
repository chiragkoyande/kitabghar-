# Experiment 6 — Node.js + Express.js + Mongoose + MongoDB Backend

## College Requirement

Develop a Node.js Application using Express.js and Mongoose to connect with MongoDB.

## Implementation Source

This experiment uses the **actual Kitab Ghar production backend** (`server/`).
No separate experiment application is created because the main server IS a genuine
Express + Mongoose application demonstrating every required concept.

## Architecture

```
React Frontend (client/)
     ↓ HTTP/JSON
Express.js Server (server/server.js)
     ↓ Middleware chain
Route Handlers (server/routes/)
     ↓
Controller Functions (server/controllers/)
     ↓
Mongoose Models (server/models/)
     ↓
MongoDB Database (kitabghar)
```

## Key Source Files

| Concept | File | Purpose |
|---------|------|---------|
| Express initialization | `server/server.js` | App setup, middleware, port binding |
| Database connection | `server/config/db.js` | Mongoose connect with reconnection |
| Middleware | `server/server.js` | helmet, cors, express.json, morgan, rate-limit |
| Error handling | `server/middleware/errorHandler.js` | Centralized error middleware |
| Auth middleware | `server/middleware/auth.js` | JWT verification middleware |
| Book model | `server/models/Book.js` | Mongoose schema + model |
| User model | `server/models/User.js` | Schema with bcrypt password hashing |
| Book routes | `server/routes/bookRoutes.js` | GET, POST, PUT, DELETE endpoints |
| Book controller | `server/controllers/bookController.js` | CRUD logic with Mongoose queries |
| Auth controller | `server/controllers/authController.js` | Register, login, JWT creation |
| Seed data | `server/data/catalogue.js` + `server/scripts/seed.js` | 77-book catalogue |

## How to Run

```bash
cd server
cp .env.example .env   # Configure MongoDB URI and JWT_SECRET
npm install
npm run seed           # Load 77-book catalogue
npm run dev            # Start Express server on port 5000
```

## API Endpoints Demonstrated

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/health` | No | Health check |
| GET | `/api/books` | No | List books (paginated, searchable) |
| GET | `/api/books/:id` | No | Single book details |
| POST | `/api/books` | Admin | Create new book |
| PUT | `/api/books/:id` | Admin | Update book |
| DELETE | `/api/books/:id` | Admin | Soft-delete book |
| POST | `/api/auth/register` | No | Reader registration |
| POST | `/api/auth/login` | No | Login + JWT token |
| GET | `/api/auth/me` | Yes | Current user profile |
| GET | `/api/categories` | No | List categories |

## Evidence Required

1. Server startup terminal output (Express listening + MongoDB connected)
2. API health endpoint response
3. GET /api/books JSON response
4. Book model schema source code
5. Express middleware chain
6. Controller CRUD operations
7. JWT authentication flow
8. Database state (Compass or mongosh)
