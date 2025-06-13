const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const goldPriceRoutes = require('./routes/goldPriceRoutes');
const authRoutes = require('./routes/auth');
const adminAuthRoutes = require('./routes/adminAuth');
const adminStatsRoutes = require('./routes/adminStatsRoutes');
const systemLogRoutes = require('./routes/systemLogRoutes');
const systemConfigRoutes = require('./routes/systemConfigRoutes');
const userAdminRoutes = require('./routes/userAdminRoutes');
const actionLogRoutes = require('./routes/actionLogRoutes');

const adminExportRoutes = require('./routes/adminExportRoutes');
const adminImportRoutes = require('./routes/adminImportRoutes');

const adminGoldRoutes = require('./routes/adminGoldRoutes');
const profitRoutes = require('./routes/profitRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');

// Kết nối MongoDB
connectDB();

// Khởi tạo Express app
const app = express();
app.use(cors());
app.use(express.json());


// Routes
app.use('/api/gold-prices', goldPriceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin', adminGoldRoutes);
app.use('/api/admin', adminStatsRoutes);
app.use('/api/admin', systemLogRoutes);
app.use('/api/admin', systemConfigRoutes);
app.use('/api/admin', userAdminRoutes);
app.use('/api/admin', actionLogRoutes);
app.use('/api/profit-records', profitRoutes);
app.use('/api/admin/export', adminExportRoutes);
app.use('/api/admin/import', adminImportRoutes);
app.use('/api/chatbot', chatbotRoutes);
// Chạy server
const PORT = process.env.PORT || 5000;
require('./tasks/scheduler');
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
