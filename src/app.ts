import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user';
import cardRouter from './routes/card';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
// eslint-disable-next-line import/named
import { requestLogger, errorLogger } from './middlewares/logger';
import { createUserValidation, loginValidation } from './middlewares/validations';
import errorHandler from './middlewares/errorHandler';

const helmet = require('helmet');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(cookieParser());
app.use(helmet());
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger);

app.post('/signin', loginValidation(), login);
app.post('/signup', createUserValidation(), createUser);

app.use(auth);

app.use('/cards', cardRouter);
app.use('/users', userRouter);
app.use('*', () => {
  throw new NotFoundError('The requested resource is not found');
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);
app.listen(PORT, () => {
  console.log('work!');
});
