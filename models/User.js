/** @format */

const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    maxlength: 50,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error(
          '{"enMessage" : "please enter a correct email", "arMessage" :"خطا فى البريد الالكتروني"}'
        );
      }
    },
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isMobilePhone(value, ['ar-EG'])) {
        throw new Error(
          '{"enMessage" : "please enter a correct Phone number", "arMessage" :"خطأ فى رقم الهاتف"}'
        );
      }
    },
  },
  password: {
    type: String,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['safety-advisor', 'trainer'],
    required : true,
    default: 'trainer',
  },
  otp: String,
  vid: {
    type: Number,
  },
  location: {
    address: { type: String },
    lat: { type: String },
    long: { type: String },
  },
  idNumber: { type: String },
  IMEINumber: { type: String },
  itcCenter: {
    type: String,
    required: true,
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
  },
  image: {
    url: { type: String },
    public_id: { type: String },
  },
});


module.exports = mongoose.model('User', UserSchema);
