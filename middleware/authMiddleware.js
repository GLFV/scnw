const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is required' });
  }
  try {
    const user = jwt.verify(refreshToken, process.env.JWT_REFRESH);

    req.user = user;
    next();
  } catch (err) {
    return { error: 'Invalid refresh token' };
  }
};

module.exports = { authenticateUser };
