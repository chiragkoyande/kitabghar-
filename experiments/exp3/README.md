# Experiment 3 — React Functional Components, JSX, Props and State

## Dedicated Component-to-Concept Mapping

This practical is evidenced from the **current Kitab Ghar main React client** (`client/src/`).
The main application is a genuine React 18 SPA that naturally demonstrates every required concept.

## How to Run

```bash
cd server && npm run dev    # Start Express API + MongoDB
cd client && npm run dev    # Start Vite React dev server
```

Open the Vite address shown in the terminal (typically `http://localhost:5173`).

---

## Concept → Source Mapping

### 1. Functional Components

| Component | File | Line | Purpose |
|-----------|------|------|---------|
| `App` | `client/src/App.jsx` | L10 | Root application component with route composition |
| `BookCard` | `client/src/components/BookCard.jsx` | L4 | Reusable book display card |
| `HomePage` | `client/src/pages/Pages.jsx` | L13 | Home page composing Hero, FeaturedBooks, etc. |
| `BooksPage` | `client/src/pages/Pages.jsx` | L17 | Live catalogue with search, filter, and sort |
| `GenieHero` | `client/src/components/hero/GenieHero.jsx` | L8 | Book Genie hero with API-backed state |
| `BookGenieWizard` | `client/src/components/genie/BookGenieWizard.jsx` | - | Interactive recommendation wizard |
| `Layout` | `client/src/components/Layout.jsx` | - | Shared layout with navigation |
| `ProtectedRoute` | `client/src/components/ProtectedRoute.jsx` | - | Auth guard wrapper |

**Key observation:** Every component in the Kitab Ghar client is a **functional component** — no class components are used anywhere.

### 2. JSX

JSX is used throughout the application. Key examples:

- **`BookCard.jsx`**: Returns JSX with conditional rendering (`book.coverImage ? <img> : <fallback>`), template literals in className, and nested component composition.
- **`Pages.jsx` → `BooksPage`**: JSX maps over `books` array to render `<BookCard>` components, uses conditional `&&` rendering for loading/error states.
- **`App.jsx`**: Declarative JSX route tree using `<Routes>`, `<Route>`, `<Navigate>`.

### 3. Props

| Component | Prop | Type | Source |
|-----------|------|------|--------|
| `BookCard` | `book` | Object `{_id, title, author, category, availableCopies, coverImage}` | Passed from `BooksPage` via `books.map()` |
| `Layout` | `children` | ReactNode | Passed implicitly via `<Route element={<Layout />}>` Outlet |
| `ProtectedRoute` | `children` | ReactNode | Wraps protected route content |
| `AuthProvider` | `children` | ReactNode | Wraps entire app in `main.jsx` |

**Key example — `BookCard` props:**
```jsx
// client/src/pages/Pages.jsx — BooksPage renders:
{books.map((book) => <BookCard key={book._id} book={book} />)}

// client/src/components/BookCard.jsx — receives:
export default function BookCard({ book }) {
  // Destructured prop used for title, author, category, availability
}
```

### 4. State (useState)

| Component | State Variable | Purpose |
|-----------|---------------|---------|
| `BooksPage` | `query` | Search input text |
| `BooksPage` | `category` | Selected category filter |
| `BooksPage` | `availability` | Availability filter |
| `BooksPage` | `sortMode` | Sort order selection |
| `GenieHero` | `books` | Fetched book catalogue |
| `GenieHero` | `loading` | API loading indicator |
| `GenieHero` | `error` | API error message |
| `GenieHero` | `open` | Genie wizard visibility |
| `AuthContext` | `user` | Current authenticated user |
| `AuthContext` | `loading` | Auth state loading |

**Key example — `BooksPage` state:**
```jsx
const [query, setQuery] = useState("");
const [category, setCategory] = useState("");
const [availability, setAvailability] = useState("");
const [sortMode, setSortMode] = useState("popular");
```

### 5. useEffect (Side Effects)

| Component | Effect Purpose |
|-----------|---------------|
| `useApiData` (custom hook) | Fetches API data when `path` changes, cleans up on unmount |
| `GenieHero` | Loads book catalogue on mount via `loadBooks()` |
| `AuthContext` | Checks token and loads user profile on mount |
| `BookDetailsPage` | Fetches single book details when `id` param changes |

**Key example — `useApiData` custom hook:**
```jsx
function useApiData(path) {
  const [state, setState] = useState({ loading: true, data: null, error: "" });
  useEffect(() => {
    let active = true;
    apiRequest(path)
      .then((data) => active && setState({ loading: false, data, error: "" }))
      .catch((error) => active && setState({ loading: false, data: null, error: error.message }));
    return () => { active = false; };  // Cleanup on unmount
  }, [path]);
  return state;
}
```

---

## Evidence Sources

All evidence is captured from the **live running application** — no separate experiment UI is created because the main Kitab Ghar client genuinely implements all required React concepts in production.
