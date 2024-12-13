const express = require('express');
const { verifyAccessToken } = require('../middleware/authMiddleware.js');
const { findUserById, getUsers } = require('../services/user.service.js');

const router = express.Router();

router.get('/me', verifyAccessToken, (req, res) => {
  res.json(req.user);
});

router.get('/list', async (req, res) => {
  const users = await getUsers();

  res.json(users);
});

router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  const user = await findUserById(userId);

  res.json(user);
});

module.exports = router;
