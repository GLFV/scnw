const express = require('express');

const {
  signUp,
  signIn,
  refreshTokens,
} = require('../services/auth.service.js');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  const result = await signUp({ name, email, password });

  if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  res.json(result);
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  const result = await signIn({ email, password });

  if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken: result.accessToken });
});

router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
  });
  res.status(200).json('Logged out successfully');
});

router.post('/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is required' });
  }

  const result = refreshTokens(refreshToken);

  if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  res.json(result);
});

module.exports = router;
