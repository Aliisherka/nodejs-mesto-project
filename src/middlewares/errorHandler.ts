import { NextFunction, Request, Response } from 'express';

const ERROR_CODE = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

interface IError {
  name: string;
  message: string;
  code: number;
}

// eslint-disable-next-line no-unused-vars
const errorHandler = (err: IError, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'NotFoundError') return res.status(NOT_FOUND).send({ message: err.message });
  if (err.name === 'CastError') return res.status(ERROR_CODE).send({ message: err.message });
  if (err.name === 'ValidationError') return res.status(ERROR_CODE).send({ message: err.message });
  if (err.name === 'UnauthorizedError') return res.status(UNAUTHORIZED).send({ message: err.message });
  if (err.name === 'ForbiddenError') return res.status(FORBIDDEN).send({ message: err.message });

  if (err.code === 11000) return res.status(409).send({ message: 'The user already exist' });

  return res.status(SERVER_ERROR).send({ message: 'An error occurred on the server' });
};

export default errorHandler;
