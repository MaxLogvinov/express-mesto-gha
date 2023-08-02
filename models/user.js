/* eslint-disable  */
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');
const AuthorizationError = require('../errors/AuthorizationError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (data) => validator.isURL(data),
      message: 'Ошибка при передаче аватара пользователя',
    },
  },
  email: {
    type: String,
    required: true,

    validate: {
      validator: (data) => validator.isEmail(data),
      message: 'Почта или пароль пользователя введены неверно',
    },
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});
// eslint-disable-next-line
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorizationError(
          'Почта или пароль пользователя введены неверно'
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new AuthorizationError(
            'Почта или пароль пользователя введены неверно'
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
