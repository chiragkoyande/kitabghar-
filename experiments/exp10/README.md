# Experiment 10 — MERN Stack Cloud Deployment

## College Requirement

Deploy a MERN Stack web application on a cloud platform and demonstrate end-to-end functionality.

## Target Architecture

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│  React Frontend     │     │  Express Backend     │     │  MongoDB Atlas      │
│  → Vercel           │ ──→ │  → Render            │ ──→ │  Cloud Database     │
│  (Static/CDN)       │     │  (Web Service)       │     │  (kitabghar)        │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
```

## Deployment Configuration Files

| File | Purpose |
|------|---------|
| `client/vercel.json` | SPA rewrite rules for Vercel |
| `server/vercel.json` | Serverless function config (alternative) |
| `render.yaml` | Render web service configuration |
| `.github/workflows/ci.yml` | CI/CD pipeline |
| `server/.env` | MongoDB Atlas connection string |

## Deployment Steps

### Part A: Frontend (Vercel)

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Set Root Directory to `client/`
4. Framework: Vite → Build command: `npm run build` → Output: `dist/`
5. Set environment variable: `VITE_API_URL` → production backend URL
6. Deploy and verify SPA routing works

### Part B: Backend (Render)

1. Create Web Service on Render
2. Connect GitHub repository
3. Set Root Directory to `server/`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Set environment variables:
   - `MONGODB_URI` → MongoDB Atlas connection string
   - `JWT_SECRET` → production secret
   - `CLIENT_ORIGIN` → Vercel frontend URL
   - `NODE_ENV` → production
7. Deploy and verify `/api/health` endpoint

### Part C: Database (MongoDB Atlas)

1. Create MongoDB Atlas cluster (free tier)
2. Create database user
3. Whitelist IP addresses (or allow from anywhere for Render)
4. Get connection string
5. Verify data migration / seeding

## Verification Checklist

- [ ] Git repository exists and is pushed
- [ ] `npm run build` succeeds for client
- [ ] Vercel deployment shows live URL
- [ ] Render deployment shows live URL
- [ ] MongoDB Atlas cluster is active
- [ ] `/api/health` returns 200 on production
- [ ] Frontend loads on production URL
- [ ] Frontend can fetch data from production API
- [ ] Authentication works in production
- [ ] CRUD operations work end-to-end

## Evidence Required

1. Git repository / GitHub dashboard
2. Production build terminal output
3. Vercel deployment dashboard
4. Render deployment dashboard
5. MongoDB Atlas cluster view
6. Production frontend URL in browser
7. Production API health check
8. End-to-end production test (frontend → API → database)

## Honesty Note

If full deployment cannot be verified at the time of manual generation:
- Part A documents what was actually deployed and verified
- Part B documents remaining deployment configuration/requirements
- Unverified steps are clearly labeled as such
