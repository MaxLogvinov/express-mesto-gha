const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRouter = require('./users');
const cardRouter = require('./cards');
const { login, createUser } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const regex = require('../utils/regex');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(regex),
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser
);
router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(3),
    }),
  }),
  login
);

router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);
// eslint-disable-next-line
router.use('*', (req, res) => {
  throw new NotFoundError('Данной страницы не существует');
});

module.exports = router;
