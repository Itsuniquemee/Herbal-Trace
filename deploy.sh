#!/bin/bash

# HerbalTrace Deployment Script
# This script helps deploy the complete HerbalTrace application to the cloud

set -e

echo "🌿 HerbalTrace Cloud Deployment Script"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
check_prerequisites() {
    echo "📋 Checking prerequisites..."
    
    commands=("docker" "docker-compose" "git" "node" "npm")
    
    for cmd in "${commands[@]}"; do
        if ! command -v $cmd &> /dev/null; then
            echo -e "${RED}❌ $cmd is not installed${NC}"
            exit 1
        else
            echo -e "${GREEN}✅ $cmd is installed${NC}"
        fi
    done
    echo ""
}

# Setup environment variables
setup_env() {
    echo "🔧 Setting up environment variables..."
    
    if [ ! -f .env ]; then
        if [ -f .env.production ]; then
            cp .env.production .env
            echo -e "${YELLOW}⚠️  Please edit .env file with your actual credentials${NC}"
            echo "Press Enter to continue after editing..."
            read
        else
            echo -e "${RED}❌ .env.production file not found${NC}"
            exit 1
        fi
    else
        echo -e "${GREEN}✅ .env file already exists${NC}"
    fi
    echo ""
}

# Build Docker images
build_images() {
    echo "🔨 Building Docker images..."
    docker-compose build
    echo -e "${GREEN}✅ Docker images built successfully${NC}"
    echo ""
}

# Start services
start_services() {
    echo "🚀 Starting services..."
    docker-compose up -d
    echo -e "${GREEN}✅ Services started successfully${NC}"
    echo ""
}

# Show service status
show_status() {
    echo "📊 Service Status:"
    docker-compose ps
    echo ""
}

# Show logs
show_logs() {
    echo "📜 Recent logs:"
    docker-compose logs --tail=50
}

# Deploy to Railway
deploy_railway() {
    echo "🚂 Deploying to Railway..."
    
    if ! command -v railway &> /dev/null; then
        echo -e "${YELLOW}⚠️  Railway CLI not installed. Installing...${NC}"
        npm i -g @railway/cli
    fi
    
    echo "Logging into Railway..."
    railway login
    
    echo "Linking project..."
    railway link
    
    echo "Deploying..."
    railway up
    
    echo -e "${GREEN}✅ Deployed to Railway successfully${NC}"
    echo ""
}

# Deploy frontend to Vercel
deploy_vercel() {
    echo "▲ Deploying frontend to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}⚠️  Vercel CLI not installed. Installing...${NC}"
        npm i -g vercel
    fi
    
    echo "Deploying to Vercel..."
    vercel --prod
    
    echo -e "${GREEN}✅ Deployed to Vercel successfully${NC}"
    echo ""
}

# Main menu
main_menu() {
    echo "What would you like to do?"
    echo "1. Check prerequisites"
    echo "2. Setup environment variables"
    echo "3. Build Docker images locally"
    echo "4. Start services locally"
    echo "5. Show service status"
    echo "6. Show logs"
    echo "7. Deploy backend to Railway"
    echo "8. Deploy frontend to Vercel"
    echo "9. Full local deployment"
    echo "10. Full cloud deployment"
    echo "0. Exit"
    echo ""
    read -p "Enter your choice: " choice
    
    case $choice in
        1) check_prerequisites ;;
        2) setup_env ;;
        3) build_images ;;
        4) start_services ;;
        5) show_status ;;
        6) show_logs ;;
        7) deploy_railway ;;
        8) deploy_vercel ;;
        9)
            check_prerequisites
            setup_env
            build_images
            start_services
            show_status
            ;;
        10)
            check_prerequisites
            setup_env
            deploy_railway
            deploy_vercel
            echo -e "${GREEN}✅ Full cloud deployment completed!${NC}"
            ;;
        0) exit 0 ;;
        *) 
            echo -e "${RED}Invalid choice${NC}"
            main_menu
            ;;
    esac
}

# Run main menu
while true; do
    main_menu
    echo ""
    read -p "Press Enter to continue..."
    echo ""
done
