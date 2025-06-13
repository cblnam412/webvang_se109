const express = require('express');
const router = express.Router();
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, username, password } = req.body;

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại' });

    const user = new User({ name, email, phone, username, password });
    await user.save();

    const token = generateToken(user);
    res.json({ message: 'Đăng ký thành công', user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Sai tên đăng nhập hoặc mật khẩu' });
    }

    if (user.isLocked) {
      return res.status(403).json({ error: 'Tài khoản của bạn đã bị khoá. Vui lòng liên hệ quản trị viên.' });
    }

    const token = generateToken(user);
    res.json({ message: 'Đăng nhập thành công', user, token });
  } catch (err) {
    console.error('Lỗi đăng nhập:', err);
    res.status(500).json({ error: 'Lỗi server khi đăng nhập' });
  }
});


module.exports = router;
