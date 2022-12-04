const sendEmail = require('./sendEmail');

const sendVerificationEmail = async ({
  name,
  email,
  otp,
}) => {

  const message = `
  <div
    class="container"
    style="max-width: 90%; margin: auto; padding-top: 20px"
  >
    <h2>Welcome to Forever.</h2>
    <h4>You are officially In ✔</h4>
    <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
    <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${otp}</h1>
</div>
`;

  return sendEmail({
    to: email,
    subject: 'Email Confirmation',
    html: `<h4> Hello, ${name}</h4>
    ${message}
    `,
  });
};

module.exports = sendVerificationEmail;
