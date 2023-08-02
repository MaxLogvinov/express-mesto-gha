const { checkToken } = require('../utils/token');
const AuthorizationError = require('../errors/AuthorizationError');
// eslint-disable-next-line
const auth = (req, res, next) => {
  const userToken = req.cookies.jwt;

  const result = checkToken(userToken);
  if (!result) {
    return next(new AuthorizationError());
  }

  req.user = { _id: result.payload };
  next();
};

module.exports = { auth };
