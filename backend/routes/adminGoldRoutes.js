const express = require('express');
const router = express.Router();
const GoldPrice = require('../models/GoldPrice');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin'); 
const ActionLog = require('../models/ActionLog');

router.get('/gold-prices', verifyToken, isAdmin, async (req, res) => {
  try {
    const data = await GoldPrice.find().sort({ timestamp: -1 }).limit(500);
    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, message: 'Không thể tải dữ liệu giá vàng' });
  }
});

router.post('/gold-prices', verifyToken, isAdmin, async (req, res) => {
  try {
    const price = new GoldPrice(req.body);
    await price.save();

    await ActionLog.create({
      user: req.user?.username || 'admin',
      action: 'Thêm giá vàng',
      detail: `${price.type} - ${price.location} lúc ${price.timestamp}`
    });

    res.json({ success: true, message: 'Đã thêm giá vàng' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Không thể thêm giá vàng' });
  }
});

router.put('/gold-prices/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await GoldPrice.findByIdAndUpdate(req.params.id, req.body);

    await ActionLog.create({
      user: req.user?.username || 'admin',
      action: 'Cập nhật giá vàng',
      detail: `ID: ${req.params.id}`
    });

    res.json({ success: true, message: 'Đã cập nhật giá vàng' });
  } catch {
    res.status(500).json({ success: false, message: 'Không thể cập nhật' });
  }
});

router.delete('/gold-prices/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await GoldPrice.findByIdAndDelete(req.params.id);

    await ActionLog.create({
      user: req.user?.username || 'admin',
      action: 'Xoá giá vàng',
      detail: `ID: ${req.params.id}`
    });

    res.json({ success: true, message: 'Đã xoá bản ghi giá vàng' });
  } catch {
    res.status(500).json({ success: false, message: 'Không thể xoá bản ghi' });
  }
});

module.exports = router;
