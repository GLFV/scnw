const express = require('express');
const dotenv = require('dotenv');
const UserRoutes = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { generateAccessToken } = require('./routes/Auth/tokens.js');

const app = express();

dotenv.config();

app.use(cookieParser());
app.use(express.json());
app.use('/user', UserRoutes);

app.get('/', (req, res) => {
  res.send('hello world');
});

app.post('/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  console.log(refreshToken);
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is required' });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = generateAccessToken({
      id: user.id,
      email: user.email,
    });

    res.json({ accessToken: newAccessToken });
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
