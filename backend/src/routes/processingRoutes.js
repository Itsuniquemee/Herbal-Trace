const express = require('express');
const router = express.Router();

// Processing Routes
router.post('/', (req, res) => {
  res.json({ success: true, message: 'Create processing step endpoint' });
});

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Get processing steps endpoint' });
});

module.exports = router;