const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ success: false, message: 'Không có token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SECRET_KEY');
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role || 'user'  
    };
    next();
  } catch (err) {
    res.status(403).json({ success: false, message: 'Token không hợp lệ' });
  }
};

module.exports = verifyToken;
