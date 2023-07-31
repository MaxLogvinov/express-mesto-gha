const router = require('express').Router();
const {
  getUsers,
  getUserId,
  updateUserData,
  updateUserAvatar,
  getUserInfo,
} = require('../controllers/users');
const { celebrate, Joi } = require('celebrate');
const regex = require('../utils/regex');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUserData
);
router.get(
  '/:userId',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  getUserId
);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(regex),
    }),
  }),
  updateUserAvatar
);

module.exports = router;
