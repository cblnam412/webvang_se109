const express = require('express');
const router = express.Router();
const GoldPrice = require('../models/GoldPrice');
const { Parser } = require('json2csv');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const data = await GoldPrice.find({});
    const fields = ['type', 'location', 'buy', 'sell', 'timestamp', 'source', 'sourceUrl'];
    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('gold_prices.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi xuất dữ liệu' });
  }
});

module.exports = router;