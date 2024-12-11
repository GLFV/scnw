const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '60m',
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_REFRESH, {
    expiresIn: '30d',
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
