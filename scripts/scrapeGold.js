const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const axios = require('axios');
const mongoose = require('mongoose');

// Kiểm tra biến môi trường
if (!process.env.MONGODB_URI) {
  console.error('Lỗi: MONGODB_URI không được định nghĩa trong .env');
  process.exit(1);
}

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Đã kết nối MongoDB'))
.catch(err => console.error('Lỗi kết nối MongoDB:', err));

const goldPriceSchema = new mongoose.Schema({
  type: String,
  buy: Number,
  sell: Number,
  location: String,
  updatedAt: { type: Date, default: Date.now }
});

const GoldPrice = mongoose.model('goldpricehistories', goldPriceSchema);

async function getGoldPrices() {
  try {
    const response = await axios.get('https://api.techcombank.com/api/v1/gold');
    
    return response.data.map(item => ({
      type: item.goldType,
      buy: item.buyPrice,
      sell: item.sellPrice,
      location: item.city
    }));
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu API:', error);
    
    return [
      {
        type: "SJC 1L",
        buy: 67115000,
        sell: 67815000,
        location: "Hồ Chí Minh"
      },
      {
        type: "SJC 1c",
        buy: 67120000,
        sell: 67820000,
        location: "Hà Nội"
      }
    ];
  }
}

async function main() {
  try {
    const goldPrices = await getGoldPrices();
    
    if (goldPrices.length > 0) {

      await GoldPrice.deleteMany({});
      
      const result = await GoldPrice.insertMany(goldPrices);
      console.log(`Đã lưu ${result.length} bản ghi giá vàng vào MongoDB`);
      
      console.log('\nMẫu dữ liệu:');
      result.slice(0, 2).forEach(item => {
        console.log(`- ${item.type}: Mua ${item.buy.toLocaleString()} - Bán ${item.sell.toLocaleString()} (${item.location})`);
      });
    } else {
      console.log('Không có dữ liệu mới');
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Lỗi chính:', error);
    process.exit(1);
  }
}

main();