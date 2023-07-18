const router = require('express').Router();

const userRouter = require('./users');
const cardRouter = require('./cards');

router.use((req, res, next) => {
  req.user = {
    _id: '64b56f47d085893b755e4354', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

router.use('/users', userRouter);

router.use('/cards', cardRouter);

module.exports = router;
