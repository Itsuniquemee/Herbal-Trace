import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Import Firebase authentication
import { FirebaseAuthProvider, useFirebaseAuth } from './hooks/useFirebaseAuth';

// Import components
import PASLandingPage from './components/PASLandingPageTailwind';
import MainLayout from './components/MainLayout';
import Login from './components/Login';
import Signup from './components/Signup';
import PhoneOTPLogin from './components/PhoneOTPLogin';
import TraceViewer from './components/TraceViewer';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRedirect from './components/RoleBasedRedirect';

// Import blockchain components
import BlockchainDashboard from './components/BlockchainDashboard';
import BlockchainQRScanner from './components/BlockchainQRScanner';
import BlockchainQRGenerator from './components/BlockchainQRGenerator';
import EnhancedLogin from './components/EnhancedLogin';

// Import farmer components
import FarmerCropUpload from './components/farmer/FarmerCropUpload';

// Import processor components
import ProcessorReceiveBatches from './components/processor/ProcessorReceiveBatches';

// Import admin components
import AdminPendingApprovals from './components/AdminPendingApprovals';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2c7744', // Ayurvedic green
      light: '#5a9c6b',
      dark: '#1f5130',
    },
    secondary: {
      main: '#5a3f37', // Earth brown
      light: '#8a6d65',
      dark: '#3e2c25',
    },
    background: {
      default: '#f5f7f9',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

// Main app content component with Firebase auth
const AppContent = () => {
  const { user, profile, loading, isAuthenticated, signOut } = useFirebaseAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Page change handler
  const handlePageChange = (pageId) => {
    setCurrentPage(pageId);
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut();
  };

  // Show loading spinner while authentication is being initialized
  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <div className="text-center">
          <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
          <div className="text-white text-lg">Initializing TraceHerbs...</div>
        </div>
      </Box>
    );
  }

  const combinedUser = isAuthenticated && profile ? { ...user, ...profile } : null;

  return (
    <Routes>
      {/* Landing page - always shown first, no layout wrapper */}
      <Route path="/" element={<PASLandingPage />} />
      <Route path="/home" element={<PASLandingPage />} />
      
      {/* Login and Signup routes - no layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/enhanced-login" element={<EnhancedLogin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/phone-login" element={<PhoneOTPLogin />} />
      
      {/* Dashboard route */}
      <Route path="/dashboard" element={
        combinedUser ? 
          <RoleBasedRedirect user={combinedUser} /> : 
          <Navigate to="/login" />
      } />
      
      {/* Protected app routes with MainLayout */}
      <Route path="/app/*" element={
        combinedUser ? (
          <MainLayout 
            user={combinedUser} 
            onLogout={handleLogout}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          >
            <Routes>
              {/* Blockchain Dashboard - Enhanced main dashboard */}
              <Route path="main-dashboard" element={<BlockchainDashboard />} />
              <Route path="blockchain-dashboard" element={<BlockchainDashboard />} />
              
              {/* Farmer routes */}
              <Route path="farmer/crop-upload" element={
                <ProtectedRoute user={combinedUser} requiredRoles={['admin', 'farmer']}>
                  <FarmerCropUpload />
                </ProtectedRoute>
              } />
              
              {/* Processor routes */}
              <Route path="processor/receive-batches" element={
                <ProtectedRoute user={combinedUser} requiredRoles={['admin', 'processor']}>
                  <ProcessorReceiveBatches />
                </ProtectedRoute>
              } />
              
              {/* Admin routes */}
              <Route path="admin/pending-approvals" element={
                <ProtectedRoute user={combinedUser} requiredRoles={['admin']}>
                  <AdminPendingApprovals />
                </ProtectedRoute>
              } />
              
              {/* Common routes */}
              <Route path="qr-scanner" element={<BlockchainQRScanner />} />
              <Route path="qr-generator" element={<BlockchainQRGenerator />} />
              <Route path="trace-viewer/:traceId?" element={<TraceViewer />} />
              
              {/* Catch-all route for app section */}
              <Route path="*" element={<Navigate to="main-dashboard" />} />
            </Routes>
          </MainLayout>
        ) : (
          <Navigate to="/login" />
        )
      } />
      
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

// Main App component
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FirebaseAuthProvider>
        <Router future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}>
          <Box className="App" sx={{ minHeight: '100vh', width: '100%' }}>
            <AppContent />
          </Box>
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: 'green',
                  secondary: 'black',
                },
              },
            }}
          />
        </Router>
      </FirebaseAuthProvider>
    </ThemeProvider>
  );
}

export default App;