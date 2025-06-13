const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const moment = require('moment');

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
  type: { type: String, required: true },
  location: { type: String, required: true },
  buy: { type: Number, required: true },
  sell: { type: Number, required: true },
  timestamp: { type: Date, required: true },
  sourceDate: { type: Date, required: true },
  isHistorical: { type: Boolean, default: true }
}, { collection: 'goldpricehistories' });

const GoldPrice = mongoose.model('GoldPrice', goldPriceSchema);

const GOLD_TYPES = ['SJC 1L', 'PNJ 9999', 'DOJI 24K'];
const LOCATIONS = ['TPHCM', 'Hà Nội', 'Tây Nguyên', 'Đà Nẵng', 'Nam Bộ'];

function simulatePrice(date, location, type) {
  const basePrice = 35000000;
  const yearFactor = (date.year() - 2016) * 1200000;
  const seasonal = 800000 * Math.sin(2 * Math.PI * date.dayOfYear() / 365);
  const locationBias = {
    'TPHCM': 200000,
    'Hà Nội': 150000,
    'Tây Nguyên': -100000,
    'Đà Nẵng': 50000,
    'Nam Bộ': -50000
  }[location];
  const typeFactor = {
    'SJC 1L': 1.05,
    'PNJ 9999': 1.03,
    'DOJI 24K': 1.02
  }[type] || 1;

  const noise = Math.random() * 100000 - 50000;

  const buy = basePrice + yearFactor + seasonal + locationBias + noise;
  const finalBuy = Math.round(buy * typeFactor);
  const finalSell = finalBuy + Math.floor(300000 + Math.random() * 200000);

  return { buy: finalBuy, sell: finalSell };
}

async function generateHistoricalData() {
  const startDate = moment('2016-01-01');
  const endDate = moment();

  for (let m = startDate.clone(); m.isBefore(endDate); m.add(1, 'day')) {
    const timestamp = m.toDate();

    for (const location of LOCATIONS) {
      for (const type of GOLD_TYPES) {
        const { buy, sell } = simulatePrice(m, location, type);

        const doc = new GoldPrice({
          type,
          location,
          buy,
          sell,
          timestamp,
          sourceDate: moment(m).startOf('day').toDate(),
          isHistorical: true
        });

        await doc.save();
        console.log(`✅ ${type} - ${location} - ${m.format('YYYY-MM-DD')} đã lưu`);
      }
    }
  }

  console.log('🎉 Toàn bộ dữ liệu giá vàng lịch sử đã được lưu');
  mongoose.connection.close();
}

generateHistoricalData();
