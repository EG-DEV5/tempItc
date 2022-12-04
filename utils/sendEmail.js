/** @format */

const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'golda.bogisich54@ethereal.email',
    pass: 'Hk4apvyRUVYR1asTK5',
  },});

  return transporter.sendMail({
    from: '"forever" <egypt.team.dev12@gmail.com>', // sender address
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
