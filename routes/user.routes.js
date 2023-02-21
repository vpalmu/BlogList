const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user.controller');
// users
userRouter.get('/', userController.getAll);
userRouter.post('/', userController.createUser);

module.exports = userRouter;