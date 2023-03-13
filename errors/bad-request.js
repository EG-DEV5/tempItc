const { StatusCodes } = require('http-status-codes')
const CustomAPIError = require('./custom-api')

class BadRequestError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode ? statusCode : StatusCodes.BAD_REQUEST
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = BadRequestError
