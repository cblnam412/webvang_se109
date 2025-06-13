const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');

const scriptPath = path.resolve(__dirname, '../insertTodayGoldPrice.js');

function runGoldUpdateScript() {
    console.log('⏳ Đang chạy cập nhật giá vàng...');
    exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error('❌ Lỗi khi chạy script:', error.message);
            return;
        }
        if (stderr) console.error('⚠️ stderr:', stderr);
        console.log('✅ Cập nhật xong:\n', stdout);
    });
}

runGoldUpdateScript();

cron.schedule('*/5 * * * *', runGoldUpdateScript);
