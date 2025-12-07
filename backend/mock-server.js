 const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data storage
let mockProducts = [];
let mockTransactions = [];

// Health check
app.get('/api/blockchain/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  });
});

// Network status
app.get('/api/blockchain/network/status', (req, res) => {
  res.json({
    success: true,
    data: {
      connected: true,
      blockHeight: Math.floor(Math.random() * 1000) + 1000,
      peers: [
        { id: 'peer1', connected: true },
        { id: 'peer2', connected: true },
        { id: 'peer3', connected: false }
      ],
      networkId: 'herbal-trace-network'
    }
  });
});

// Create collection event
app.post('/api/blockchain/collection', (req, res) => {
  try {
    const eventData = req.body;
    const productId = `PROD_${Date.now()}`;
    const txId = `TX_${Math.random().toString(36).substring(2, 15)}`;
    
    const transaction = {
      productId,
      txId,
      eventType: 'collection',
      timestamp: new Date().toISOString(),
      data: eventData,
      status: 'confirmed'
    };
    
    mockTransactions.push(transaction);
    mockProducts.push({
      ...eventData,
      productId,
      txId,
      createdAt: new Date().toISOString()
    });
    
    res.json({
      success: true,
      data: {
        productId,
        txId,
        blockHeight: Math.floor(Math.random() * 1000) + 1000,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create collection event'
    });
  }
});

// Create processing step
app.post('/api/blockchain/processing', (req, res) => {
  try {
    const eventData = req.body;
    const productId = `PROD_${Date.now()}`;
    const txId = `TX_${Math.random().toString(36).substring(2, 15)}`;
    
    const transaction = {
      productId,
      txId,
      eventType: 'processing',
      timestamp: new Date().toISOString(),
      data: eventData,
      status: 'confirmed'
    };
    
    mockTransactions.push(transaction);
    
    res.json({
      success: true,
      data: {
        productId,
        txId,
        blockHeight: Math.floor(Math.random() * 1000) + 1000,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create processing step'
    });
  }
});

// Create quality test
app.post('/api/blockchain/testing', (req, res) => {
  try {
    const eventData = req.body;
    const productId = `PROD_${Date.now()}`;
    const txId = `TX_${Math.random().toString(36).substring(2, 15)}`;
    
    const transaction = {
      productId,
      txId,
      eventType: 'testing',
      timestamp: new Date().toISOString(),
      data: eventData,
      status: 'confirmed'
    };
    
    mockTransactions.push(transaction);
    
    res.json({
      success: true,
      data: {
        productId,
        txId,
        blockHeight: Math.floor(Math.random() * 1000) + 1000,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create quality test'
    });
  }
});

// Get provenance
app.get('/api/blockchain/provenance/:productId', (req, res) => {
  const { productId } = req.params;
  
  // Find transactions for this product
  const transactions = mockTransactions.filter(tx => tx.productId === productId);
  
  if (transactions.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Product not found in blockchain'
    });
  }
  
  const product = mockProducts.find(p => p.productId === productId);
  
  res.json({
    success: true,
    data: {
      productId,
      species: product?.species || 'Unknown',
      origin: product?.location?.address || 'Unknown',
      harvestDate: product?.harvestDate || new Date().toISOString().split('T')[0],
      supplyChain: transactions.map(tx => ({
        eventType: tx.eventType,
        timestamp: tx.timestamp,
        participantName: tx.data.farmerName || tx.data.processorName || tx.data.labName || 'Unknown',
        organization: tx.data.farmName || tx.data.processingFacility || tx.data.labName || 'Unknown',
        location: tx.data.location?.address || 'Unknown',
        type: tx.eventType,
        quality: tx.data.qualityGrade || 'A'
      }))
    }
  });
});

// Get user products
app.get('/api/blockchain/products/user/:userId', (req, res) => {
  res.json({
    success: true,
    data: mockProducts
  });
});

// Get analytics
app.get('/api/blockchain/analytics', (req, res) => {
  res.json({
    success: true,
    data: {
      totalTransactions: mockTransactions.length,
      activeParticipants: Math.floor(Math.random() * 50) + 100,
      networkUptime: '99.9%'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock Blockchain Backend running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/blockchain/health`);
});