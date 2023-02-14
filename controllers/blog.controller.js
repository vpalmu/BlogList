const Blog = require('../model/blog');
const logger = require('../utils/logger');

async function getAll(request, response, next) {
  try {
    const blogs = await Blog.find({});
    response.json(blogs);
  } catch (error) {
    logger.error('`Error while getting info', error.message);
    next(error);
  }
}

async function createBlogPost(request, response, next) {
  try {
    if (request.body.title === undefined) {
      response.statusMessage = 'Title missing';
      return response.status(400).end();
    }

    if (request.body.url === undefined) {
      response.statusMessage = 'Url missing';
      return response.status(400).end();
    }

    const postLikes = request.body.likes === undefined
      ? 0
      : request.body.likes;

    const blog = new Blog({
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: postLikes
    });

    const newBlog = await blog.save();
    response.status(201).json(newBlog);
  }
  catch (error) {
    logger.error('`Error while creating blog post', error.message);
    next(error);
  }
}

module.exports = {
  getAll,
  createBlogPost
};