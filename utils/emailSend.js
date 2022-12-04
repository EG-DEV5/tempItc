/** @format */

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (username, type, email, otp) => {
  const msg = {
    to: email,
    from: {
      email: 'egypt.team.dev6@gmail.com',
      name: 'Dispatch',
    },
    subject: 'Verify Your Account',
    text:
      type == 'register'
        ? 'please verify your account'
        : 'Reset Password verification Code',
    html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Dispatch</a>
          </div>
          <p style="font-size:1.1em">Hi,${username}</p>
          <p>Thank you for choosing dispatch. Use the following OTP to ${
            type == 'register'
              ? 'complete your Sign Up procedures'
              : 'Reset Your Password'
          }. </p>
          <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
          <p style="font-size:0.9em;">Regards,<br />Dispatch</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>Dispatch</p>
          </div>
        </div>
      </div>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      return true;
    })
    .catch((error) => {
      return false;
    });
};

module.exports = { sendEmail };
