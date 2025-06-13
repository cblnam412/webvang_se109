const GoldPrice = require('../models/GoldPrice');

exports.getTodayGoldPrices = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    const allToday = await GoldPrice.aggregate([
      {
        $match: {
          timestamp: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: { type: '$type', location: '$location' },
          type: { $first: '$type' },
          location: { $first: '$location' },
          buy: { $first: '$buy' },
          sell: { $first: '$sell' },
          timestamp: { $first: '$timestamp' },
          source: { $first: '$source' },
          sourceUrl: { $first: '$sourceUrl' },
        },
      },
      {
        $project: {
          _id: 0,
          type: 1,
          location: 1,
          buy: 1,
          sell: 1,
          timestamp: 1,
          source: 1,
          sourceUrl: 1,
          displayTime: '$timestamp',
        },
      },
    ]);

    res.json({
      success: true,
      lastUpdated: new Date(),
      data: allToday,
    });
  } catch (err) {
    console.error('Lỗi lấy giá vàng hôm nay:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi lấy dữ liệu.',
    });
  }
};

  exports.getGoldPriceHistory = async (req, res) => {
  try {
    const { type, location, range } = req.query;

    if (!type || !location || !range) {
      return res.status(400).json({ success: false, message: 'Thiếu tham số yêu cầu' });
    }

    const now = new Date();
    let startDate;

    switch (range) {
      case '1d':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '1m':
        startDate = new Date();
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3m':
        startDate = new Date();
        startDate.setMonth(now.getMonth() - 3);
        break;
      default:
        return res.status(400).json({ success: false, message: 'Giá trị range không hợp lệ' });
    }

    const data = await GoldPrice.find({
      type,
      location,
      timestamp: { $gte: startDate, $lte: now }
    }).sort({ timestamp: 1 });

    res.json({ success: true, data });
  } catch (err) {
    console.error('Lỗi lấy biểu đồ giá:', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
};
