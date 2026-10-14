# Deployment checklist

## Before deployment

- [ ] Run `npm run build` in `client`.
- [ ] Run server syntax checks.
- [ ] Copy `.env.example` values into the hosting dashboards only.
- [ ] Confirm `.env` files and credentials are ignored by Git.
- [ ] Put the official logo in `client/public/kitab-ghar-logo.png`.

## After deployment

- [ ] Configure Render's `CLIENT_ORIGIN` with the exact Vercel URL.
- [ ] Configure Vercel's `VITE_API_URL` with the exact Render API URL.
- [ ] Test `/api/health`.
- [ ] Test registration, login, membership, rental and return.
- [ ] Confirm Atlas persistence.
- [ ] Test a direct refresh on `/books/:id` and `/dashboard`.
