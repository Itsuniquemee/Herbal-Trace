const express = require('express');
const router = express.Router();

// Notification Routes  
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Get notifications endpoint' });
});

router.post('/send', (req, res) => {
  res.json({ success: true, message: 'Send notification endpoint' });
});

module.exports = router;