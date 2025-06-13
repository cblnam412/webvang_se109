const mongoose = require('mongoose');
require('dotenv').config(); // 👈 thêm dòng này để load .env

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Đã kết nối MongoDB:', process.env.MONGODB_URI);
    } catch (err) {
        console.error('❌ Lỗi kết nối MongoDB:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
