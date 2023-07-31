const httpConstants = require('http2').constants;

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpConstants.HTTP_STATUS_FORBIDDEN;
    this.name = 'BadRequestError';
  }
}

module.exports = ForbiddenError;
