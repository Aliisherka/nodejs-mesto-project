import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user';
import cardRouter from './routes/card';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req: any, res: Response, next: NextFunction) => {
  req.user = {
    _id: '65b8fc5798a2394822989b46'
  };

  next();
});

app.use('/cards', cardRouter);
app.use('/users', userRouter);

const ERROR_CODE = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;
app.use((err: { name: string; message: string; }, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'NotFoundError') return res.status(NOT_FOUND).send({ message: err.message})
  if (err.name === 'CastError') return res.status(ERROR_CODE).send({ message: err.message})
  if (err.name === 'ValidationError') return res.status(ERROR_CODE).send({ message: err.message})

  res.status(SERVER_ERROR).send({ message: 'An error occurred on the server' });
});
app.listen(PORT, () => {
  console.log('work!')
})