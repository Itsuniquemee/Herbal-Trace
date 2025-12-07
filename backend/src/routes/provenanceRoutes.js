const express = require('express');
const router = express.Router();

// Provenance Routes
router.get('/:productId', (req, res) => {
  res.json({ success: true, message: 'Get provenance data endpoint' });
});

module.exports = router;