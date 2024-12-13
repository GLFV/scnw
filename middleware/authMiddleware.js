const jwt = require('jsonwebtoken');

const verifyRefreshToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is required' });
  }
  jwt.verify(refreshToken, process.env.JWT_REFRESH, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    next();
  });
};

const verifyAccessToken = (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({ message: 'Access token is required' });
  }
  try {
    const user = jwt.verify(accessToken, process.env.JWT_SECRET);

    req.user = user;
    next();
  } catch (err) {
    return { error: 'Invalid access token' };
  }
};

module.exports = { verifyRefreshToken, verifyAccessToken };
