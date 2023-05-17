const mongoose = require('mongoose')

var configConnection = mongoose.createConnection(process.env.MONGO_URL)
if (configConnection.readyState == 1) console.log('mongodb connected, to Atlas')

var stageDBConnection = mongoose.createConnection(process.env.MONGO_LIVELOCS)
if (stageDBConnection.readyState == 1)
  console.log('mongodb connected, to StageDB')
stageDBConnection.on('error', (err) => {
  console.log('Error in StageDB connection: ' + err)
})
stageDBConnection.on('connected', () => {
  console.log('StageDB connection: ')
})
stageDBConnection.on('disconnected', () => {
  console.log('StageDB disconnected ')
})
module.exports = {
  configConnection,
  stageDBConnection,
}
