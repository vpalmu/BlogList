const express = require('express');
const blogRouter = express.Router();
const blogController = require('../controllers/blog.controller');
// blogs
blogRouter.get('/', blogController.getAll);
blogRouter.post('/', blogController.createBlog);
blogRouter.delete('/:id', blogController.deleteBlog);
blogRouter.put('/:id', blogController.updateBlog);

module.exports = blogRouter;