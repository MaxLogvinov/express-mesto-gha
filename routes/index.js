const router = require('express').Router();
const httpConstants = require('http2').constants;
const userRouter = require('./users');
const cardRouter = require('./cards');

router.use('/users', userRouter);

router.use('/cards', cardRouter);

router.use('*', (req, res) => {
  res
    .status(httpConstants.HTTP_STATUS_NOT_FOUND)
    .json({ message: 'Страница не найдена' });
});

module.exports = router;
