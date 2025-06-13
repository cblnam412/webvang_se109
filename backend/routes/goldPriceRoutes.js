const express = require('express');
const router = express.Router();
const GoldPrice = require('../models/GoldPrice');
const SystemLog = require('../models/SystemLog');

const {
  getTodayGoldPrices,
  getGoldPriceHistory
} = require('../controllers/goldPriceController');

router.get('/today', getTodayGoldPrices);
router.get('/history', getGoldPriceHistory);

router.get('/by-date', async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ success: false, message: 'Thiếu tham số ngày' });

  try {
    const offset = 7 * 60 * 60 * 1000;
    const startVN = new Date(date + 'T00:00:00.000+07:00');
    const endVN = new Date(startVN.getTime() + 24 * 60 * 60 * 1000);
    const utcStart = new Date(startVN.getTime() - offset);
    const utcEnd = new Date(endVN.getTime() - offset);

    const prices = await GoldPrice.find({
      sourceDate: { $gte: utcStart, $lt: utcEnd }
    }).sort({ sourceDate: -1 });

    if (prices.length === 0) {
      return res.status(404).json({ success: false, message: 'Không có dữ liệu cho ngày đã chọn' });
    }

    res.json({ success: true, data: prices });
  } catch (err) {
  await SystemLog.create({
    type: 'error',
    message: 'Lỗi khi truy cập /by-date',
    detail: err.message
  });

  res.status(500).json({ success: false, message: 'Lỗi server' });
}
});

router.get('/latest', async (req, res) => {
  const { type, location } = req.query;
  if (!type || !location)
    return res.status(400).json({ success: false, message: 'Thiếu tham số' });

  try {
    const latest = await GoldPrice.findOne({ type, location }).sort({ timestamp: -1 });
    if (!latest) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy dữ liệu' });
    }
    res.json({ success: true, data: latest });
  } catch {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

module.exports = router;
