import { Request, Response, NextFunction } from 'express';
import User from '../models/user';

const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch(next);
};

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

export const getUser = (req: Request, res: Response, next: NextFunction) => User
  .findById(req.params.userId)
  .orFail(() => {
    throw new NotFoundError('The requested user was not found');
  })
  .then((user) => {
    res.send({ data: user });
  })
  .catch(next);

export const updateUser = (req: any, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('The requested user was not found');
      }

      if (!name || !about) {
        throw new ValidationError('Incorrect data transmitted');
      }

      res.send({ data: user });
    })
    .catch(next);
};

export const updateUserAvatar = (req: any, res: Response, next: NextFunction) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('The requested user was not found');
      }

      if (!avatar) {
        throw new ValidationError('Incorrect data transmitted');
      }

      res.send({ data: user });
    })
    .catch(next);
};
