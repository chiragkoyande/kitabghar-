# Experiment 9 — Complete MERN Stack Integration

## College Requirement

Develop a Full-Stack MERN Application by integrating React Frontend with Express Backend using Axios/Fetch API.

## Implementation Source

This experiment uses the **actual Kitab Ghar production application** — the complete `client/` + `server/` stack.
Kitab Ghar IS a genuine MERN application where MongoDB, Express, React, and Node.js work together in production.

## Architecture

```
┌─────────────────────────────────┐
│  React 18 Frontend (Vite)       │  Port 5173 (dev)
│  client/src/                    │
│  ├── services/api.js            │  ← Fetch API with Bearer token
│  ├── context/AuthContext.jsx    │  ← User state management
│  ├── pages/Pages.jsx            │  ← Page components
│  └── components/BookCard.jsx    │  ← Reusable UI
└──────────┬──────────────────────┘
           │ HTTP/JSON (CORS)
           ▼
┌─────────────────────────────────┐
│  Express.js API Server          │  Port 5000
│  server/server.js               │
│  ├── routes/bookRoutes.js       │  ← REST endpoints
│  ├── controllers/bookController │  ← Business logic
│  ├── middleware/auth.js         │  ← JWT verification
│  └── config/db.js               │  ← Mongoose connection
└──────────┬──────────────────────┘
           │ Mongoose ODM
           ▼
┌─────────────────────────────────┐
│  MongoDB (Atlas/Local)          │
│  Database: kitabghar            │
│  Collections: books, users, ... │
└─────────────────────────────────┘
```

## End-to-End Request Trace

### Example: Reader browses the Book Catalogue

1. **React** — `BooksPage` mounts, `useApiData("/books")` triggers `useEffect`
2. **Fetch API** — `apiRequest("/books")` calls `fetch(VITE_API_URL + "/books")`
3. **CORS** — Express `cors()` middleware allows the cross-origin request
4. **Express Router** — `GET /api/books` matched in `bookRoutes.js`
5. **Controller** — `bookController.getBooks()` processes query params (search, category, availability)
6. **Mongoose** — `Book.find(filter).sort(sort).skip(skip).limit(limit)` queries MongoDB
7. **MongoDB** — Returns matching book documents from `kitabghar.books` collection
8. **Express** — Sends JSON response: `{ books: [...], count: N, page: 1, pages: P }`
9. **React** — `useState` updates with new data, `BooksPage` re-renders
10. **UI** — `books.map(book => <BookCard key={book._id} book={book} />)` renders cards

### Example: Reader Registration + Login + Protected Dashboard

1. **React** — `RegisterPage` form submission calls `authContext.register()`
2. **Fetch API** — `POST /api/auth/register` with `{ name, email, password }`
3. **Express** — `authController.register()` validates input
4. **Mongoose** — `User.create()` with bcrypt-hashed password
5. **JWT** — `createToken(user._id)` generates signed token
6. **React** — Token stored in `localStorage`, user state updated
7. **Navigate** — `useNavigate()` redirects to `/dashboard`
8. **ProtectedRoute** — Checks `authContext.user` before rendering
9. **Dashboard** — Fetches rentals, subscriptions, notifications via API

## How to Run

```bash
# Terminal 1: Start backend
cd server
npm install
npm run seed    # First time only
npm run dev     # Express on port 5000

# Terminal 2: Start frontend
cd client
npm install
npm run dev     # Vite on port 5173
```

## Evidence Required

1. Both servers running simultaneously (terminal split)
2. Homepage rendering with API-backed data
3. Book catalogue with search/filter (API-backed)
4. Network tab showing XHR/fetch requests to API
5. Book details page (dynamic route + API fetch)
6. Authentication flow (register/login + JWT)
7. Protected dashboard with user-specific data
8. Mobile responsive view of MERN app
