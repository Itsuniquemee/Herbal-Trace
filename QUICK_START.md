# Quick Start Deployment Guide

## 🚀 Deploy HerbalTrace in 3 Steps

### Step 1: Deploy Backend to Railway

1. **Sign up for Railway**: https://railway.app
2. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

3. **Login and deploy**:
   ```bash
   cd /Users/manas/Maanas/Herbal-Trace
   railway login
   railway init
   railway add --plugin postgresql
   railway add --plugin redis
   ```

4. **Set environment variables in Railway Dashboard**:
   - Go to your Railway project
   - Click on "Variables"
   - Add these variables:
     ```
     NODE_ENV=production
     JWT_SECRET=your_jwt_secret_here
     JWT_REFRESH_SECRET=your_refresh_secret_here
     FIREBASE_PROJECT_ID=traceherb-a0011
     FIREBASE_PRIVATE_KEY=your_firebase_private_key
     FIREBASE_CLIENT_EMAIL=your_firebase_client_email
     FABRIC_NETWORK_ENABLED=false
     ```

5. **Deploy**:
   ```bash
   cd backend
   railway up
   ```

6. **Get your backend URL**:
   ```bash
   railway domain
   ```
   Save this URL (e.g., `https://your-app.railway.app`)

### Step 2: Deploy Frontend to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   cd /Users/manas/Maanas/Herbal-Trace
   vercel
   ```

3. **Set environment variables** when prompted:
   - `REACT_APP_BACKEND_URL`: Use your Railway backend URL
   - `REACT_APP_FIREBASE_API_KEY`: Your Firebase API key
   - `REACT_APP_FIREBASE_PROJECT_ID`: traceherb-a0011
   - `REACT_APP_FIREBASE_AUTH_DOMAIN`: traceherb-a0011.firebaseapp.com

4. **Deploy to production**:
   ```bash
   vercel --prod
   ```

### Step 3: Initialize Database

1. **Run migrations**:
   ```bash
   railway run npm run db:migrate
   ```

2. **Seed initial data** (optional):
   ```bash
   railway run npm run seed
   ```

## ✅ You're Live!

Your application is now deployed:
- **Frontend**: Your Vercel URL (e.g., `https://your-app.vercel.app`)
- **Backend**: Your Railway URL (e.g., `https://your-app.railway.app`)

## 📝 Notes on Blockchain

For free deployment, we're using a **simplified blockchain mode** that stores blockchain data in PostgreSQL with cryptographic hashing. This provides:
- ✅ Immutable records
- ✅ Transaction history
- ✅ Data integrity
- ✅ Audit trails

For full Hyperledger Fabric blockchain, you'll need:
- Dedicated server (AWS EC2, DigitalOcean Droplet)
- Minimum 4GB RAM
- Docker support
- See `DEPLOYMENT_GUIDE.md` for full instructions

## 🔧 Alternative: Full Blockchain on DigitalOcean

If you need full Hyperledger Fabric:

1. **Create a Droplet** (4GB RAM, $24/month)
2. **Install Docker**:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```

3. **Clone your repo**:
   ```bash
   git clone https://github.com/your-repo/HerbalTrace
   cd HerbalTrace
   ```

4. **Deploy with Docker Compose**:
   ```bash
   docker-compose up -d
   ```

## 🆘 Need Help?

Check `DEPLOYMENT_GUIDE.md` for detailed instructions.
