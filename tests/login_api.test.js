const mongoose = require('mongoose');
const supertest = require('supertest');
const logger = require('../utils/logger');
const User = require('../model/user');
const bcrypt = require('bcrypt');
const app = require('../app');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  logger.info('db cleared');

  const passwordHash = await bcrypt.hash('sekret', 10);
  const user = new User({ username: 'root', name: 'Root Man', passwordHash });

  await user.save();

  logger.info('db initialized');
});

describe('login tests', () => {
  test('login as root', async () => {

    const loginData = {
      username: 'root',
      password: 'sekret'
    };

    const response = await api
      .post('/api/login')
      .send(loginData)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const content = response.body;
    expect(content.name).toBe('Root Man');
    expect(content.username).toBe('root');
    expect(content.token).toContain('eyJ');
  });

  test('login as root - wrong password', async () => {

    const loginData = {
      username: 'root',
      password: 'worng sekret'
    };

    const response = await api
      .post('/api/login')
      .send(loginData)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const content = response.body;
    expect(content.error).toContain('invalid username or password.');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});