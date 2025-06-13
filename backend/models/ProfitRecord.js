// models/ProfitRecord.js
const mongoose = require('mongoose');

const profitRecordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: String,
  location: String,
  buyPrice: Number,
  quantity: Number,
  resultSell: Number,
  profit: Number,
  latestTimestamp: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProfitRecord', profitRecordSchema);
