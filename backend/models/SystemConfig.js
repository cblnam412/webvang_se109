const mongoose = require('mongoose');

const systemConfigSchema = new mongoose.Schema({
  updateInterval: { type: Number, default: 5 }, 
  alertThreshold: { type: Number, default: 300000 }, 
  defaultSource: { type: String, default: 'DOJI' },
  enableAlert: { type: Boolean, default: true }
});

module.exports = mongoose.model('SystemConfig', systemConfigSchema);
