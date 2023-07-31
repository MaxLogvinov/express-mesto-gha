const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const AuthorizationError = require('../errors/AuthorizationError');
const BadRequestError = require('../errors/BadRequestError');
const httpConstants = require('http2').constants;
const mongoose = require('mongoose');
const { ValidationError, CastError } = mongoose.Error;

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) =>
      res.status(httpConstants.HTTP_STATUS_CREATED).send({ card })
    )
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError('Некорретные данные'));
      } else {
        next(err);
      }
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cardList) => res.status(httpConstants.HTTP_STATUS_OK).send(cardList))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Карточки нет в базе'))
    .then((card) => {
      if (card.owner == req.user._id) {
        return Card.findByIdAndRemove(req.params.cardId);
      }
      if (card.owner !== req.user._id) {
        throw new AuthorizationError('Недостаточно прав для удаления карточки');
      }
    })
    .then((card) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Некорретные данные'));
      } else {
        next(err);
      }
    });
};

const toggleLike = (req, res, next, effect) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { [effect]: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new NotFoundError('NotFound'))
    .then((card) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        return next(new BadRequestError('Некорретные данные карточки'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  toggleLike(req, res, next, '$addToSet');
};

const dislikeCard = (req, res, next) => {
  toggleLike(req, res, next, '$pull');
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
