# HerbalTrace Cloud Deployment Guide

## 🌿 Complete Deployment with Blockchain

This guide will help you deploy the complete HerbalTrace application with Hyperledger Fabric blockchain to the cloud.

## Architecture Overview

- **Frontend**: React app → Vercel (Free)
- **Backend**: Node.js + Express → Railway (Free tier)
- **Blockchain**: Hyperledger Fabric → Docker containers on Railway
- **Database**: PostgreSQL → Railway PostgreSQL (Free)
- **Cache**: Redis → Railway Redis (Free)
- **Auth & Storage**: Firebase (Free tier)

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Docker & Docker Compose**
3. **Git**
4. **Railway CLI**: `npm install -g @railway/cli`
5. **Vercel CLI**: `npm install -g vercel`

## Deployment Options

### Option 1: Automated Deployment (Recommended)

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

The script provides an interactive menu for:
- Local Docker deployment
- Railway backend deployment
- Vercel frontend deployment
- Complete cloud deployment

### Option 2: Manual Deployment

#### Step 1: Setup Environment Variables

1. Copy the production environment file:
```bash
cp .env.production .env
```

2. Edit `.env` and fill in your actual credentials:
   - Firebase credentials
   - JWT secrets
   - Database passwords
   - Email/SMS credentials (optional)

#### Step 2: Deploy Backend to Railway

1. **Install Railway CLI**:
```bash
npm install -g @railway/cli
```

2. **Login to Railway**:
```bash
railway login
```

3. **Create a new project**:
```bash
railway init
```

4. **Add PostgreSQL database**:
```bash
railway add --plugin postgresql
```

5. **Add Redis cache**:
```bash
railway add --plugin redis
```

6. **Set environment variables**:
```bash
# Copy all variables from .env file to Railway
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your_jwt_secret
railway variables set FIREBASE_PROJECT_ID=your_project_id
# ... add all other variables
```

7. **Deploy the backend**:
```bash
cd backend
railway up
```

8. **Get your backend URL**:
```bash
railway domain
```
Save this URL, you'll need it for the frontend.

#### Step 3: Deploy Frontend to Vercel

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Set environment variables**:
Create environment variables in Vercel dashboard or CLI:
```bash
vercel env add REACT_APP_BACKEND_URL production
# Enter your Railway backend URL

vercel env add REACT_APP_FIREBASE_API_KEY production
# Enter your Firebase API key

vercel env add REACT_APP_FIREBASE_PROJECT_ID production
# Enter your Firebase project ID

vercel env add REACT_APP_FIREBASE_AUTH_DOMAIN production
# Enter your Firebase auth domain
```

3. **Deploy to Vercel**:
```bash
vercel --prod
```

#### Step 4: Setup Hyperledger Fabric Network

The Hyperledger Fabric network is containerized and will run alongside your backend on Railway.

1. **Verify network configuration**:
```bash
cd network
docker-compose -f docker/docker-compose-herbaltrace.yaml config
```

2. **The network includes**:
   - Orderer nodes (consensus)
   - Peer nodes (ledger storage)
   - CouchDB (state database)
   - Certificate Authorities

3. **Network will auto-start** with the backend deployment.

## Configuration Files Created

### Backend Files:
- `backend/Dockerfile` - Backend container image
- `backend/.dockerignore` - Files to exclude from Docker
- `railway.toml` - Railway deployment configuration

### Frontend Files:
- `Dockerfile` - Frontend container image with Nginx
- `nginx.conf` - Nginx web server configuration
- `.dockerignore` - Files to exclude from Docker
- `vercel.json` - Vercel deployment configuration

### Infrastructure:
- `docker-compose.yml` - Complete local/cloud stack
- `.env.production` - Production environment template
- `deploy.sh` - Automated deployment script

## Local Development

Test the complete stack locally before deploying:

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5432
- Redis: localhost:6379
- Fabric Orderer: localhost:7050
- Fabric Peer: localhost:7051

