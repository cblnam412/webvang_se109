const express = require('express');
const router = express.Router();
const GoldPrice = require('../models/GoldPrice');

router.get('/today', async (req, res) => {
  try {
    const now = new Date();
    const vnOffset = 7 * 60 * 60 * 1000;
    const vnNow = new Date(now.getTime() + vnOffset);

    const vnTodayStart = new Date(vnNow);
    vnTodayStart.setHours(0, 0, 0, 0);

    const utcStart = new Date(vnTodayStart.getTime() - vnOffset);

    const prices = await GoldPrice.find({
      sourceDate: { $gte: utcStart },
      isHistorical: false
    }).sort({ sourceDate: -1 });

    res.json({
      success: true,
      data: prices,
      lastUpdated: prices.length > 0 ? prices[0].sourceDate : null
    });
  } catch (err) {
    console.error('❌ Lỗi khi lấy giá vàng hôm nay:', err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

router.get('/history', async (req, res) => {
  try {
    const { type, location, range } = req.query;

    const now = new Date();
    let from = new Date();

    if (range === '1d') from.setDate(now.getDate() - 1);
    else if (range === '1m') from.setMonth(now.getMonth() - 1);
    else if (range === '3m') from.setMonth(now.getMonth() - 3);

    const data = await GoldPrice.find({
      type,
      location,
      sourceDate: { $gte: from, $lte: now }
    }).sort({ sourceDate: 1 });

    const chartData = data.map(d => ({
      date: d.sourceDate.toISOString().split('T')[0],
      buy: d.buy,
      sell: d.sell
    }));

    res.json({ success: true, data: chartData });
  } catch (err) {
    console.error('Lỗi /history:', err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

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
    console.error('Lỗi /by-date:', err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});
    


module.exports = router;
