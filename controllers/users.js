const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const httpConstants = require('http2').constants;
const mongoose = require('mongoose');
const { ValidationError, CastError } = mongoose.Error;

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) =>
      res.status(httpConstants.HTTP_STATUS_CREATED).send({ data: user })
    )
    .catch((err) => {
      if (err instanceof ValidationError) {
        return res
          .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: err.message });
      }
      res
        .status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Произошла ошибка на сервере' });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(httpConstants.HTTP_STATUS_OK).send(users))
    .catch((err) => {
      res
        .status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Произошла ошибка на сервере' });
    });
};

const getUserId = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('NotFoundUser'))
    .then((user) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.message === 'NotFoundUser') {
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

const updateUser = (req, res, newUserData) => {
  const { name, about, avatar } = newUserData;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(user);
    })
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

const updateUserData = (req, res) => {
  const newUserData = {
    name: req.body.name,
    about: req.body.about,
  };
  updateUser(req, res, newUserData);
};

const updateUserAvatar = (req, res) => {
  const newUserData = {
    avatar: req.body.avatar,
  };
  updateUser(req, res, newUserData);
};

module.exports = {
  createUser,
  getUsers,
  getUserId,
  updateUserData,
  updateUserAvatar,
};
