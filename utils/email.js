const sendEmail = require('./sendEmail')

const createEmail = async (options) => {
  const mailOptions = {
    to: options.email,
    subject: options.subject,
    text: options.message,
  }

  sendEmail(mailOptions)
}

module.exports = createEmail
