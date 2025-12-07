import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import {
  QrCode,
  Add
} from '@mui/icons-material';
import { QRCodeCanvas } from 'qrcode.react';
import BlockchainService from '../services/BlockchainService';
import EnhancedAuthService from '../services/EnhancedAuthService';
import toast from 'react-hot-toast';

/**
 * Blockchain QR Code Generator Component
 */
const BlockchainQRGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [generatedQR, setGeneratedQR] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    species: '',
    quantity: ''
  });

  const generateQRCode = async () => {
    if (!formData.productName || !formData.species || !formData.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      // Get current user
      const userResult = EnhancedAuthService.getCurrentUser();
      if (!userResult.success) {
        throw new Error('Please log in first');
      }

      // Create blockchain event
      const blockchainResult = await BlockchainService.createCollectionEvent({
        eventId: `CE_${Date.now()}`,
        farmerId: userResult.user.id,
        species: formData.species,
        quantity: formData.quantity,
        collectionDate: new Date().toISOString(),
        productName: formData.productName
      });

      if (blockchainResult.success) {
        const qrData = {
          productId: blockchainResult.data.productId || `PROD_${Date.now()}`,
          txId: blockchainResult.data.txId,
          eventType: 'collection',
          timestamp: new Date().toISOString(),
          verificationUrl: `${window.location.origin}/app/trace-viewer/${blockchainResult.data.productId}`
        };

        setGeneratedQR({
          data: JSON.stringify(qrData),
          productInfo: {
            ...formData,
            productId: qrData.productId,
            txId: qrData.txId
          }
        });

        toast.success('QR Code generated successfully on blockchain!');
      } else {
        throw new Error(blockchainResult.error || 'Failed to create blockchain event');
      }
    } catch (error) {
      console.error('QR Generation error:', error);
      toast.error('Failed to generate QR code: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!generatedQR) return;

    const canvas = document.querySelector('#generated-qr-canvas canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `QR-${generatedQR.productInfo.productName.replace(/[^a-zA-Z0-9]/g, '_')}-${generatedQR.productInfo.productId}.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  const resetForm = () => {
    setFormData({
      productName: '',
      species: '',
      quantity: ''
    });
    setGeneratedQR(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Blockchain QR Generator
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create blockchain-verified QR codes for supply chain tracking
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Form Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Product Information
              </Typography>
              
              <TextField
                fullWidth
                label="Product Name *"
                value={formData.productName}
                onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Species *"
                value={formData.species}
                onChange={(e) => setFormData(prev => ({ ...prev, species: e.target.value }))}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Quantity (kg) *"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                sx={{ mb: 3 }}
              />

              <Button
                variant="contained"
                onClick={generateQRCode}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Add />}
                fullWidth
              >
                {loading ? 'Generating...' : 'Generate QR Code'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* QR Code Display Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Generated QR Code
              </Typography>
              
              {generatedQR ? (
                <Box textAlign="center">
                  <Box id="generated-qr-canvas" mb={3}>
                    <QRCodeCanvas
                      value={generatedQR.data}
                      size={256}
                      level="M"
                      includeMargin={true}
                    />
                  </Box>
                  
                  <Typography variant="h6" gutterBottom>
                    QR Code Generated Successfully!
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Product ID: {generatedQR.productInfo.productId}
                  </Typography>
                  
                  <Box display="flex" gap={2} justifyContent="center">
                    <Button
                      variant="contained"
                      onClick={downloadQR}
                    >
                      Download QR Code
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={resetForm}
                    >
                      Generate Another
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box textAlign="center" py={8}>
                  <QrCode sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    No QR Code Generated
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fill in the product information and click "Generate QR Code" to get started
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BlockchainQRGenerator;