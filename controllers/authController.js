const Admin = require('../models/admin');
const Token = require('../models/token');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
  attachCookiesToResponse,
  createTokenUser,
  extractUrl,
  createJWT
} = require('../utils');
const crypto = require('crypto');
const register = async (req, res, next) => {
    try {
      const {
        username,
        password,
      } = req.body;
      let image = {};
      const accountAlreadyExists = await Admin.findOne({
        username,
      });
      if (accountAlreadyExists) {
        throw new CustomError.BadRequestError(
          'your username is already exists'
        );
      }
      if (req.file) {
        image = await extractUrl(req.file);
      }
      const user = await Admin.create({
        username,
        password,
        image: image,
      });
      res.status(StatusCodes.CREATED).json({
        msg: 'add admin successfully',user
      });
    } catch (error) {
      next(error);
    }
  };
  

  
  const login = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        throw new CustomError.BadRequestError(
          'Please provide username and password'
        );
      }
      const user = await Admin.findOne({ username });
  
      if (!user) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
      }
      const isPasswordCorrect = await user.comparePassword(password);
  
      if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
      }
      const tokenUser = createTokenUser(user);
      // create refresh token
      let refreshToken = '';
      // check for existing token
      const existingToken = await Token.findOne({ user: user._id });
  
      if (existingToken) {
        const { isValid } = existingToken;
        if (!isValid) {
          throw new CustomError.UnauthenticatedError('Invalid Credentials');
        }
        refreshToken = existingToken.refreshToken;
        attachCookiesToResponse({ res, user: tokenUser, refreshToken });
        const token = createJWT({ payload: { user: tokenUser } })
        res.status(StatusCodes.OK).json({ user: tokenUser, user,token });
        return;
      }
      const token = createJWT({ payload: { user: tokenUser } })
  
      refreshToken = crypto.randomBytes(40).toString('hex');
      const userAgent = req.headers['user-agent'];
      const ip = req.ip;
      const userToken = { refreshToken, ip, userAgent, user: user._id };
  
      await Token.create(userToken);
  
      attachCookiesToResponse({ res, user: tokenUser, refreshToken });
      res.status(StatusCodes.OK).json({ user: tokenUser, user ,token});
    } catch (error) {
      next(error);
    }
  };
  const logout = async (req, res, next) => {
    try {
      await Token.findOneAndDelete({ user: req.user.userId });
  
      res.cookie('accessToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
      });
      res.cookie('refreshToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
      });
      res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
    } catch (error) {
      next(error);
    }
  };




  module.exports = {
    register,
    login,
    logout,
    verifyAccount,
    //   forgotPassword,
    //   resetPassword,
  };