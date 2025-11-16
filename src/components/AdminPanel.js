import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import QRCode from 'qrcode.react';
import {
  Box, Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  Chip, Grid, Card, CardContent, LinearProgress, Alert,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import WarningIcon from '@mui/icons-material/Warning';
import CheckIcon from '@mui/icons-material/Check';
import DescriptionIcon from '@mui/icons-material/Description';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

// Validation Schema for User Form
const UserSchema = Yup.object().shape({
  username: Yup.string().required('Username is required').min(3, 'Username too short'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  role: Yup.string().oneOf(['FARMER', 'PROCESSOR', 'LAB', 'REGULATOR', 'CONSUMER', 'ADMIN'], 'Invalid role').required('Role is required'),
});

// Validation Schema for QR Batch
const QRBatchSchema = Yup.object().shape({
  batchId: Yup.string().required('Batch ID is required'),
  herbName: Yup.string().required('Herb name is required'),
  quantity: Yup.number().required('Quantity is required').positive('Quantity must be positive'),
  harvestDate: Yup.string().required('Harvest date is required'),
  farmerId: Yup.string().required('Farmer ID is required'),
  location: Yup.string().required('Location is required'),
});

function AdminPanel() {
  // State for users
  const [users, setUsers] = useState([]);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [usersLoading, setUsersLoading] = useState(true);
  
  // State for QR batches
  const [batches, setBatches] = useState([]);
  const [batchFilter, setBatchFilter] = useState('');
  const [qrBatchDialogOpen, setQrBatchDialogOpen] = useState(false);
  const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batchToRecall, setBatchToRecall] = useState('');
  
  // State for compliance reports
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportType, setReportType] = useState('compliance');

  // Mock data initialization
  useEffect(() => {
    // Mock users data
    const mockUsers = [
      { id: 1, username: 'admin', email: 'admin@traceherb.com', role: 'ADMIN' },
      { id: 2, username: 'farmer1', email: 'farmer1@traceherb.com', role: 'FARMER' },
      { id: 3, username: 'processor1', email: 'processor1@traceherb.com', role: 'PROCESSOR' },
      { id: 4, username: 'lab1', email: 'lab1@traceherb.com', role: 'LAB' },
      { id: 5, username: 'regulator1', email: 'regulator1@traceherb.com', role: 'REGULATOR' }
    ];
    
    // Load from localStorage if available
    const storedBatches = localStorage.getItem('traceherbBatches');
    
    setUsers(mockUsers);
    setUsersLoading(false);
    
    if (storedBatches) {
      setBatches(JSON.parse(storedBatches));
    } else {
      // Initialize with mock batches if no stored data
      const initialBatches = [
        {
          id: 1,
          batchId: 'TUR2024001',
          herbName: 'Turmeric',
          quantity: 500,
          harvestDate: '2024-01-15',
          farmerId: 'FARM-001',
          location: 'Rajasthan, India',
          status: 'APPROVED',
          qrCodeData: 'TRACEHERB_TUR2024001_7a1b3c8d9e',
          timestamp: new Date().toISOString(),
          recallReason: null
        },
        {
          id: 2,
          batchId: 'ASH2024001',
          herbName: 'Ashwagandha',
          quantity: 300,
          harvestDate: '2024-01-10',
          farmerId: 'FARM-002',
          location: 'Madhya Pradesh, India',
          status: 'APPROVED',
          qrCodeData: 'TRACEHERB_ASH2024001_2d3e4f5a6b',
          timestamp: new Date().toISOString(),
          recallReason: null
        }
      ];
      setBatches(initialBatches);
      localStorage.setItem('traceherbBatches', JSON.stringify(initialBatches));
    }
  }, []);

  // Save batches to localStorage whenever they change
  useEffect(() => {
    if (batches.length > 0) {
      localStorage.setItem('traceherbBatches', JSON.stringify(batches));
    }
  }, [batches]);

  // User management functions
  const handleAddUser = () => {
    setSelectedUser(null);
    setUserDialogOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserDialogOpen(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    }
  };

  const handleSubmitUser = (values) => {
    if (selectedUser) {
      // Update existing user
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === selectedUser.id ? { ...user, ...values } : user
        )
      );
    } else {
      // Add new user
      const newUser = {
        id: Date.now(),
        ...values
      };
      setUsers(prevUsers => [...prevUsers, newUser]);
    }
    setUserDialogOpen(false);
    setSelectedUser(null);
  };

  // QR Code generation functions
  const generateQRCode = (batchData) => {
    // Generate a unique hash/ID for the QR code
    const uniqueId = Math.random().toString(36).substring(2, 10);
    const qrCodeData = `TRACEHERB_${batchData.batchId}_${uniqueId}`;
    
    return qrCodeData;
  };

  const handleAddQRBatch = () => {
    setSelectedBatch(null);
    setQrBatchDialogOpen(true);
  };

  const handleViewQRCode = (batch) => {
    setSelectedBatch(batch);
    setQrCodeDialogOpen(true);
  };

  const handleSubmitQRBatch = (values) => {
    const qrCodeData = generateQRCode(values);
    const newBatch = {
      id: Date.now(),
      ...values,
      qrCodeData,
      status: 'PENDING',
      timestamp: new Date().toISOString(),
      recallReason: null
    };
    
    setBatches(prevBatches => [...prevBatches, newBatch]);
    setQrBatchDialogOpen(false);
    setSelectedBatch(null);
  };

  // Recall functionality
  const handleRecallBatch = () => {
    if (!batchToRecall) {
      alert('Please enter a batch ID to recall');
      return;
    }
    
    const batchIndex = batches.findIndex(batch => batch.batchId === batchToRecall);
    
    if (batchIndex === -1) {
      alert('Batch not found');
      return;
    }
    
    const reason = prompt('Please enter the reason for recall:');
    
    if (!reason) {
      alert('Recall reason is required');
      return;
    }
    
    const updatedBatches = [...batches];
    updatedBatches[batchIndex] = {
      ...updatedBatches[batchIndex],
      status: 'REJECTED',
      recallReason: reason,
      recallDate: new Date().toISOString()
    };
    
    setBatches(updatedBatches);
    alert(`Batch ${batchToRecall} has been recalled`);
    setBatchToRecall('');
  };

  // Compliance report generation
  const handleGenerateReport = () => {
    let reportContent = '';
    
    if (reportType === 'compliance') {
      // Generate compliance report
      reportContent = `TraceHerb Compliance Report\n`;
      reportContent += `Generated on: ${new Date().toISOString()}\n\n`;
      reportContent += `Total Batches: ${batches.length}\n`;
      reportContent += `Approved Batches: ${batches.filter(b => b.status === 'APPROVED').length}\n`;
      reportContent += `Pending Batches: ${batches.filter(b => b.status === 'PENDING').length}\n`;
      reportContent += `Rejected/Recalled Batches: ${batches.filter(b => b.status === 'REJECTED').length}\n\n`;
    }
    
    // In a real app, this would generate a PDF or Excel file
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TraceHerb_Report_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    setReportDialogOpen(false);
  };

  // Filter batches based on input
  const filteredBatches = batches.filter(batch =>
    batch.batchId?.toLowerCase().includes(batchFilter.toLowerCase()) ||
    batch.herbName?.toLowerCase().includes(batchFilter.toLowerCase())
  );

  // Dashboard Metrics
  const totalBatches = batches.length;
  const pendingBatches = batches.filter(b => b.status === 'PENDING').length;
  const approvedBatches = batches.filter(b => b.status === 'APPROVED').length;
  const recalledBatches = batches.filter(b => b.status === 'REJECTED').length;
  const totalQRGenerated = batches.length;

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>Admin Dashboard</Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={3} md={2}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Total Batches</Typography>
                <Typography variant="h4">{totalBatches}</Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={3} md={2}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Pending Approval</Typography>
                <Typography variant="h4">{pendingBatches}</Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={3} md={2}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Approved Batches</Typography>
                <Typography variant="h4">{approvedBatches}</Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={3} md={2}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Recalled Batches</Typography>
                <Typography variant="h4">{recalledBatches}</Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>QR Codes Generated</Typography>
                <Typography variant="h4">{totalQRGenerated}</Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Button variant="contained" onClick={handleAddQRBatch}>
          Generate QR Batch
        </Button>
        <Button variant="contained" onClick={() => setReportDialogOpen(true)}>
          Generate Compliance Report
        </Button>
      </Box>

      {/* Recall Simulation */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" color="error" display="flex" alignItems="center">
            <WarningIcon sx={{ mr: 1 }} /> Batch Recall Simulation
          </Typography>
        </Box>
        <Box display="flex" flexWrap="wrap" gap={2}>
          <TextField
            placeholder="Enter Batch ID to recall"
            size="small"
            sx={{ minWidth: 200 }}
            value={batchToRecall}
            onChange={(e) => setBatchToRecall(e.target.value)}
          />
          <Button variant="contained" color="error" onClick={handleRecallBatch}>
            Recall Batch
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {/* Users Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">User Management</Typography>
              <Box>
                <Button variant="contained" onClick={handleAddUser}>Add User</Button>
              </Box>
            </Box>
            {usersLoading && <LinearProgress />}
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={
                            user.role === 'ADMIN' ? 'Administrator' :
                            user.role === 'FARMER' ? 'Farmer' :
                            user.role === 'PROCESSOR' ? 'Processor' :
                            user.role === 'LAB' ? 'Lab Technician' :
                            user.role === 'REGULATOR' ? 'Regulator' : 'Consumer'
                          }
                          size="small"
                          color={
                            user.role === 'ADMIN' ? 'primary' :
                            user.role === 'LAB' ? 'secondary' :
                            user.role === 'REGULATOR' ? 'info' : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleEditUser(user)}><EditIcon /></IconButton>
                        {user.role !== 'ADMIN' && (
                          <IconButton size="small" onClick={() => handleDeleteUser(user.id)}><DeleteIcon /></IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* QR Batches Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">QR Batch Management</Typography>
              <Box>
                <TextField
                  placeholder="Filter batches..."
                  size="small"
                  sx={{ ml: 1, width: 150 }}
                  value={batchFilter}
                  onChange={(e) => setBatchFilter(e.target.value)}
                />
              </Box>
            </Box>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Batch ID</TableCell>
                    <TableCell>Herb</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Updated</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBatches.map((batch) => (
                    <TableRow key={batch.id} hover>
                      <TableCell>{batch.batchId}</TableCell>
                      <TableCell>{batch.herbName}</TableCell>
                      <TableCell>
                        <Chip
                          label={batch.status === 'APPROVED' ? 'Approved' :
                                 batch.status === 'REJECTED' ? 'Recalled' : 'Pending'}
                          size="small"
                          color={
                            batch.status === 'APPROVED' ? 'success' :
                            batch.status === 'REJECTED' ? 'error' : 'warning'
                          }
                        />
                      </TableCell>
                      <TableCell>{new Date(batch.timestamp).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleViewQRCode(batch)}>
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Add/Edit User Dialog */}
      <Dialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedUser ? 'Edit User' : 'Add New User'}</DialogTitle>
        <Formik
          initialValues={{
            username: selectedUser?.username || '',
            email: selectedUser?.email || '',
            role: selectedUser?.role || 'FARMER',
          }}
          validationSchema={UserSchema}
          onSubmit={handleSubmitUser}
        >
          {({ errors, touched }) => (
            <Form>
              <DialogContent>
                <Field
                  as={TextField}
                  name="username"
                  label="Username"
                  fullWidth
                  margin="dense"
                  error={touched.username && !!errors.username}
                  helperText={touched.username && errors.username}
                />
                <Field
                  as={TextField}
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  margin="dense"
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />
                <FormControl fullWidth margin="dense">
                  <InputLabel>Role</InputLabel>
                  <Field
                    as={Select}
                    name="role"
                    label="Role"
                    error={touched.role && !!errors.role}
                  >
                    <MenuItem value="FARMER">Farmer</MenuItem>
                    <MenuItem value="PROCESSOR">Processor</MenuItem>
                    <MenuItem value="LAB">Lab Technician</MenuItem>
                    <MenuItem value="REGULATOR">Regulator</MenuItem>
                    <MenuItem value="CONSUMER">Consumer</MenuItem>
                    <MenuItem value="ADMIN">Administrator</MenuItem>
                  </Field>
                </FormControl>
                {errors.role && touched.role && (
                  <Typography variant="caption" color="error">{errors.role}</Typography>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setUserDialogOpen(false)}>Cancel</Button>
                <Button type="submit" variant="contained">
                  {selectedUser ? 'Update' : 'Add'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      {/* Generate QR Batch Dialog */}
      <Dialog open={qrBatchDialogOpen} onClose={() => setQrBatchDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate QR Batch</DialogTitle>
        <Formik
          initialValues={{
            batchId: '',
            herbName: '',
            quantity: '',
            harvestDate: '',
            farmerId: '',
            location: ''
          }}
          validationSchema={QRBatchSchema}
          onSubmit={handleSubmitQRBatch}
        >
          {({ errors, touched }) => (
            <Form>
              <DialogContent>
                <Field
                  as={TextField}
                  name="batchId"
                  label="Batch ID"
                  fullWidth
                  margin="dense"
                  error={touched.batchId && !!errors.batchId}
                  helperText={touched.batchId && errors.batchId}
                />
                <Field
                  as={TextField}
                  name="herbName"
                  label="Herb Name"
                  fullWidth
                  margin="dense"
                  error={touched.herbName && !!errors.herbName}
                  helperText={touched.herbName && errors.herbName}
                />
                <Field
                  as={TextField}
                  name="quantity"
                  label="Quantity (kg)"
                  type="number"
                  fullWidth
                  margin="dense"
                  error={touched.quantity && !!errors.quantity}
                  helperText={touched.quantity && errors.quantity}
                />
                <Field
                  as={TextField}
                  name="harvestDate"
                  label="Harvest Date"
                  type="date"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{ shrink: true }}
                  error={touched.harvestDate && !!errors.harvestDate}
                  helperText={touched.harvestDate && errors.harvestDate}
                />
                <Field
                  as={TextField}
                  name="farmerId"
                  label="Farmer ID"
                  fullWidth
                  margin="dense"
                  error={touched.farmerId && !!errors.farmerId}
                  helperText={touched.farmerId && errors.farmerId}
                />
                <Field
                  as={TextField}
                  name="location"
                  label="Location"
                  fullWidth
                  margin="dense"
                  error={touched.location && !!errors.location}
                  helperText={touched.location && errors.location}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setQrBatchDialogOpen(false)}>Cancel</Button>
                <Button type="submit" variant="contained">
                  Generate QR
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      {/* View QR Code Dialog */}
      <Dialog open={qrCodeDialogOpen} onClose={() => setQrCodeDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>QR Code for Batch: {selectedBatch?.batchId}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" p={2}>
            {selectedBatch && (
              <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm mb-4">
                <QrCode value={selectedBatch.qrCodeData} size={256} />
              </div>
            )}
            <Typography variant="subtitle1" gutterBottom>Batch Details:</Typography>
            <Typography variant="body2">Herb: {selectedBatch?.herbName}</Typography>
            <Typography variant="body2">Quantity: {selectedBatch?.quantity} kg</Typography>
            <Typography variant="body2">Farmer ID: {selectedBatch?.farmerId}</Typography>
            <Typography variant="body2">Location: {selectedBatch?.location}</Typography>
            <Typography variant="body2" className="mt-2 font-medium">
              QR Code Data: {selectedBatch?.qrCodeData}
            </Typography>
            {selectedBatch?.recallReason && (
              <Alert severity="error" className="mt-4">
                <strong>Recalled:</strong> {selectedBatch.recallReason}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQrCodeDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Generate Report Dialog */}
      <Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate Compliance Report</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Report Type</InputLabel>
            <Select
              value={reportType}
              label="Report Type"
              onChange={(e) => setReportType(e.target.value)}
            >
              <MenuItem value="compliance">Compliance Summary</MenuItem>
              <MenuItem value="detailed">Detailed Batch Report</MenuItem>
              <MenuItem value="recall">Recall History</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>Cancel</Button>
          <Button type="button" variant="contained" onClick={handleGenerateReport}>
            <DownloadIcon size={16} className="mr-2" /> Generate Report
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminPanel;