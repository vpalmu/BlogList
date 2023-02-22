const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(u => u.toJSON());
};

const createRootUser = async () => {
  const passwordHash = await bcrypt.hash('sekret', 10);
  const user = new User({ username: 'root', name: 'Root Man', passwordHash });

  await user.save();
};

const getRootUser = async () => {
  const root = await User.findOne({ username: 'root' });
  return root;
};

const getTokenForRootUser = async () => {
  const rootUser = await getRootUser();
  const userForToken = {
    username: rootUser.username,
    id: rootUser._id,
  };

  const token = 'Bearer ' + jwt.sign(userForToken, process.env.SECRET);
  return token;
};

module.exports = {
  usersInDb,
  createRootUser,
  getRootUser,
  getTokenForRootUser
};