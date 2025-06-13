const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema({
  type: { type: String, enum: ['error', 'info'], required: true },
  message: { type: String, required: true },
  detail: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SystemLog', systemLogSchema);
