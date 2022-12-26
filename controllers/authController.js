/** @format */

const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { createTokenUser, extractUrl, createJWT } = require('../utils');
const addAdmin = async (req, res, next) => {
  try {
    const { username, password,email,phoneNumber } = req.body;
    let image = {};
    const accountAlreadyExists = await User.findOne({
      username,
    });

    if (accountAlreadyExists) {
      throw new CustomError.BadRequestError(
        '{"enMessage" : "your username is already exists", "arMessage" :"اسم المستخدم موجود بالفعل"}'
      );
    }
    if (req.file) {
      image = await extractUrl(req.file);
    }
    await User.create({
      username,
      password,
      image: image,
      email,
      phoneNumber,
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
        throw new CustomError.BadRequestError(
          '{"enMessage" : "Invalid Credentials", "arMessage" :"البيانات خاطئة"}'
        );
      }
      const tokenUser = createTokenUser(safety);
      const token = createJWT({ payload: tokenUser });
      res.status(StatusCodes.OK).json({ data: safety, token });
    } else if (admin) {
      const isPasswordCorrect = await admin.comparePassword(password);
      if (!isPasswordCorrect) {
        throw new CustomError.BadRequestError(
          '{"enMessage" : "Invalid Credentials", "arMessage" :"البيانات خاطئة"}'
        );
      }
      const tokenUser = createTokenUser(admin);
      const token = createJWT({ payload: tokenUser });
      res.status(StatusCodes.OK).json({ data: admin, token });
    } else {
      throw new CustomError.BadRequestError(
        '{"enMessage" : "Invalid Credentials", "arMessage" :"البيانات خاطئة"}'
      );
    }
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;
  if (!username || !oldPassword || !newPassword) {
    throw new CustomError.BadRequestError('{"enMessage" : "Please provide all values", "arMessage" :"برحاء إدخال كل البيانات"}');
  }

  const user = await User.findOne({ username });

  if (user) {
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
      throw new CustomError.BadRequestError(
        '{"enMessage" : "Invalid Credentials", "arMessage" :"البيانات خاطئة"}'
      );
    }
      user.password = newPassword;
      await user.save();
    }
    else{
      throw new CustomError.BadRequestError(
        '{"enMessage" : "Invalid username", "arMessage" :"البيانات خاطئة"}'
      );
    }
  res.send('reset password');
};

module.exports = {
  addAdmin,
  login,
  //   forgotPassword,
     resetPassword,
};
