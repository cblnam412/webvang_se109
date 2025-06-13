const express = require('express');
const router = express.Router();
const ProfitRecord = require('../models/ProfitRecord');
const verifyToken = require('../middleware/verifyToken');
const mongoose = require('mongoose');

// Lưu bản ghi
router.post('/', verifyToken, async (req, res) => {
  try {
    const { type, location, buyPrice, quantity, resultSell, profit, latestTimestamp } = req.body;
    const record = new ProfitRecord({
      user: req.user.id,
      type, location, buyPrice, quantity, resultSell, profit, latestTimestamp
    });
    await record.save();
    res.json({ success: true, message: 'Đã lưu bản ghi', data: record });
  } catch {
    res.status(500).json({ success: false, message: 'Lỗi khi lưu bản ghi' });
  }
});

// Xem bản ghi
router.get('/', verifyToken, async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user.id };
    const records = await ProfitRecord.find(filter)
      .populate('user', 'username _id')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: records });
  } catch {
    res.status(500).json({ success: false, message: 'Lỗi khi tải dữ liệu' });
  }
});

// Xoá bản ghi
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID không hợp lệ' });
    }

    const record = await ProfitRecord.findById(id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bản ghi' });
    }

    // Kiểm tra quyền xoá
    if (req.user.role !== 'admin' && record.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Không có quyền xoá bản ghi này' });
    }

    await record.deleteOne();
    res.json({ success: true, message: 'Đã xoá bản ghi' });
  } catch (err) {
    console.error('Lỗi xoá bản ghi:', err);
    res.status(500).json({ success: false, message: 'Lỗi server khi xoá bản ghi' });
  }
});

module.exports = router;
