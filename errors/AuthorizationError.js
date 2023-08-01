const httpConstants = require('http2').constants;

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpConstants.HTTP_STATUS_UNAUTHORIZED;
    this.name = 'AuthorizationError';
    this.message = 'Ошибка авторизации';
  }
}

module.exports = AuthorizationError;
