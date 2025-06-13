const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const moment = require('moment-timezone');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'GoldPriceDB'
})
.then(() => console.log('Kết nối MongoDB thành công'))
.catch(err => {
  console.error('Lỗi kết nối MongoDB:', err);
  process.exit(1);
});

const goldPriceSchema = new mongoose.Schema({
  type: String,
  location: String,
  buy: Number,
  sell: Number,
  timestamp: Date,
  sourceDate: Date,
  isHistorical: { type: Boolean, default: false }
}, { collection: 'goldpricehistories' });

const GoldPrice = mongoose.model('GoldPrice', goldPriceSchema);

const GOLD_TYPES = ['SJC 1L', 'PNJ 9999', 'DOJI 24K'];
const LOCATIONS = ['TPHCM', 'Hà Nội', 'Tây Nguyên', 'Đà Nẵng', 'Nam Bộ'];

function simulatePrice(location, type) {
  const base = 74000000;
  const locationAdj = {
    'TPHCM': 0,
    'Hà Nội': -100000,
    'Tây Nguyên': -200000,
    'Đà Nẵng': 50000,
    'Nam Bộ': -150000
  }[location] || 0;

  const typeAdj = {
    'SJC 1L': 100000,
    'PNJ 9999': -100000,
    'DOJI 24K': -50000
  }[type] || 0;

  const noise = Math.floor(Math.random() * 100000 - 50000);
  const buy = base + locationAdj + typeAdj + noise;
  const sell = buy + Math.floor(300000 + Math.random() * 200000);

  return { buy, sell };
}

async function insertTodayPrices() {
  const nowVN = moment().tz('Asia/Ho_Chi_Minh');
  const timestamp = nowVN.toDate();                 
  const sourceDate = nowVN.clone().startOf('day').toDate(); 

  for (const location of LOCATIONS) {
    for (const type of GOLD_TYPES) {
      const { buy, sell } = simulatePrice(location, type);

      const price = new GoldPrice({
        type,
        location,
        buy,
        sell,
        timestamp,
        sourceDate,
        isHistorical: false
      });

      await price.save();
      console.log(`Đã lưu: ${type} - ${location} - ${buy} / ${sell}`);
    }
  }

  console.log('Đã thêm dữ liệu giá vàng hôm nay');
  mongoose.connection.close();
}

insertTodayPrices();
