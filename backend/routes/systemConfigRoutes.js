const express = require('express');
const router = express.Router();
const SystemConfig = require('../models/SystemConfig');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

router.get('/settings', verifyToken, isAdmin, async (req, res) => {
  try {
    let config = await SystemConfig.findOne();
    if (!config) {
      config = await SystemConfig.create({});
    }
    res.json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Không thể tải cấu hình' });
  }
});

router.post('/settings', verifyToken, isAdmin, async (req, res) => {
  try {
    const data = req.body;
    let config = await SystemConfig.findOne();
    if (!config) config = new SystemConfig();

    config.set(data);
    await config.save();

    res.json({ success: true, message: 'Cập nhật thành công' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật cấu hình' });
  }
});

module.exports = router;
