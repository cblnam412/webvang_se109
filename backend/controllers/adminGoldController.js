// backend/controllers/adminGoldController.js
const GoldPrice = require('../models/GoldPrice');

exports.createGoldPrice = async (req, res) => {
  try {
    const { type, location, buy, sell } = req.body;
    const newGold = new GoldPrice({ type, location, buy, sell });
    await newGold.save();
    res.status(201).json({ success: true, message: 'Thêm giá vàng thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi thêm' });
  }
};

exports.updateGoldPrice = async (req, res) => {
  try {
    const updated = await GoldPrice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Không tìm thấy bản ghi' });
    res.json({ success: true, message: 'Cập nhật thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi cập nhật' });
  }
};

exports.deleteGoldPrice = async (req, res) => {
  try {
    const deleted = await GoldPrice.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Không tìm thấy bản ghi' });
    res.json({ success: true, message: 'Đã xoá thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi xoá' });
  }
};
exports.getAllGoldPrices = async (req, res) => {
  try {
    const data = await GoldPrice.find().sort({ timestamp: -1 });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Không thể lấy dữ liệu' });
  }
};
