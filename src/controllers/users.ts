/* eslint-disable no-shadow */
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      }).send({
        message: true,
      });
    })
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      const {
        name,
        about,
        avatar,
        email,
      } = user;
      res.status(201).send({
        data: {
          email,
          name,
          about,
          avatar,
        },
      });
    })
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

export const getUserInformation = (req: Request, res: Response, next: NextFunction) => User
  .findById(req.user._id)
  .then((user) => {
    res.send({ data: user });
  })
  .catch(next);

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('The requested user was not found');
      }

      if (!name && !about) {
        throw new ValidationError('Incorrect data transmitted');
      }

      res.send({ data: user });
    })
    .catch(next);
};

export const updateUserAvatar = (req: Request, res: Response, next: NextFunction) => {
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
