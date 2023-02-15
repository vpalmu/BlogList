const User = require('../model/user');
const logger = require('../utils/logger');
const bcrypt = require('bcrypt');
const MIN_PSW_LENGTH = 3;

// eslint-disable-next-line no-unused-vars
const connect = require('../model/connectDb'); // 'connect' is used just to open connection with db

async function getAll(request, response, next) {
  try {
    const users = await User.find({}).populate('blogs');
    response.json(users);
  } catch (error) {
    logger.error('`Error while getting all users', error.message);
    next(error);
  }
}

async function createUser(request, response, next) {
  try {
    const { username, name, password } = request.body;
    if (!password) {
      return response.status(400).json({
        error:'password is required.'
      });
    }

    if (password.length < MIN_PSW_LENGTH) {
      return response.status(400).json({
        error: 'password is too short.'
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();
    response.status(201).json(savedUser);
  }
  catch (error) {
    logger.error('`Error while creating user', error.message);
    next(error);
  }
}

module.exports = {
  getAll,
  createUser
};