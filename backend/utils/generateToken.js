// backend/utils/generateToken.js

const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'SECRET_KEY';

  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role
    },
    secret,
    { expiresIn: '1d' }
  );
};

module.exports = generateToken;
