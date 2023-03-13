/** @format */

const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const {
  createTokenUser,
  extractUrl,
  createJWT,
  sendEmail,
} = require('../utils')

const addAdmin = async (req, res, next) => {
  try {
    const { username, password, email, phoneNumber } = req.body
    let image = {}
    const accountAlreadyExists = await User.findOne({
      username,
    })

    if (accountAlreadyExists) {
      throw new CustomError.BadRequestError(
        '{"enMessage" : "your username is already exists", "arMessage" :"اسم المستخدم موجود بالفعل"}'
      )
    }
    if (req.file) {
      image = await extractUrl(req.file)
    }
    await User.create({
      username,
      password,
      image: image,
      email,
      phoneNumber,
      role: 'admin',
    })
    res.status(StatusCodes.CREATED).json({
      msg: 'add admin successfully',
    })
  } catch (error) {
    next(error)
  }
}
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      throw new CustomError.BadRequestError(
        'Please provide username and password'
      )
    }
    const admin = await User.findOne({ username, role: 'admin' })
    const safety = await User.findOne({
      username: username,
      role: 'safety-advisor',
    })
    if (safety) {
      if (safety.password === null) {
        safety.password = password
        await safety.save()
      }
      const isPasswordCorrectforSaftey = await safety.comparePassword(password)
      if (!isPasswordCorrectforSaftey) {
        throw new CustomError.BadRequestError(
          '{"enMessage" : "Invalid Credentials", "arMessage" :"البيانات خاطئة"}'
        )
      }
      const tokenUser = createTokenUser(safety)
      const token = createJWT({ payload: tokenUser })
      res.status(StatusCodes.OK).json({ data: safety, token })
    } else if (admin) {
      const isPasswordCorrect = await admin.comparePassword(password)
      if (!isPasswordCorrect) {
        throw new CustomError.BadRequestError(
          '{"enMessage" : "Invalid Credentials", "arMessage" :"البيانات خاطئة"}'
        )
      }
      const tokenUser = createTokenUser(admin)
      const token = createJWT({ payload: tokenUser })
      res.status(StatusCodes.OK).json({ data: admin, token })
    } else {
      throw new CustomError.BadRequestError(
        '{"enMessage" : "Invalid Credentials", "arMessage" :"البيانات خاطئة"}'
      )
    }
  } catch (error) {
    next(error)
  }
}

const forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: 'user not found' })
  }

  const otp = user.createOTP()
  await user.save({ validateBeforeSave: true })

  const message = `Your OTP is ${otp}`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your OTP code (valid for 5 mins)',
      text: message,
    })
    res.status(200).json({
      status: 'success',
      message: 'OTP sent to email!',
    })
  } catch (error) {
    user.passwordResetExpires = undefined
    await user.save({ validateBeforeSave: false })

    return res
      .status(500)
      .json({ msg: 'There was an error sending the email. Try again later!' })
  }
}

const resetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({
      otp: req.params.otp,
      passwordResetExpires: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ msg: 'OTP is invalid or has expired' })
    }

    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetExpires = undefined
    user.otp = undefined
    await user.save()

    user.password = undefined

    const tokenUser = createTokenUser(user)
    const token = createJWT({ payload: tokenUser })

    res.status(201).json({
      token,
      data: {
        user,
      },
    })
  } catch (error) {
    return res.status(500).send({ error, msg: 'Something went wrong' })
  }
}

const updatePassword = async (req, res, next) => {
  try {
    const { passwordCurrent, passwordConfirm } = req.body

    const user = await User.findById(req.user.userId)

    if (!(await user.comparePassword(passwordCurrent))) {
      throw new CustomError.BadRequestError(
        '{"enMessage" : "Your current password is incorrect", "arMessage" :"كلمة السر غير صحيحه"}'
      )
    }

    if (!passwordCurrent || !passwordConfirm) {
      throw new CustomError.BadRequestError(
        '{"enMessage" : "All fields are required.", "arMessage" :"جميع الحقول مطلوبة"}',
        400
      )
    }

    if (!user) {
      throw new CustomError.BadRequestError(
        401,
        '{"enMessage" : "the user is unauthorized.", "arMessage" :"المستخدم غير مصرح به"}'
      )
    }

    user.password = req.body.passwordConfirm
    user.passwordConfirm = req.body.passwordConfirm
    await user.save()

    user.password = undefined

    const tokenUser = createTokenUser(user)
    const token = createJWT({ payload: tokenUser })

    res.status(200).json({
      token,
      data: {
        user,
      },
    })
  } catch (error) {
    return res.status(500).send({ error, msg: 'Something went wrong' })
  }
}

module.exports = {
  addAdmin,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
}
