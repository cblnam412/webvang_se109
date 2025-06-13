const express = require('express');
const router = express.Router();
const ActionLog = require('../models/ActionLog');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

router.get('/logs', verifyToken, isAdmin, async (req, res) => {
  try {
      const logs = await ActionLog.find().sort({ createdAt: -1 }).limit(100);
      console.log('✅ Số lượng log:', logs.length);
      res.json({ success: true, data: logs });
  } catch (err) {
    console.error('❌ Lỗi lấy log:', err);
    res.status(500).json({ success: false, message: 'Lỗi khi lấy log thao tác' });
  }
});


module.exports = router;