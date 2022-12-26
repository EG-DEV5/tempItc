/** @format */

const sendEmail = require('./sendEmail');

const sendPassword = async ({ name, email, password }) => {
  const message = `
  <div
    class="container"
    style="max-width: 90%; margin: auto; padding-top: 20px"
  >
    <h2>Welcome to ITC.</h2>
    <h4>You are officially In ✔</h4>
    <p style="margin-bottom: 30px;">Your password account is </p>
    <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${password}</h1>
    <p style="margin-bottom: 30px;">Your username  is </p>
    <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${name}</h1>
</div>
`;

  return sendEmail({
    to: email,
    subject: 'Password Account',
    html: `<h4> Hello, ${name}</h4>
    ${message}
    `,
  });
};

module.exports = sendPassword;
