const mongoose = require('mongoose');

const connectDB = (url) => {
  return mongoose
  .connect(url)
  .then(() => console.log("mongdb is connected"))
  .catch((error) => console.log(error.message));
};

module.exports = connectDB;
