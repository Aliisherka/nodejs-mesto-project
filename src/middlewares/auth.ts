import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const UnauthorizedError = require('../errors/UnauthorizedError');

export default (req: any, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new UnauthorizedError('Authorization required');
  }

  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (e) {
    throw new UnauthorizedError('Authorization required');
  }

  req.user = payload;

  next();
};
