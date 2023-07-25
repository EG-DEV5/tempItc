const mongoose = require('mongoose')

const configConnection = mongoose.createConnection(process.env.MONGO_URL)
configConnection.on('error', (err) => {
  console.log('Error in ITC_USERS_DB connection: '.bgRed , err)
})
configConnection.on('connected', () => {
  console.log('ITC_USERS_DB connected'.bgCyan)
})
configConnection.on('disconnected', () => {
  console.log('ITC_USERS_DB disconnected '.bgYellow)
})
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 60000, // 30 seconds
}

const stageDBConnection = mongoose.createConnection(process.env.MONGO_LIVELOCS, options)
if (stageDBConnection.readyState == 1) console.log('mongodb connected, to StageDB')
stageDBConnection.on('error', (err) => {
  console.log('Error in StageDB connection: '.bgRed , err)
})
stageDBConnection.on('connected', () => {
  console.log('StageDB connected'.bgGreen)
})
stageDBConnection.on('disconnected', () => {
  console.log('StageDB disconnected '.bgYellow)
})

const itcViolationDB = mongoose.createConnection(process.env.ITC_VIOLATION_DB, options)

itcViolationDB.on('error', (err) => {
  console.log('Error in ITC_VIOLATION_DB connection: '.bgRed , err)
})
itcViolationDB.on('connected', () => {
  console.log('ITC_VIOLATION_DB connected'.bgMagenta)
})
itcViolationDB.on('disconnected', () => {
  console.log('ITC_VIOLATION_DB disconnected '.bgBlue)
})

module.exports = {
  configConnection,
  stageDBConnection,
  itcViolationDB,
}
