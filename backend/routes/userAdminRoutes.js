const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ActionLog = require('../models/ActionLog');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');


router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, 'username email role isLocked createdAt').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch {
    res.status(500).json({ success: false, message: 'Không thể tải danh sách người dùng' });
  }
});

router.put('/users/:id/role', verifyToken, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    await User.findByIdAndUpdate(req.params.id, { role });

    await ActionLog.create({
      user: req.user?.username || 'admin',
      action: 'Cập nhật vai trò',
      detail: `Gán vai trò ${role} cho ID: ${req.params.id}`
    });

    res.json({ success: true, message: 'Cập nhật vai trò thành công' });
  } catch (err) {
    console.error('Lỗi cập nhật vai trò:', err);
    res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật vai trò' });
  }
});

router.delete('/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    await ActionLog.create({
      user: req.user?.username || 'admin',
      action: 'Xoá người dùng',
      detail: `Đã xoá tài khoản: ${deletedUser?.username || 'Không rõ'} (ID: ${req.params.id})`
    });

    res.json({ success: true, message: 'Đã xoá người dùng' });
  } catch (err) {
    console.error('Lỗi xoá người dùng:', err);
    res.status(500).json({ success: false, message: 'Không thể xoá người dùng' });
  }
});

router.put('/users/:id/lock', verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isLocked = !user.isLocked;
    await user.save();

    await ActionLog.create({
      user: req.user?.username || 'admin',
      action: user.isLocked ? 'Khoá tài khoản' : 'Mở khoá tài khoản',
      detail: `Tài khoản: ${user.username} (ID: ${user._id})`
    });

    res.json({ success: true, message: user.isLocked ? 'Đã khoá tài khoản' : 'Đã mở khoá tài khoản' });
  } catch (err) {
    console.error('Lỗi cập nhật khoá:', err);
    res.status(500).json({ success: false, message: 'Không thể cập nhật trạng thái khoá' });
  }
});

module.exports = router;
