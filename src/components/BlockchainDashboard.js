import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Eco,
  Security,
  Verified,
  QrCode
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import BlockchainService from '../services/BlockchainService';
import EnhancedAuthService from '../services/EnhancedAuthService';

/**
 * Blockchain-Integrated Dashboard Component
 */
const BlockchainDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [blockchainStatus, setBlockchainStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    
    try {
      // Load user data
      const userResult = EnhancedAuthService.getCurrentUser();
      if (userResult.success) {
        setUser(userResult.user);
      }

      // Load blockchain status
      const statusResult = await BlockchainService.getNetworkStatus();
      if (statusResult.success) {
        setBlockchainStatus(statusResult.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
        <Typography textAlign="center" sx={{ mt: 2 }}>
          Loading blockchain dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
            <DashboardIcon />
          </Avatar>
          <Box>
            <Typography variant="h4">
              Welcome, {user?.firstName || 'User'}!
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Chip 
                label={user?.role?.toUpperCase() || 'USER'} 
                color="primary" 
                size="small" 
              />
              <Chip 
                icon={<Verified />}
                label="Verified" 
                color="success" 
                size="small" 
              />
            </Box>
          </Box>
        </Box>
        
        <Button 
          variant="contained"
          startIcon={<QrCode />}
          onClick={() => navigate('/qr-scanner')}
        >
          Scan QR Code
        </Button>
      </Box>

      {/* Blockchain Status Alert */}
      {blockchainStatus && !blockchainStatus.connected && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography>
            Blockchain network is currently disconnected. Some features may be limited.
          </Typography>
        </Alert>
      )}

      {/* Dashboard Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Blockchain Status
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Security color={blockchainStatus?.connected ? 'success' : 'error'} />
                <Typography variant="h6" color={blockchainStatus?.connected ? 'success.main' : 'error.main'}>
                  {blockchainStatus?.connected ? 'Connected' : 'Disconnected'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Security Score
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Security color="success" />
                <Typography variant="h6" color="success.main">
                  98%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={98} 
                color="success" 
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                All security checks passed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                QR Codes Generated
              </Typography>
              <Typography variant="h4" color="primary">
                12
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This month
              </Typography>
              <Button 
                size="small" 
                onClick={() => navigate('/qr-generator')}
                sx={{ mt: 1 }}
              >
                Generate New
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Products Traced
              </Typography>
              <Typography variant="h4" color="success.main">
                156
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total verified products
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Button 
                  variant="outlined" 
                  startIcon={<QrCode />}
                  onClick={() => navigate('/qr-generator')}
                >
                  Generate QR Code
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<QrCode />}
                  onClick={() => navigate('/qr-scanner')}
                >
                  Scan QR Code
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<Eco />}
                  onClick={() => navigate('/trace-viewer')}
                >
                  View Trace History
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Network Status
              </Typography>
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Total Transactions
                </Typography>
                <Typography variant="h4" color="primary">
                  2,456
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Network Uptime
                </Typography>
                <Typography variant="h6" color="success.main">
                  99.9%
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Active Participants
                </Typography>
                <Typography variant="h4" color="info.main">
                  156
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BlockchainDashboard;