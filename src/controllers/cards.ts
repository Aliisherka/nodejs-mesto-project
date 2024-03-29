import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';

const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch(next);
};

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .populate('owner')
  .then((cards) => res.send({ data: cards }))
  .catch(next);

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('The requested card was not found');
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Not allowed');
      }
    })
    .then(() => Card
      .findByIdAndRemove(req.params.cardId)
      .then((card) => res.send({ data: card })))
    .catch(next);
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const likes = req.user._id;
  return Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('The requested card was not found');
      }

      if (!likes) {
        throw new ValidationError('Incorrect data transmitted');
      }

      res.send({ data: card });
    })
    .catch(next);
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  const likes = req.user._id;
  return Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('The requested card was not found');
      }

      if (!likes) {
        throw new ValidationError('Incorrect data transmitted');
      }

      res.send({ data: card });
    })
    .catch(next);
};
