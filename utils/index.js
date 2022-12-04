/** @format */

const { createJWT, isTokenValid, attachCookiesToResponse } = require('./jwt');
const createTokenUser = require('./createTokenUser');
const checkPermissions = require('./checkPermissions');
const sendVerificationEmail = require('./sendVerficationEmail');
const sendResetPasswordEmail = require('./sendResetPasswordEmail');
const createHash = require('./createHash');
const {generateOTP} = require('./otpGenerator');
const {multer} = require('./multer');
const { extractUrl, envToInt } = require('./helpers');
module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
  sendVerificationEmail,
  sendResetPasswordEmail,
  createHash,
  generateOTP,
  multer,
  extractUrl,
  envToInt,
};
