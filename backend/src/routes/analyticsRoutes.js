const express = require('express');
const router = express.Router();

// Analytics Routes
router.get('/dashboard', (req, res) => {
  res.json({ success: true, message: 'Analytics dashboard endpoint' });
});

module.exports = router;