## Post-Deployment Steps

### 1. Initialize Blockchain Network

After deployment, initialize the Hyperledger Fabric channel and chaincode:

```bash
# SSH into Railway backend container
railway run bash

# Initialize the network (this should be automated in your startup script)
cd scripts
./initialize-network.sh
```

### 2. Setup Firebase Authentication

1. Go to Firebase Console
2. Enable Authentication methods (Email/Password, Phone)
3. Add your deployed domains to authorized domains
4. Update Firestore security rules

### 3. Database Migrations

Run database migrations on Railway:

```bash
railway run npm run db:migrate
```

### 4. Seed Initial Data (Optional)

```bash
railway run npm run seed
```

## Free Tier Limits

### Railway:
- 500 hours/month execution time
- 100GB outbound bandwidth
- Shared CPU/512MB RAM
- PostgreSQL: 1GB storage
- Redis: 100MB storage

### Vercel:
- 100GB bandwidth/month
- Unlimited deployments
- Global CDN

### Firebase:
- 50K reads/day
- 20K writes/day
- 1GB storage
- 10GB bandwidth/month

## Scaling Considerations

For production use beyond free tiers:

1. **Railway Pro** ($5/month):
   - 2GB RAM
   - Dedicated resources
   - More database storage

2. **Vercel Pro** ($20/month):
   - Unlimited bandwidth
   - Team collaboration

3. **Firebase Blaze** (Pay-as-you-go):
   - Scales with usage
   - More generous quotas

## Monitoring & Logs

### Railway:
```bash
# View real-time logs
railway logs

# View metrics
railway metrics
```

### Vercel:
- View logs in Vercel Dashboard
- Real-time function logs
- Performance analytics

## Blockchain Network Monitoring

Access blockchain network metrics:
- Orderer: `http://your-backend-url:9443/metrics`
- Peer: `http://your-backend-url:9444/metrics`

## Troubleshooting

### Backend won't start:
1. Check environment variables in Railway
2. Verify PostgreSQL connection
3. Check logs: `railway logs`

### Frontend shows API errors:
1. Verify REACT_APP_BACKEND_URL is set correctly
2. Check CORS settings in backend
3. Verify backend is running

### Blockchain connection fails:
1. Check Fabric network logs
2. Verify wallet initialization
3. Check certificate validity
4. Ensure network is fully started

### Database connection errors:
1. Check DATABASE_URL format
2. Verify PostgreSQL is running
3. Run migrations: `railway run npm run db:migrate`

## Security Checklist

- [ ] Change all default passwords
- [ ] Generate strong JWT secrets
- [ ] Setup Firebase security rules
- [ ] Enable CORS only for your domain
- [ ] Use HTTPS everywhere
- [ ] Enable rate limiting
- [ ] Setup environment variables properly
- [ ] Never commit .env files
- [ ] Use secrets management
- [ ] Enable 2FA on deployment platforms

## Support & Resources

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Hyperledger Fabric Docs: https://hyperledger-fabric.readthedocs.io
- Firebase Docs: https://firebase.google.com/docs

## Next Steps After Deployment

1. **Test the complete flow**:
   - Register users
   - Create herb batches
   - Record blockchain transactions
   - Generate QR codes
   - Verify traceability

2. **Monitor performance**:
   - Check response times
   - Monitor blockchain transactions
   - Review error logs

3. **Setup CI/CD**:
   - Auto-deploy on git push
   - Run tests before deployment
   - Automated database migrations

4. **Domain Setup**:
   - Add custom domain to Vercel
   - Add custom domain to Railway
   - Setup SSL certificates (auto-provided)

## Estimated Deployment Time

- Environment setup: 15 minutes
- Backend deployment: 10 minutes
- Frontend deployment: 5 minutes
- Network initialization: 10 minutes
- Testing: 15 minutes

**Total: ~55 minutes**

---

**Your HerbalTrace application with full blockchain capabilities is now ready for the cloud! 🚀**
