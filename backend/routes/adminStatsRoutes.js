const express = require('express');
const router = express.Router();
const GoldPrice = require('../models/GoldPrice');
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

router.get('/stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const [goldCount, userCount, adminCount] = await Promise.all([
      GoldPrice.countDocuments(),
      User.countDocuments(),
      User.countDocuments({ role: 'admin' })
    ]);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todayGold = await GoldPrice.countDocuments({ timestamp: { $gte: startOfDay } });

    res.json({
      success: true,
      data: {
        goldCount,
        userCount,
        adminCount,
        todayGold
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi thống kê', error: err.message });
  }
});

module.exports = router;