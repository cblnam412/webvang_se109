﻿const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Bạn không có quyền admin' });
  }
  next();
};

module.exports = isAdmin;
