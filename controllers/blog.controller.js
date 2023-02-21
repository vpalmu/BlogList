const Blog = require('../model/blog');
const logger = require('../utils/logger');
const utils = require('../utils/utils');

// eslint-disable-next-line no-unused-vars
const connect = require('../model/connectDb'); // 'connect' is used just to open connection with db

async function getAll(request, response, next) {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
    response.json(blogs);
  } catch (error) {
    logger.error('`Error while getting info', error.message);
    next(error);
  }
}

async function createBlog(request, response, next) {
  try {
    const user = request.user;

    if (!user) {
      response.statusMessage = 'User not found';
      return response.status(400).end();
    }

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
      likes: postLikes,
      user: user.id
    });

    const newBlog = await blog.save();         // save blog (with user id)

    user.blogs = user.blogs.concat(newBlog._id);  // make user to refer to new blob, use value from '_id' field instead of 'id'
    await user.save();                            // save the updated user data

    response.status(201).json(newBlog);
  }
  catch (error) {
    logger.error('`Error while creating blog post', error.message);
    next(error);
  }
}

async function deleteBlog(request, response, next) {
  try {
    logger.info('request.params.id', request.params.id);
    const result = await Blog.findByIdAndRemove(request.params.id);

    if (result) {
      logger.info('blog was deleted');
      return response.status(204).end();
    }

    logger.info(`blog not found, id: ${request.params.id}`);
    response.statusMessage = 'blog doesn\'t exist';
    return response.status(404).end();  // resource not found
  }
  catch (err) {
    logger.error('Error while deleting person', err.message);
    next(err);
  }
}

async function updateBlog(request, response, next) {
  try {
    // data is expected to be in JSON format, must set 'Content-Type=application/json' in PostMan 'Headers'
    const body = request.body;

    if (utils.isEmptyObject(body)) {
      return response.status(400).json({ error: 'content missing' });
    }

    const personToUpdate = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    };

    const result = await Blog.findByIdAndUpdate(request.params.id, personToUpdate, { new: true });

    if (result) {
      logger.info('update result:', result);
      return response.json(result);
    }

    logger.info(`blog not found, id: ${request.params.id}`);
    response.statusMessage = 'blog doesn\'t exist';
    return response.status(404).end();  // resource not found
  }
  catch (err) {
    logger.error('`Error while updating blog', err.message);
    next(err);
  }
}

module.exports = {
  getAll,
  createBlog,
  deleteBlog,
  updateBlog
};