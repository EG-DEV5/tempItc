const otpGenerator = require('otp-generator');
module.exports.generateOTP = () => {
  const OTP = otpGenerator.generate(process.env.OTP_LENGTH, {upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets :false});
  return OTP;
};


