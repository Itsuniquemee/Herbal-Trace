#!/bin/bash

# Network initialization script for Hyperledger Fabric
# This script sets up the blockchain network, channel, and chaincode

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔗 Initializing Hyperledger Fabric Network..."

# Check if network is already initialized
if [ -f /app/network/.initialized ]; then
    echo -e "${GREEN}✅ Network already initialized${NC}"
    exit 0
fi

# Wait for orderer and peers to be ready
echo "⏳ Waiting for network components..."
sleep 10

# Create channel
echo "📝 Creating channel..."
peer channel create \
    -o orderer.herbaltrace.com:7050 \
    -c herbaltrace-channel \
    -f /app/network/channel-artifacts/channel.tx \
    --outputBlock /app/network/channel-artifacts/herbaltrace-channel.block \
    --tls --cafile /app/network/organizations/ordererOrganizations/herbaltrace.com/orderers/orderer.herbaltrace.com/msp/tlscacerts/tlsca.herbaltrace.com-cert.pem

# Join channel
echo "🔗 Joining channel..."
peer channel join \
    -b /app/network/channel-artifacts/herbaltrace-channel.block

# Update anchor peers
echo "⚓ Updating anchor peers..."
peer channel update \
    -o orderer.herbaltrace.com:7050 \
    -c herbaltrace-channel \
    -f /app/network/channel-artifacts/FarmersMSPanchors.tx \
    --tls --cafile /app/network/organizations/ordererOrganizations/herbaltrace.com/orderers/orderer.herbaltrace.com/msp/tlscacerts/tlsca.herbaltrace.com-cert.pem

# Package chaincode
echo "📦 Packaging chaincode..."
cd /app/chaincode
peer lifecycle chaincode package herbaltrace.tar.gz \
    --path . \
    --lang node \
    --label herbaltrace_1

# Install chaincode
echo "💾 Installing chaincode..."
peer lifecycle chaincode install herbaltrace.tar.gz

# Get package ID
PACKAGE_ID=$(peer lifecycle chaincode queryinstalled | grep herbaltrace_1 | awk '{print $3}' | sed 's/,$//')

# Approve chaincode
echo "✅ Approving chaincode..."
peer lifecycle chaincode approveformyorg \
    -o orderer.herbaltrace.com:7050 \
    --channelID herbaltrace-channel \
    --name herbaltrace \
    --version 1.0 \
    --package-id $PACKAGE_ID \
    --sequence 1 \
    --tls --cafile /app/network/organizations/ordererOrganizations/herbaltrace.com/orderers/orderer.herbaltrace.com/msp/tlscacerts/tlsca.herbaltrace.com-cert.pem

# Commit chaincode
echo "🚀 Committing chaincode..."
peer lifecycle chaincode commit \
    -o orderer.herbaltrace.com:7050 \
    --channelID herbaltrace-channel \
    --name herbaltrace \
    --version 1.0 \
    --sequence 1 \
    --tls --cafile /app/network/organizations/ordererOrganizations/herbaltrace.com/orderers/orderer.herbaltrace.com/msp/tlscacerts/tlsca.herbaltrace.com-cert.pem

# Mark as initialized
touch /app/network/.initialized

echo -e "${GREEN}✅ Network initialization complete!${NC}"
