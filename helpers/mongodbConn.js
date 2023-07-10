const mongoose = require('mongoose')

var configConnection = mongoose.createConnection(process.env.MONGO_URL)
if (configConnection.readyState == 1) console.log('mongodb connected, to Atlas')

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 60000, // 30 seconds
}

var stageDBConnection = mongoose.createConnection(
  process.env.MONGO_LIVELOCS,
  options
)
if (stageDBConnection.readyState == 1)
  console.log('mongodb connected, to StageDB')
stageDBConnection.on('error', (err) => {
  console.log('Error in StageDB connection: '.bgRed + err)
})
stageDBConnection.on('connected', () => {
  console.log('StageDB connected'.bgGreen)
})
stageDBConnection.on('disconnected', () => {
  console.log('StageDB disconnected '.bgYellow)
})
module.exports = {
  configConnection,
  stageDBConnection,
}
