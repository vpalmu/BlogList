const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');

router.get('/api/blogs', blogController.getAll);
router.post('/api/blogs', blogController.createBlogPost);

module.exports = router;