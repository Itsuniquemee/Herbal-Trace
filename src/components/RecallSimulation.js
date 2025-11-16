import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material';
import axios from 'axios';

function RecallSimulation() {
  const [batchId, setBatchId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleRecall = async () => {
    try {
      // Replace with real backend endpoint
      const res = await axios.post('http://127.0.0.1:5001/api/recall', { batchId });
      setResult(res.data);
      setError('');
    } catch (err) {
      setError('Recall simulation failed');
      setResult(null);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 8 }}>
      <Paper elevation={4} sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Batch Recall Simulation</Typography>
        <TextField label="Batch ID" value={batchId} onChange={e => setBatchId(e.target.value)} fullWidth sx={{ mb: 2 }} />
        <Button variant="contained" color="error" onClick={handleRecall} fullWidth>Simulate Recall</Button>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {result && <Alert severity="success" sx={{ mt: 2 }}>Recall simulated! {JSON.stringify(result)}</Alert>}
      </Paper>
    </Box>
  );
}

export default RecallSimulation;
