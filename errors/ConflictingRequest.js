const httpConstants = require('http2').constants;

class ConflictingRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpConstants.HTTP_STATUS_CONFLICT;
    this.name = 'ConflictingRequest';
  }
}

module.exports = ConflictingRequest;
