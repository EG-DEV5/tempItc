/** @format */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
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
    validate(value) {
      if (!validator.isMobilePhone(value, ['ar-EG'])) {
        throw new Error(
          '{"enMessage" : "please enter a correct Phone number", "arMessage" :"خطأ فى رقم الهاتف"}'
        );
      }
    },
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
  password: {
    type: String,
    minlength: 6,
    default: null,
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
});
UserSchema.pre('save', async function () {
  // console.log(this.modifiedPaths());
  // console.log(this.isModified('name'));
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
UserSchema.methods.toJSON = function () {
  const data = this.toObject();
  delete data.password;
  return data;
};
UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
