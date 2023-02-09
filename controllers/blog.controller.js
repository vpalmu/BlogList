const Blog = require('../model/blog');
const logger = require('../utils/logger');

async function getAll(request, response, next) {
  try {
    Blog.find({}).then(blogs => {
      response.json(blogs);
    });
  } catch (error) {
    logger.error('`Error while getting info', error.message);
    next(error);
  }
}

async function createBlogPost(request, response, next) {
  try {
    const blog = new Blog(request.body);
    blog.save().then(result => {
      response.status(201).json(result);
    });
  } catch (error) {
    logger.error('`Error while creating blog post', error.message);
    next(error);
  }
}

module.exports = {
  getAll,
  createBlogPost
};