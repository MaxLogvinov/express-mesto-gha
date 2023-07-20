const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');

const userRouter = require('./users');
const cardRouter = require('./cards');

router.use('/users', userRouter);

router.use('/cards', cardRouter);

// router.use('*', (req, res) => {
//   res.send(new Error({ message: err.message }));
// });

// const error = (req, res) => {
//   req.message ===
//     'NotFound'.catch((err) => {
//       if (err.message === 'NotFound') {
//         return res.status(404).send({ message: err.message });
//       } else {
//         res.status(500).send({ message: err.message });
//       }
//     });
// };

router.use('*', (req, res, next) => {
  next(new NotFoundError('Вы перешли по неккоректной ссылке'));
});

module.exports = router;
