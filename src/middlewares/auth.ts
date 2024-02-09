import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const UnauthorizedError = require('../errors/UnauthorizedError');

export default (req: any, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Authorization required');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (e) {
    throw new UnauthorizedError('Authorization required');
  }

  req.user = payload;

  next();
};
