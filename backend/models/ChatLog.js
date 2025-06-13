// models/ChatLog.js
const mongoose = require('mongoose');

const ChatLogSchema = new mongoose.Schema({
  userIP: String,
  question: String,
  reply: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatLog', ChatLogSchema);
