// checkCollections.js
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect('mongodb://localhost:27017/GoldPriceDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📦 Danh sách collection trong database:');
    collections.forEach(col => console.log(' -', col.name));
    process.exit();
}).catch(err => {
    console.error('❌ Lỗi kết nối MongoDB:', err);
    process.exit(1);
});
