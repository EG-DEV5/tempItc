const { StatusCodes } = require('http-status-codes')

class BadRequestError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode ?? StatusCodes.BAD_REQUEST
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = BadRequestError
