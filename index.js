const express = require('express');
const dotenv = require('dotenv');
const AuthRouter = require('./routes/auth.js');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRoutes.js');

const app = express();

dotenv.config();

app.use(cookieParser());
app.use(express.json());
app.use('/auth', AuthRouter);
app.use('/user', userRouter);

app.get('/', (req, res) => {
  res.send('hello world');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
