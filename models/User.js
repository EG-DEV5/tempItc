/** @format */

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const crypto = require('crypto')

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minlength: 3,
      maxlength: 50,
      unique: true,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: 6,
      default: null,
      // select: false,
    },
    passwordConfirm: {
      type: String,
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password
        },
        message: 'Passwords are not the same!',
      },
    },
    role: {
      type: String,
      enum: ['safety-advisor', 'trainer', 'admin'],
      required: true,
      default: 'trainer',
    },
    idNumber: {
      type: String,
    },
    vid: {
      type: Number,
      default: null,
    },
    location: {
      address: { type: String },
      lat: { type: String },
      long: { type: String },
    },
    SerialNumber: { type: String },
    isOnline: { type: Boolean, default: false },
    custodyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      default: null,
    },
    image: {
      url: { type: String },
      public_id: { type: String },
    },
    passwordChangedAt: Date,
    otp: String,
    passwordResetExpires: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 12)

  this.passwordConfirm = undefined
  next()
})

UserSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next()

  this.passwordChangedAt = Date.now() - 1000
  next()
})

UserSchema.methods.createOTP = function () {
  const otp = crypto.randomInt(100000, 999999).toString()

  this.passwordResetExpires = Date.now() + 5 * 60 * 1000
  this.otp = otp

  return otp
}

UserSchema.methods.toJSON = function () {
  const data = this.toObject()
  delete data.password
  return data
}

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password)
  return isMatch
}

UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    )

    return JWTTimestamp < changedTimestamp
  }

  // False means NOT changed
  return false
}

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex')

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  console.log({ resetToken }, this.passwordResetToken)

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000

  return resetToken
}

module.exports = mongoose.model('User', UserSchema)
