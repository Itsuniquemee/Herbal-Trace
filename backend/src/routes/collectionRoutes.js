const express = require('express');
const router = express.Router();

// Collection Routes
router.post('/', (req, res) => {
  res.json({ success: true, message: 'Create collection endpoint' });
});

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Get collections endpoint' });
});

module.exports = router;