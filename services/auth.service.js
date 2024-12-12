const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { findUser, userCreate } = require('../repository/user.repository.js');

const saltRounds = 10;

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

const signUp = async (userData) => {
  const { name, email, password } = userData;

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const existingUser = await findUser({ email, name }, 'OR');

  if (existingUser) {
    return { error: 'User already exist' };
  }

  const user = await userCreate({ name, email, password: hashedPassword });

  return user;
};

const signIn = async (userData) => {
  const { email, password } = userData;

  const user = await findUser({ email }, 'OR');

  if (!user) {
    return { error: 'User not found' };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return { error: 'Incorrect password' };
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { accessToken, refreshToken };
};

const refreshTokens = (refreshToken) => {
  try {
    const user = jwt.verify(refreshToken, process.env.JWT_REFRESH);
    const newAccessToken = generateAccessToken(user);

    return { accessToken: newAccessToken };
  } catch (err) {
    return { error: 'Invalid refresh token' };
  }
};

module.exports = { signUp, signIn, refreshTokens };
