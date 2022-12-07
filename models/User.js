/** @format */

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    maxlength: 50,
    unique: true,
  },
  password: {
    type: String,
    minlength: 6,
    default:null,  },
  role: {
    type: String,
    enum: ['safety-advisor', 'trainer','admin'],
    required : true,
    default: 'trainer',
  },
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
  custodyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
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
