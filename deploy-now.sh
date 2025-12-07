#!/bin/bash

# One-command deployment for HerbalTrace

echo "🌿 HerbalTrace - One Command Deploy"
echo "===================================="
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "🎯 Deployment Steps:"
echo ""
echo "1️⃣  First, let's setup your environment file..."
if [ ! -f .env ]; then
    cp .env.production .env
    echo "✅ Created .env file"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env file and add your credentials:"
    echo "   - Firebase credentials"
    echo "   - JWT secrets (use: openssl rand -base64 32)"
    echo ""
    read -p "Press Enter after you've edited .env..."
fi

echo ""
echo "2️⃣  Deploying Backend to Railway..."
echo "   This will:"
echo "   - Create a Railway project"
echo "   - Add PostgreSQL database"
echo "   - Add Redis cache"
echo "   - Deploy your backend"
echo ""
read -p "Press Enter to continue..."

cd backend
railway login
railway init
railway add --plugin postgresql
railway add --plugin redis

echo ""
echo "📝 Setting environment variables..."
echo "   Please set these in Railway dashboard:"
echo "   - JWT_SECRET"
echo "   - JWT_REFRESH_SECRET"
echo "   - FIREBASE_PROJECT_ID"
echo "   - FIREBASE_PRIVATE_KEY"
echo "   - FIREBASE_CLIENT_EMAIL"
echo "   - FABRIC_NETWORK_ENABLED=false"
echo ""
read -p "Press Enter after setting variables in Railway dashboard..."

railway up

BACKEND_URL=$(railway domain)
echo ""
echo "✅ Backend deployed at: $BACKEND_URL"

cd ..

echo ""
echo "3️⃣  Deploying Frontend to Vercel..."
echo ""
read -p "Press Enter to continue..."

# Set Vercel environment variables
echo ""
echo "📝 When prompted by Vercel, set these variables:"
echo "   REACT_APP_BACKEND_URL=$BACKEND_URL"
echo "   REACT_APP_FIREBASE_API_KEY=(your Firebase API key)"
echo "   REACT_APP_FIREBASE_PROJECT_ID=traceherb-a0011"
echo "   REACT_APP_FIREBASE_AUTH_DOMAIN=traceherb-a0011.firebaseapp.com"
echo ""

vercel --prod

echo ""
echo "✅ ✅ ✅ DEPLOYMENT COMPLETE! ✅ ✅ ✅"
echo ""
echo "Your HerbalTrace application is now live!"
echo ""
echo "🔗 URLs:"
echo "   Backend: $BACKEND_URL"
echo "   Frontend: (check Vercel output above)"
echo ""
echo "📋 Next steps:"
echo "   1. Test your application"
echo "   2. Run database migrations: railway run npm run db:migrate"
echo "   3. Add custom domains (optional)"
echo "   4. Setup monitoring"
echo ""
echo "📚 Documentation:"
echo "   - Quick Start: QUICK_START.md"
echo "   - Full Guide: DEPLOYMENT_GUIDE.md"
echo "   - This README: README_DEPLOY.md"
echo ""
