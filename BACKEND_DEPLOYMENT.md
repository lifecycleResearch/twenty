# Twenty CRM Backend Deployment Guide

This guide covers deploying the Twenty backend API (NestJS) to production. The backend cannot run on Vercel's serverless functions—it requires a persistent Node.js server.

## System Architecture

```
┌─────────────────┐
│  Vercel         │  Frontend (React + Vite)
│  Static Build   │  → https://twenty-*.vercel.app
└────────┬────────┘
         │ GraphQL API calls
         ↓
┌─────────────────┐
│  Railway/Render │  Backend (NestJS)
│  Persistent     │  → https://backend.railway.app (example)
└────────┬────────┘
         │
    ┌────┴────────────────┬──────────────────┐
    ↓                     ↓                  ↓
┌─────────────┐  ┌──────────────┐  ┌─────────────┐
│  Supabase   │  │ Upstash Redis│  │  Postgres   │
│  PostgreSQL │  │  (Cache)     │  │  (Data)     │
└─────────────┘  └──────────────┘  └─────────────┘
  us-west-1         configured       configured
```

## Prerequisites

- Supabase PostgreSQL account (✓ configured)
- Upstash Redis account (✓ configured)
- Backend hosting account (Railway, Render, or similar)
- GitHub repository (lifecycleResearch/twenty)

## Option 1: Railway (Recommended)

Railway integrates seamlessly with GitHub and is straightforward for full-stack apps.

### Steps:

1. **Create Railway account**: https://railway.app
2. **Connect GitHub**: Link your lifecycleResearch/twenty repository
3. **Create new project** from the GitHub repo
4. **Add environment variables** from `.env.production`:
   ```
   NODE_ENV=production
   PG_DATABASE_URL=postgresql://postgres:postgres@db.yjenmiwoquclvxeskzxf.supabase.co:5432/postgres
   REDIS_URL=https://default:AZv2AAIncDFkMzNkNDk0ZDAwNzM0YWIzYTRiNjMyYTFlYzZlMTg3YXAxMzk5MjY@sacred-hamster-39926.upstash.io
   SUPABASE_URL=https://yjenmiwoquclvxeskzxf.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<key>
   APP_SECRET=<generated secret>
   SIGN_IN_PREFILLED=true
   IS_WORKSPACE_CREATION_LIMITED_TO_SERVER_ADMINS=false
   FRONTEND_URL=https://twenty-*.vercel.app  # Update with actual Vercel URL
   AUTH_PASSWORD_ENABLED=true
   IS_MULTIWORKSPACE_ENABLED=true
   ```

5. **Configure build and start commands**:
   - Build: `yarn workspace twenty-server build`
   - Start: `node packages/twenty-server/dist/main.js`

6. **Deploy**: Push to main branch or manually trigger deployment from Railway dashboard

7. **Get backend URL**: Railway provides a public URL like `https://twenty-production-xyz.railway.app`

8. **Run migrations** (one-time):
   ```
   npx nx run twenty-server:database:migrate:prod
   ```
   Run this via Railway shell or locally with the deployed database connection.

### Railway Configuration (Automatic)

The repository includes `railway.json` which Railway auto-detects:
```json
{
  "build": {
    "builder": "nixpacks",
    "buildCommand": "yarn workspace twenty-server build"
  },
  "deploy": {
    "startCommand": "node packages/twenty-server/dist/main.js"
  }
}
```

---

## Option 2: Render.com

Similar to Railway but with different dashboard layout.

1. Create account at https://render.com
2. **New Web Service** → Connect GitHub
3. Select `lifecycleResearch/twenty` repository
4. Runtime: Node
5. Build command: `yarn install --immutable && yarn workspace twenty-server build`
6. Start command: `node packages/twenty-server/dist/main.js`
7. Add all environment variables from `.env.production`
8. Deploy

---

## Option 3: Docker + Any Cloud Provider

For AWS, GCP, Azure, or Fly.io:

### Build Docker image:
```bash
docker build -t twenty-backend .
docker run -p 3001:3001 \
  -e PG_DATABASE_URL="..." \
  -e REDIS_URL="..." \
  twenty-backend
```

### Push to registry (ECR, Artifact Registry, Docker Hub):
```bash
docker tag twenty-backend:latest your-registry/twenty-backend:latest
docker push your-registry/twenty-backend:latest
```

### Deploy on cloud platform (follow their container deployment docs)

---

## Post-Deployment: Connect Frontend

Once backend is deployed, update the frontend to point to it:

### 1. Set Vercel environment variable:

In Vercel dashboard → Project Settings → Environment Variables, add:
```
VITE_API_BASE_URL=https://your-backend-url.railway.app
```

Replace `your-backend-url.railway.app` with the actual backend URL.

### 2. Redeploy frontend:

```bash
git commit -m "Update backend API URL"
git push origin main
```

Vercel automatically redeploys on push.

---

## Running Database Migrations

After backend is live, initialize the database:

### Via Railway/Render shell:
```bash
npx nx run twenty-server:database:migrate:prod
```

### Or locally (if database is accessible):
```bash
export PG_DATABASE_URL="postgresql://..."
export REDIS_URL="https://..."
npx nx run twenty-server:database:migrate:prod
```

---

## Monitoring & Debugging

### Check backend logs:
- **Railway**: Dashboard → Project → Logs
- **Render**: Services → Logs
- **Docker/Cloud**: Use provider's logging service

### Test API health:
```bash
curl https://your-backend-url/health
```

### Test GraphQL endpoint:
```bash
curl -X POST https://your-backend-url/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query { user { id } }"}'
```

---

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `NODE_ENV` | Runtime mode | `production` |
| `PG_DATABASE_URL` | PostgreSQL connection | Supabase URL |
| `REDIS_URL` | Redis cache | Upstash URL |
| `SUPABASE_URL` | Supabase API URL | https://...supabase.co |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role auth | JWT token |
| `APP_SECRET` | Session encryption | Random 32+ char |
| `FRONTEND_URL` | CORS origin | Vercel deployment URL |
| `AUTH_PASSWORD_ENABLED` | Enable password login | `true` |
| `IS_MULTIWORKSPACE_ENABLED` | Allow multiple workspaces | `true` |

---

## Troubleshooting

### Build fails: "Cannot find module"
- Ensure `yarn install --immutable` runs before build
- Check that all transitive dependencies are available

### Database connection refused
- Verify `PG_DATABASE_URL` is correct
- Check Supabase firewall allows connection
- Test locally: `psql $PG_DATABASE_URL`

### Redis connection refused
- Verify `REDIS_URL` format (should start with `https://`)
- Test with redis-cli: `redis-cli -u $REDIS_URL ping`

### Frontend can't reach backend
- Verify backend URL in `VITE_API_BASE_URL`
- Check CORS headers (backend should allow frontend origin)
- Test endpoint: `curl https://backend-url/graphql`

---

## Summary

1. **Choose hosting**: Railway (easiest), Render, or Docker
2. **Deploy backend**: Connect GitHub, set env vars, deploy
3. **Get backend URL**: From hosting provider dashboard
4. **Update frontend**: Set `VITE_API_BASE_URL` in Vercel
5. **Run migrations**: Once backend is live
6. **Test**: Access frontend, verify API calls work

Once complete, you'll have a fully functional Twenty CRM:
- Frontend: https://twenty-*.vercel.app
- Backend API: https://your-backend-url
- Database: Supabase PostgreSQL
- Cache: Upstash Redis
