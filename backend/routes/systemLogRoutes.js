const express = require('express');
const router = express.Router();
const SystemLog = require('../models/SystemLog');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

router.get('/logs', verifyToken, isAdmin, async (req, res) => {
  try {
    const logs = await SystemLog.find().sort({ timestamp: -1 }).limit(100);
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Không thể tải log' });
  }
});

module.exports = router;
