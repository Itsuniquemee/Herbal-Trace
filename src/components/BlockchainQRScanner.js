import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton
} from '@mui/material';
import {
  QrCodeScanner,
  Upload,
  Close,
  Verified,
  ErrorIcon
} from '@mui/icons-material';
import { Html5QrcodeScanner } from 'html5-qrcode';
import BlockchainService from '../services/BlockchainService';
import toast from 'react-hot-toast';

/**
 * Blockchain-Integrated QR Code Scanner Component
 */
const BlockchainQRScanner = () => {
  const [scanning, setScanning] = useState(false);

  const [provenanceData, setProvenanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const html5QrCodeScannerRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup scanner on component unmount
      if (html5QrCodeScannerRef.current) {
        html5QrCodeScannerRef.current.clear();
      }
    };
  }, []);

  const startScanning = () => {
    setScanning(true);
    setError(null);
    setProvenanceData(null);

    const config = {
      fps: 10,
      qrbox: { width: 300, height: 300 },
      aspectRatio: 1,
      showTorchButtonIfSupported: true,
      showZoomSliderIfSupported: true,
      defaultZoomValueIfSupported: 2,
    };

    html5QrCodeScannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      config,
      false
    );

    html5QrCodeScannerRef.current.render(
      (decodedText, decodedResult) => {
        handleScanSuccess(decodedText);
      },
      (errorMessage) => {
        // Handle scan failure - can be ignored for most cases
        console.log('QR Scan failed:', errorMessage);
      }
    );
  };

  const stopScanning = () => {
    if (html5QrCodeScannerRef.current) {
      html5QrCodeScannerRef.current.clear();
    }
    setScanning(false);
  };

  const handleScanSuccess = async (decodedText) => {
    console.log('QR Code scanned:', decodedText);
    
    stopScanning();
    await verifyProduct(decodedText);
  };

  const verifyProduct = async (qrData) => {
    setLoading(true);
    setError(null);

    try {
      // Parse QR data - could be JSON or just product ID
      let productId;
      try {
        const parsed = JSON.parse(qrData);
        productId = parsed.productId || parsed.id || qrData;
      } catch {
        productId = qrData;
      }

      // Get provenance data from blockchain
      const provenanceResult = await BlockchainService.getProvenance(productId);
      
      if (provenanceResult.success) {
        setProvenanceData(provenanceResult.data);
        setShowResults(true);
        toast.success('Product verified successfully!');
      } else {
        setError({
          type: 'not_found',
          message: 'Product not found in blockchain. This product may not be authentic.',
          productId
        });
        setShowResults(true);
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError({
        type: 'verification_error',
        message: 'Failed to verify product. Please try again.',
        details: err.message
      });
      setShowResults(true);
      toast.error('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Note: Html5QrcodeScanner.scanFile is not available in newer versions
    // This is a simplified implementation
    toast.info('File upload scanning not yet implemented. Please use camera scanning.');
  };

  const getVerificationStatus = () => {
    if (loading) {
      return { color: 'info', icon: <CircularProgress size={20} />, text: 'Verifying...' };
    }
    
    if (error) {
      return { 
        color: 'error', 
        icon: <ErrorIcon />, 
        text: error.type === 'not_found' ? 'Not Authenticated' : 'Verification Failed'
      };
    }
    
    if (provenanceData) {
      return { color: 'success', icon: <Verified />, text: 'Verified Authentic' };
    }
    
    return { color: 'default', icon: <QrCodeScanner />, text: 'Ready to Scan' };
  };

  const closeResults = () => {
    setShowResults(false);
    setProvenanceData(null);
    setError(null);
  };

  const status = getVerificationStatus();

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box textAlign="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Product Verification
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={2}>
          Scan QR code to verify product authenticity and view complete supply chain history
        </Typography>
        
        <Chip 
          icon={status.icon}
          label={status.text}
          color={status.color}
          size="medium"
          sx={{ mb: 2 }}
        />
      </Box>

      {/* Scanner Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          {!scanning && (
            <Box textAlign="center">
              <Typography variant="h6" gutterBottom>
                Choose Scanning Method
              </Typography>
              
              <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
                <Button
                  variant="contained"
                  startIcon={<QrCodeScanner />}
                  onClick={startScanning}
                  size="large"
                >
                  Scan with Camera
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Upload />}
                  component="label"
                  size="large"
                >
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    hidden
                  />
                </Button>
              </Box>
            </Box>
          )}

          {scanning && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Position QR Code in Camera View
                </Typography>
                <IconButton onClick={stopScanning}>
                  <Close />
                </IconButton>
              </Box>
              
              <Box 
                id="qr-reader"
                sx={{ 
                  '& > div': {
                    border: 'none !important'
                  },
                  '& video': {
                    borderRadius: 2
                  }
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Results Dialog */}
      <Dialog 
        open={showResults} 
        onClose={closeResults}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h5">
              Verification Results
            </Typography>
            <IconButton onClick={closeResults}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {loading && (
            <Box textAlign="center" py={4}>
              <CircularProgress size={48} sx={{ mb: 2 }} />
              <Typography>Verifying product on blockchain...</Typography>
            </Box>
          )}

          {error && (
            <Box textAlign="center" py={4}>
              <Alert severity="error" sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {error.type === 'not_found' ? 'Product Not Found' : 'Verification Error'}
                </Typography>
                <Typography>{error.message}</Typography>
                {error.productId && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Product ID: {error.productId}
                  </Typography>
                )}
              </Alert>
              
              {error.type === 'not_found' && (
                <Alert severity="warning">
                  <Typography variant="body2">
                    ⚠️ This product is not registered in our blockchain network. 
                    It may be counterfeit or from an unverified source.
                  </Typography>
                </Alert>
              )}
            </Box>
          )}

          {provenanceData && (
            <Box textAlign="center" py={4}>
              <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={2}>
                <Verified color="success" sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant="h6" color="success.main">
                    Verified Authentic Product
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This product is registered and verified on the blockchain
                  </Typography>
                </Box>
              </Box>
              
              <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={2} mt={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Product ID
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {provenanceData.productId}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Species
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {provenanceData.species || 'N/A'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Origin
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {provenanceData.origin || 'N/A'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Harvest Date
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {provenanceData.harvestDate ? 
                      new Date(provenanceData.harvestDate).toLocaleDateString() : 'N/A'
                    }
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={closeResults}>
            Close
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              closeResults();
              startScanning();
            }}
          >
            Scan Another
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BlockchainQRScanner;