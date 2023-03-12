/** @format */

const nodemailer = require('nodemailer')

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTPHOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  return transporter.sendMail({
    from: '"ITC" <info@saferoad.com.sa>', // sender address
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  })
}

module.exports = sendEmail
