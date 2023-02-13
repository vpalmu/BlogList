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

// override 'toJSON' for schema
// - '_v' field is not retured
// - '_Id' is returned as 'id'
//
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Blog', blogSchema);