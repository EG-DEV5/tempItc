/** @format */

const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { createTokenUser, extractUrl, createJWT } = require('../utils');
const addAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    let image = {};
    const accountAlreadyExists = await User.findOne({
      username,
    });

    if (accountAlreadyExists) {
      throw new CustomError.BadRequestError('your username is already exists');
    }
    if (req.file) {
      image = await extractUrl(req.file);
    }

     await User.create({
      username,
      password,
      image: image,
      role: 'admin',
    });
    
    res.status(StatusCodes.CREATED).json({
      msg: 'add admin successfully',
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
    const admin = await User.findOne({ username, role: 'admin' });
    const safety = await User.findOne({
      username: username,
      role: 'safety-advisor',
    });
    if (safety) {
      if (safety.password === null) {
        safety.password = password;
        await safety.save();
      }
      const isPasswordCorrectforSaftey = await safety.comparePassword(password);
      if (!isPasswordCorrectforSaftey) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
      }
      const tokenUser = createTokenUser(safety);
      const token = createJWT({ payload: tokenUser });
      res.status(StatusCodes.OK).json({ safety: tokenUser, safety, token });
    } else if (admin) {
      const isPasswordCorrect = await admin.comparePassword(password);
      if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
      }
      const tokenUser = createTokenUser(admin);
      const token = createJWT({ payload: tokenUser });
      res.status(StatusCodes.OK).json({ admin, token });
    } else {
      throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addAdmin,
  login,
  //   forgotPassword,
  //   resetPassword,
};
