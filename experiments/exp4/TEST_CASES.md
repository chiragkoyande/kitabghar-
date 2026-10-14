# Experiment 4 Test Cases — React Router SPA & Hooks

| Test ID | Scenario | Input / Action | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **E4-01** | Client-Side SPA Navigation | Click "Browse Books" in header navigation | Navigates to `/books` without full page reload; renders 77 catalogue titles | PASS |
| **E4-02** | Controlled Search Hook | Type "Murakami" into catalogue search input | `useState` updates query; `useMemo` filters cards down to matching titles | PASS |
| **E4-03** | Category Filter Interaction | Click "Classics" category pill | Updates category state; only Classics book cards are displayed | PASS |
| **E4-04** | Dynamic Route Parameter (`useParams`) | Click "View Details" on The Wind in the Willows (`/books/1`) | URL changes to `/books/1`; `useParams()` extracts `id: 1` and displays book details | PASS |
| **E4-05** | Lifecycle Hook (`useEffect`) & Title Sync | Navigate directly to `/books/8` (Aphasia) | `useEffect` triggers on `id` change; loads book and updates `document.title` | PASS |
| **E4-06** | Membership Plan Route & State | Navigate to `/membership` and select "Bibliophile Premium" | Renders membership tiers; active selection state highlights Premium card | PASS |
| **E4-07** | Protected Route Guard (`ProtectedRoute`) | Navigate to `/dashboard` when logged out | `ProtectedRoute` blocks access and redirects user to `/login` with return state | PASS |
| **E4-08** | Controlled Login & `useNavigate` | Click "Demo Reader Quick Fill & Login" | Logs in reader into `AuthContext` and uses `useNavigate` to redirect to `/dashboard` | PASS |
| **E4-09** | Catch-All 404 Route (`*`) | Navigate to an unmatched path `/unknown-url` | Renders `NotFoundPage` with 404 error code and link back to home | PASS |
| **E4-10** | Mobile Viewport Responsiveness | Set browser viewport to 320 × 900 px | SPA layout adapts to mobile screen with 2-column grid and zero horizontal overflow | PASS |
