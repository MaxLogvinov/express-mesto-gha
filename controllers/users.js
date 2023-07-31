const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictingRequest = require('../errors/ConflictingRequest');
const httpConstants = require('http2').constants;
const mongoose = require('mongoose');
const { ValidationError, CastError } = mongoose.Error;
const { generateToken } = require('../utils/token');

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) =>
      res.status(httpConstants.HTTP_STATUS_CREATED).send({
        name: user.name,
        about: user.about,
        _id: user._id,
        avatar: user.avatar,
        email: user.email,
      })
    )
    .catch((err) => {
      if (err instanceof ValidationError) {
        return next(new BadRequestError('Некорретные данные'));
      }
      if (err.code === 11000) {
        return next(
          new ConflictingRequest(
            'Пользователь с данной почтой уже зарегестрирован'
          )
        );
      } else {
        next(err);
      }
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(httpConstants.HTTP_STATUS_OK).send(users))
    .catch(next);
};

const getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Пользователя с данным ID нет в базе'))
    .then((user) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Некорретные данные'));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next, newUserData) => {
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
        next(new BadRequestError('Некорретные данные'));
      } else {
        next(err);
      }
    });
};

const updateUserData = (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    about: req.body.about,
  };
  updateUser(req, res, next, newUserData);
};

const updateUserAvatar = (req, res, next) => {
  const newUserData = {
    avatar: req.body.avatar,
  };
  updateUser(req, res, next, newUserData);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = generateToken(user._id);
      res.cookie('jwt', token, {
        maxAge: 60480000,
        httpOnly: true,
      });
      res.send({ message: 'Авторизация успешна!' });
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError('Некорретные данные'));
      } else {
        next(err);
      }
    });
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Данного пользователя  нет в базе'))
    .then((user) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Некорретные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserId,
  updateUserData,
  updateUserAvatar,
  login,
  getUserInfo,
};
