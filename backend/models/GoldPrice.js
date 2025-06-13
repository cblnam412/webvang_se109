const mongoose = require('mongoose');

const goldPriceSchema = new mongoose.Schema({
  type: String,
  location: String,
  buy: Number,
  sell: Number,
  timestamp: Date,
  source: String,
  sourceUrl: String,
});

module.exports = mongoose.model('GoldPriceHistory', goldPriceSchema, 'goldpricehistories');
