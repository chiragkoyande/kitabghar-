# Experiment 4: Kitab Ghar React Router Single Page Application

## Aim
To develop a Single Page Application (SPA) using React Router, Hooks, and Component Lifecycle Behaviour for the Kitab Ghar Badlapur book rental platform.

## Technologies Used
- React 18
- React Router v6 (`react-router-dom`)
- Vite Dev Server
- JavaScript ES6+
- CSS3 Custom Properties & Grid/Flexbox Layouts

## Architecture & Routes
- `/`: `HomePage` — Brand header, Book Genie guide hero, trust bar, featured books preview, membership CTA.
- `/books`: `BooksCataloguePage` — Live search, category pills, availability & sort filters, book cards grid.
- `/books/:id`: `BookDetailsPage` — Dynamic parameter route extracting `:id` via `useParams()`, lifecycle data fetching via `useEffect()`, breadcrumbs, rental actions.
- `/membership`: `MembershipPage` — Reader subscription tiers (Basic ₹199, Standard ₹299, Premium ₹499) with interactive state and subscription CTAs.
- `/login`: `LoginPage` — Controlled authentication form with email and password state, demo quick-fill, and programmatic navigation via `useNavigate()`.
- `/register`: `RegisterPage` — Reader registration form with controlled input states and navigation to dashboard.
- `/dashboard`: `DashboardPage` — Protected route guarded by `<ProtectedRoute>`, displaying reader profile, active rentals, return actions, and subscription details.
- `*`: `NotFoundPage` — Client-side 404 fallback route for unmatched URLs with navigation links back to `/` and `/books`.

## Hooks Implemented
- `useState`: Controlled inputs, category selections, form state, and feedback banners.
- `useEffect`: Component lifecycle behaviour (data fetching on `:id` change, document title sync, scroll restoration, timer cleanups).
- `useContext`: `AuthContext` providing user session, login, registration, and rental state.
- `useMemo`: Derived catalogue filtering, category extraction, and sorting calculations.
- `useParams`: Dynamic URL parameter extraction for book catalogue records (`/books/:id`).
- `useNavigate`: Programmatic client-side redirection after authentication, rental, and plan selection.
- `useLocation`: Reading current route pathname for breadcrumbs and return-to redirect logic.

## Running Locally
```bash
npm run dev
# Server runs at http://127.0.0.1:4176
```
