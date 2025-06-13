const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

router.post('/register', verifyToken, isAdmin, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Thiếu username hoặc password' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username đã tồn tại' });
    }

    const newUser = new User({
      username,
      password,
      role: 'admin',
      name: 'Admin',
    });

    await newUser.save();
    return res.status(201).json({ success: true, message: 'Admin đã được tạo' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

module.exports = router;