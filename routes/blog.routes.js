const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');

router.get('/api/blogs', blogController.getAll);
router.post('/api/blogs', blogController.createBlog);
router.delete('/api/blogs/:id', blogController.deleteBlog);
router.put('/api/blogs/:id', blogController.updateBlog);

module.exports = router;