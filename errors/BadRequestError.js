const httpConstants = require('http2').constants;

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpConstants.HTTP_STATUS_BAD_REQUEST;
    this.name = 'BadRequestError';
  }
}

module.exports = BadRequestError;
