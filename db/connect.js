const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

const connectDB = (url) => {
  return mongoose
  .connect(url)
  .then(() => console.log("mongdb is connected"))
  .catch((error) => console.log(error.message));
};


const connectDBLive = async (url) => {
  const client = new MongoClient(url);
  await client.connect().then(console.log("MongoDB live locations connected"));
  return client.db("StageDB").collection("LiveLocations")
};

module.exports = {
  connectDB,connectDBLive
};
