const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const GoldPrice = require('../models/GoldPrice');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', verifyToken, isAdmin, upload.single('file'), async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    const data = rows.map(row => ({
      type: row.type,
      location: row.location,
      buy: row.buy,
      sell: row.sell,
      timestamp: new Date(row.timestamp),
      source: row.source || 'IMPORT',
      sourceUrl: row.sourceUrl || '',
    }));

    await GoldPrice.insertMany(data);
    res.json({ success: true, message: `Đã nhập ${data.length} bản ghi.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi khi nhập dữ liệu' });
  }
});

module.exports = router;