const mongoose = require('mongoose');
const MONGO_CONNECTION_STRING =
  'mongodb+srv://admin:18Wz6i7x3MXyW7Yr@cluster0.zpqmd.mongodb.net/atrashevsky?retryWrites=true&w=majority';

const connectDb = () => {
  mongoose.connect(MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('db connect');
};

module.exports = { connectDb };
