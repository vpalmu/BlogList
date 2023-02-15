const User = require('../model/user');

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(u => u.toJSON());
};

const getRootUser = async () => {
  const root = await User.findOne({ username: 'root' });
  return root;
};

module.exports = {
  usersInDb,
  getRootUser
};