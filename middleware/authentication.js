/** @format */

const CustomError = require('../errors')
const { isTokenValid } = require('../utils/jwt')

const authenticateUser = async (req, res, next) => {
  let token
  // check header
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1]
  }
  if (!token) {
    throw new CustomError.UnauthenticatedError(
      '{"enMessage" : "Authentication invalid", "arMessage" :"المصادقة غير صالحة"}'
    )
  }
  try {
    const payload = isTokenValid(token)
    // Attach the user and his permissions to the req object
    req.user = {
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
      custodyId: payload.custodyId,
      token,
    }

    next()
  } catch (error) {
    throw new CustomError.UnauthenticatedError(
      '{"enMessage" : "Authentication invalid", "arMessage" :"المصادقة غير صالحة"}'
    )
  }
}

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        '{"enMessage" : "Unauthorized to access this route", "arMessage" :"غير مصرح لك لإستخدام هذه الصفحة"}'
      )
    }
    next()
  }
}

module.exports = { authenticateUser, authorizeRoles }
