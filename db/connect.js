const mongoose = require('mongoose')
const { MongoClient } = require('mongodb')

const connectDB = (url) => {
  return mongoose
    .connect(url)
    .then(() => console.log('mongdb is connected'))
    .catch((error) => console.log(error.message))
}

const options = {
  connectTimeoutMS: 60000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
const uri = process.env.MONGO_LIVELOCS
const client = new MongoClient(uri, options)

async function connect() {
  await client.connect()
  console.log('Connected to MONGO_LIVELOCS ============>')
}

async function close() {
  await client.close()
  console.log('MongoDB MONGO_LIVELOCS closed===========>')
}

module.exports = {
  connectDB,
  client,
  connect,
  close,
}
