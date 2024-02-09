import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user';
import cardRouter from './routes/card';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
// eslint-disable-next-line import/named
import { requestLogger, errorLogger } from './middlewares/logger';

const helmet = require('helmet');
const { errors, celebrate, Joi } = require('celebrate');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string(),
  }),
}), createUser);

app.use(auth);

app.use('/cards', cardRouter);
app.use('/users', userRouter);
app.use('*', () => {
  throw new NotFoundError('The requested resource is not found');
});

app.use(errorLogger);

app.use(errors());

const ERROR_CODE = 400;
const UNAUTHORIZED = 401;
const Forbidden = 403;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;
interface IError {
  name: string;
  message: string;
  code: number;
}

// eslint-disable-next-line no-unused-vars
app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'NotFoundError') return res.status(NOT_FOUND).send({ message: err.message });
  if (err.name === 'CastError') return res.status(ERROR_CODE).send({ message: err.message });
  if (err.name === 'ValidationError') return res.status(ERROR_CODE).send({ message: err.message });
  if (err.name === 'UnauthorizedError') return res.status(UNAUTHORIZED).send({ message: err.message });
  if (err.name === 'ForbiddenError') return res.status(Forbidden).send({ message: err.message });
  if (err.code === 11000) return res.status(409).send({ message: 'The user already exist' });

  return res.status(SERVER_ERROR).send({ message: 'An error occurred on the server' });
});
app.listen(PORT, () => {
  console.log('work!');
});
