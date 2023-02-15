const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const userController = require('../controllers/user.controller');

// blogs
router.get('/api/blogs', blogController.getAll);
router.post('/api/blogs', blogController.createBlog);
router.delete('/api/blogs/:id', blogController.deleteBlog);
router.put('/api/blogs/:id', blogController.updateBlog);

// users
router.get('/api/users', userController.getAll);
router.post('/api/users', userController.createUser);

module.exports = router;