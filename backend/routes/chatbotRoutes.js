const express = require('express');
const router = express.Router();
const GoldPrice = require('../models/GoldPrice'); 
const ChatLog = require('../models/ChatLog');

const types = ['sjc', 'pnj', 'doji', 'nhẫn', '9999'];
const locations = ['hà nội', 'hồ chí minh', 'tp hcm', 'tphcm', 'đà nẵng'];

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    const userIP = req.ip;

    if (!message || message.length < 3) {
      return res.status(400).json({ reply: 'Bạn vui lòng nhập câu hỏi rõ ràng hơn.' });
    }

    const msg = message.toLowerCase();
    const type = types.find(t => msg.includes(t));
    const location = locations.find(l => msg.includes(l));

    const latest = await GoldPrice.findOne({ isHistorical: false }).sort({ timestamp: -1 });
    if (!latest) {
      return res.json({ reply: '❗ Hệ thống hiện chưa có dữ liệu giá vàng cập nhật.' });
    }

    const query = {
      timestamp: latest.timestamp,
      isHistorical: false
    };

    if (type) query.type = new RegExp(type, 'i');
    if (location) query.location = new RegExp(location, 'i');

    const results = await GoldPrice.find(query);

    let reply;

    if (results.length === 0) {
      const fallbackQuery = {
        timestamp: latest.timestamp,
        isHistorical: false,
        ...(type && { type: new RegExp(type, 'i') })
      };

      const fallback = await GoldPrice.find(fallbackQuery).limit(3);
      if (fallback.length === 0) {
        reply = `❗ Không tìm thấy giá vàng phù hợp với yêu cầu của bạn.`;
      } else {
        reply = `🔍 Không tìm thấy đúng khu vực bạn hỏi. Dưới đây là giá gần nhất:\n` +
          fallback.map(g =>
            `• ${g.type} tại ${g.location}: Mua ${g.buy.toLocaleString()} đ, Bán ${g.sell.toLocaleString()} đ`
          ).join('\n');
      }
    } else {
      reply = `📊 Giá vàng mới nhất (cập nhật ${latest.timestamp.toLocaleString()}):\n` +
        results.map(g =>
          `• ${g.type} tại ${g.location}: Mua ${g.buy.toLocaleString()} đ, Bán ${g.sell.toLocaleString()} đ`
        ).join('\n');
    }

    await ChatLog.create({ userIP, question: message, reply });

    return res.json({ reply });

  } catch (err) {
    console.error('❌ Lỗi chatbot:', err);
    return res.status(500).json({ reply: '⚠️ Lỗi hệ thống khi xử lý truy vấn.' });
  }
});

module.exports = router;
