# 🚀 HerbalTrace - Command Reference

## Quick Deploy (Recommended)

```bash
cd /Users/manas/Maanas/Herbal-Trace
./deploy-now.sh
```

---

## Manual Deployment Commands

### 1️⃣ Setup Environment

```bash
# Copy environment template
cp .env.production .env

# Edit with your credentials
nano .env

# Generate JWT secrets
openssl rand -base64 32  # Use for JWT_SECRET
openssl rand -base64 32  # Use for JWT_REFRESH_SECRET
```

### 2️⃣ Install CLI Tools

```bash
# Install Railway CLI
npm install -g @railway/cli

# Install Vercel CLI
npm install -g vercel
```

### 3️⃣ Deploy Backend to Railway

```bash
# Navigate to project
cd /Users/manas/Maanas/Herbal-Trace

# Login to Railway
railway login

# Create new project
railway init

# Add PostgreSQL
railway add --plugin postgresql

# Add Redis
railway add --plugin redis

# Deploy backend
cd backend
railway up

# Get backend URL
railway domain

# Set environment variables in Railway dashboard:
# - NODE_ENV=production
# - JWT_SECRET=your_secret
# - JWT_REFRESH_SECRET=your_refresh_secret
# - FIREBASE_PROJECT_ID=traceherb-a0011
# - FIREBASE_PRIVATE_KEY=your_private_key
# - FIREBASE_CLIENT_EMAIL=your_client_email
# - FABRIC_NETWORK_ENABLED=false
# - CORS_ORIGIN=https://your-vercel-app.vercel.app
```

### 4️⃣ Deploy Frontend to Vercel

```bash
# Navigate to project root
cd /Users/manas/Maanas/Herbal-Trace

# Deploy to Vercel
vercel --prod

# When prompted, set environment variables:
# - REACT_APP_BACKEND_URL=https://your-railway-app.railway.app
# - REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
# - REACT_APP_FIREBASE_PROJECT_ID=traceherb-a0011
# - REACT_APP_FIREBASE_AUTH_DOMAIN=traceherb-a0011.firebaseapp.com
```

### 5️⃣ Initialize Database

```bash
# Run migrations
railway run npm run db:migrate

# Seed data (optional)
railway run npm run seed
```

---

## Local Development Commands

### Start All Services Locally

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Access Local Services

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- PostgreSQL: localhost:5432
- Redis: localhost:6379
- Fabric Orderer: localhost:7050
- Fabric Peer: localhost:7051

---

## Monitoring Commands

### Railway

```bash
# View logs
railway logs

# View metrics
railway metrics

# View environment variables
railway variables

# Open dashboard
railway open

# Check status
railway status
```

### Vercel

```bash
# View logs
vercel logs

# View deployments
vercel ls

# Open dashboard
vercel open
```

---

## Database Commands

```bash
# Run migrations
railway run npm run db:migrate

# Generate Prisma client
railway run npm run db:generate

# Seed database
railway run npm run seed

# Check database connection
railway run node -e "console.log(process.env.DATABASE_URL)"
```

---

## Blockchain Commands

### For Full Fabric Deployment

```bash
# Initialize network
railway run bash -c "cd backend/scripts && ./initialize-network.sh"

# Check network status
railway run npm run blockchain:status

# Deploy chaincode
railway run npm run blockchain:deploy
```

---

## Debugging Commands

### Check Backend Health

```bash
curl https://your-railway-app.railway.app/api/health
```

### Check Frontend Build

```bash
npm run build
ls -la build/
```

### Test Database Connection

```bash
railway run node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT NOW()', (err, res) => {
  console.log(err ? err : res.rows[0]);
  pool.end();
});
"
```

### Test Redis Connection

```bash
railway run node -e "
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);
redis.ping().then(console.log).catch(console.error).finally(() => redis.quit());
"
```

---

## Update Commands

### Update Backend

```bash
cd backend
git pull
railway up
```

### Update Frontend

```bash
git pull
vercel --prod
```

---

## Environment Management

### Set Railway Variable

```bash
railway variables set VARIABLE_NAME=value
```

### Set Vercel Variable

```bash
vercel env add VARIABLE_NAME production
```

### List Variables

```bash
# Railway
railway variables

# Vercel
vercel env ls
```

---

## Domain Commands

### Add Custom Domain to Railway

```bash
railway domain
# Then add custom domain in dashboard
```

### Add Custom Domain to Vercel

```bash
vercel domains add yourdomain.com
```

---

## Cleanup Commands

### Remove Railway Project

```bash
railway delete
```

### Remove Vercel Deployment

```bash
vercel rm your-project-name
```

### Stop Local Docker

```bash
docker-compose down -v  # -v removes volumes
```

---

## Useful Shortcuts

### Quick Redeploy

```bash
# Backend
cd backend && railway up

# Frontend
vercel --prod
```

### View All Services

```bash
# Railway
railway status

# Docker local
docker-compose ps

# Vercel
vercel ls
```

### Tail Logs

```bash
# Railway
railway logs --tail

# Docker
docker-compose logs -f backend

# Vercel
vercel logs --follow
```

---

## Emergency Commands

### Rollback Railway Deployment

```bash
railway rollback
```

### Rollback Vercel Deployment

```bash
vercel rollback
```

### Restart Services

```bash
# Railway (redeploy)
railway up --force

# Docker
docker-compose restart
```

---

## Testing Commands

### Test Backend API

```bash
# Health check
curl https://your-backend-url/api/health

# Test authentication
curl -X POST https://your-backend-url/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Test Frontend

```bash
# Build locally
npm run build

# Test production build
npx serve -s build
```

---

## Backup Commands

### Backup Database

```bash
# Export database
railway run pg_dump $DATABASE_URL > backup.sql

# Import database
railway run psql $DATABASE_URL < backup.sql
```

---

## Performance Commands

### Check Build Size

```bash
# Frontend
npm run build
du -sh build/

# Backend
du -sh backend/node_modules/
```

### Optimize Images

```bash
# In Docker
docker-compose build --no-cache
docker system prune -a
```

---

## All-in-One Deploy

```bash
cd /Users/manas/Maanas/Herbal-Trace && ./deploy-now.sh
```

---

**For detailed explanations, see:**
- `README_DEPLOY.md`
- `DEPLOYMENT_GUIDE.md`
- `QUICK_START.md`
