# 🌿 HerbalTrace - Complete Cloud Deployment

## Overview

Your HerbalTrace project has been configured for complete cloud deployment with **full blockchain support**. All necessary configuration files have been created.

## 📁 Created Files

### Docker Configuration
- ✅ `Dockerfile` - Frontend container (React + Nginx)
- ✅ `backend/Dockerfile` - Backend container (Node.js + Hyperledger Fabric)
- ✅ `docker-compose.yml` - Complete stack orchestration
- ✅ `.dockerignore` & `backend/.dockerignore` - Build optimization

### Deployment Configuration
- ✅ `railway.toml` - Railway platform config
- ✅ `railway.yml` - Railway services definition
- ✅ `vercel.json` - Vercel frontend config
- ✅ `nginx.conf` - Production web server config

### Environment & Scripts
- ✅ `.env.production` - Environment template
- ✅ `deploy.sh` - Automated deployment script
- ✅ `backend/scripts/initialize-network.sh` - Blockchain initialization

### Documentation
- ✅ `DEPLOYMENT_GUIDE.md` - Complete deployment instructions
- ✅ `QUICK_START.md` - Fast deployment guide
- ✅ `README_DEPLOY.md` - This file

## 🚀 Deployment Options

### Option 1: Free Cloud Deployment (Recommended for Testing)

**Services Used:**
- Frontend: Vercel (Free)
- Backend: Railway (Free - $5/month credit)
- Database: Railway PostgreSQL (Free)
- Cache: Railway Redis (Free)
- Blockchain: Simplified mode (no infrastructure cost)

**Cost:** $0/month

```bash
# Quick deploy
./deploy.sh
# Select option 10: Full cloud deployment
```

### Option 2: Full Blockchain Deployment

**Services Used:**
- All services from Option 1
- Blockchain: Hyperledger Fabric (DigitalOcean Droplet, $24/month)

**Cost:** ~$24/month

```bash
# Deploy frontend and backend to cloud
./deploy.sh

# Then deploy blockchain to DigitalOcean
# See DEPLOYMENT_GUIDE.md for detailed instructions
```

### Option 3: Local Development

```bash
# Start all services locally
docker-compose up -d

# Access at:
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

## ⚡ Quick Start (3 Steps)

### 1. Setup Environment

```bash
# Copy environment template
cp .env.production .env

# Edit .env and fill in your credentials:
nano .env
```

Required credentials:
- Firebase credentials (from Firebase Console)
- JWT secrets (generate random strings)
- Email/SMS credentials (optional)

### 2. Deploy Backend

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway add --plugin postgresql
railway add --plugin redis

# Deploy backend
cd backend
railway up

# Get your backend URL
railway domain
```

### 3. Deploy Frontend

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd /Users/manas/Maanas/Herbal-Trace
vercel --prod
```

When prompted, set:
- `REACT_APP_BACKEND_URL`: Your Railway backend URL
- `REACT_APP_FIREBASE_API_KEY`: Your Firebase API key
- `REACT_APP_FIREBASE_PROJECT_ID`: traceherb-a0011
- `REACT_APP_FIREBASE_AUTH_DOMAIN`: traceherb-a0011.firebaseapp.com

## 🔧 Configuration

### Backend Environment Variables

Set these in Railway dashboard:

```env
NODE_ENV=production
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
FIREBASE_PROJECT_ID=traceherb-a0011
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FABRIC_NETWORK_ENABLED=false
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

### Frontend Environment Variables

Set these in Vercel dashboard:

```env
REACT_APP_BACKEND_URL=https://your-railway-app.railway.app
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_PROJECT_ID=traceherb-a0011
REACT_APP_FIREBASE_AUTH_DOMAIN=traceherb-a0011.firebaseapp.com
```

## 📊 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    HERBAL TRACE STACK                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐      ┌──────────────────────────┐    │
│  │   React     │─────▶│    Node.js Backend      │     │
│  │  (Vercel)   │      │     (Railway)           │     │
│  └─────────────┘      └──────────────────────────┘     │
│                              │                          │
│                       ┌──────┴──────┐                  │
│                       │             │                   │
│              ┌────────▼──────┐  ┌──▼─────────┐        │
│              │  PostgreSQL   │  │   Redis    │         │
│              │   (Railway)   │  │ (Railway)  │         │
│              └───────────────┘  └────────────┘         │
│                                                         │
│              ┌───────────────────────────┐             │
│              │   Firebase Auth           │             │
│              │   (Google Cloud)          │             │
│              └───────────────────────────┘             │
│                                                         │
│  Optional: Full Blockchain                             │
│              ┌───────────────────────────┐             │
│              │  Hyperledger Fabric       │             │
│              │  (DigitalOcean Droplet)   │             │
│              └───────────────────────────┘             │
└─────────────────────────────────────────────────────────┘
```

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change all default passwords in `.env`
- [ ] Generate strong JWT secrets (use `openssl rand -base64 32`)
- [ ] Setup Firebase security rules
- [ ] Configure CORS for your actual domain
- [ ] Enable HTTPS (automatic with Vercel/Railway)
- [ ] Setup rate limiting (configured in backend)
- [ ] Review and update API keys
- [ ] Enable 2FA on Railway and Vercel accounts
- [ ] Setup monitoring and alerts

## 📈 Monitoring

### Railway
```bash
# View logs
railway logs

# View metrics
railway metrics
```

### Vercel
- Access Vercel Dashboard
- View deployment logs
- Check analytics and performance

## 🔄 CI/CD Setup (Optional)

### GitHub Actions for Auto-Deploy

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          npm i -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
  
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm i -g vercel
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check logs
railway logs

# Verify environment variables
railway variables

# Check database connection
railway run npm run db:migrate
```

### Frontend shows 404
```bash
# Verify build output
npm run build

# Check vercel logs
vercel logs
```

### Database connection errors
```bash
# Check PostgreSQL status
railway status

# Test connection
railway run node -e "console.log(process.env.DATABASE_URL)"
```

## 📚 Additional Resources

- **Full Guide**: `DEPLOYMENT_GUIDE.md`
- **Quick Start**: `QUICK_START.md`
- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Hyperledger Fabric**: https://hyperledger-fabric.readthedocs.io

## 🎯 Next Steps

1. ✅ Review `QUICK_START.md` for fast deployment
2. ✅ Read `DEPLOYMENT_GUIDE.md` for detailed instructions
3. ✅ Configure your `.env` file
4. ✅ Deploy backend to Railway
5. ✅ Deploy frontend to Vercel
6. ✅ Test your application
7. ✅ Setup custom domain (optional)
8. ✅ Enable monitoring

## 💡 Tips

- **Free Tier Limits**: Railway gives $5/month credit (enough for small projects)
- **Scaling**: Both platforms scale automatically
- **Custom Domains**: Add custom domains in Railway/Vercel dashboards
- **SSL**: Automatically provided by both platforms
- **Backups**: Railway provides daily PostgreSQL backups

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review deployment guides
3. Check Railway/Vercel status pages
4. Review application logs

---

**Your HerbalTrace blockchain traceability platform is ready for the cloud! 🚀**

Made with ❤️ for herbal supply chain transparency
