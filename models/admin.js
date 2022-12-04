/** @format */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    maxlength: 50,
    unique: true,
  },
  password: {
    type: String,
    minlength: 6,
  },
  role: {
    type: String,
    default: 'admin',
  },
  otp: String,
  image: {
    url: { type: String },
    public_id: { type: String },
  },
});

adminSchema.pre('save', async function () {
  // console.log(this.modifiedPaths());
  // console.log(this.isModified('name'));
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
adminSchema.methods.toJSON = function () {
  const data = this.toObject();
  delete data.password;
  return data;
};
adminSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('Admin', adminSchema);
