const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { MONGODB_URI } = require('../utils/config');

const mongoUrl = MONGODB_URI;
mongoose.set('strictQuery', false);
logger.info('connecting to', MONGODB_URI);

mongoose.connect(mongoUrl)
  .then(_ => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.info('error connecting to MongoDB:', error.message);
  });

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
});

module.exports = mongoose.model('Blog', blogSchema);