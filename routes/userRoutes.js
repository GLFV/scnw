const express = require('express');
const { Prisma, PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('./Auth/tokens.js');

const saltRounds = 10;
const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
});

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const existingUser = await prisma.user.findUnique({
    where: { name: name, email: email },
  });

  if (existingUser) {
    return res.status(400).json('User already exist');
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  res.json(user);
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    return res.status(400).json('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    res.status(400).json('Incorrect password');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.json(accessToken);
});

router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
  });
  res.status(200).json('Logged out successfully');
});

module.exports = router;
