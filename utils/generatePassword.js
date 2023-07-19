const generator = require('generate-password')

module.exports.generatePassword = () => {
  let passwords = generator.generate({
    length: 12,
    uppercase: true,
    numbers: true,
    lowercase: true,
  })
  return passwords
}
