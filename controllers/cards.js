const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const httpConstants = require('http2').constants;
const mongoose = require('mongoose');
const { ValidationError, CastError } = mongoose.Error;

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) =>
      res.status(httpConstants.HTTP_STATUS_CREATED).send({ card })
    )
    .catch((err) => {
      if (err instanceof ValidationError) {
        return res
          .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: err.message });
      } else {
        res
          .status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cardList) => res.status(httpConstants.HTTP_STATUS_OK).send(cardList))
    .catch((err) =>
      res
        .status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Произошла ошибка на сервере' })
    );
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new NotFoundError('NotFound'))
    .then((card) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res
          .status(httpConstants.HTTP_STATUS_NOT_FOUND)
          .send({ message: err.message });
      }
      if (err instanceof CastError) {
        return res
          .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: err.message });
      } else {
        res
          .status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

const toggleLike = (req, res, effect) => {
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
      if (err.message === 'NotFound') {
        return res
          .status(httpConstants.HTTP_STATUS_NOT_FOUND)
          .send({ message: err.message });
      }
      if (err instanceof CastError) {
        return res
          .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: err.message });
      } else {
        res
          .status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

const likeCard = (req, res) => {
  toggleLike(req, res, '$addToSet');
};

const dislikeCard = (req, res) => {
  toggleLike(req, res, '$pull');
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
