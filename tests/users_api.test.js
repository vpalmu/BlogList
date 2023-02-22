const bcrypt = require('bcrypt');
const app = require('../app');
const User = require('../model/user');
const helper = require('../test_utils/user.helper');
const supertest = require('supertest');

const api = supertest(app);

describe('user tests', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', name: 'Root Man', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'mrmagoo',
      name: 'Mr. Magoo',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails when username is missing', async () => {
    const newUser = {
      name: 'Test dude',
      password: 'secret',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const contents = response.body;

    expect(contents.error).toContain('User validation failed: username: Path `username` is required.');
  });

  test('creation fails when username too short', async () => {
    const newUser = {
      name: 'Test dude',
      username: 'oi',
      password: 'secret'
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const contents = response.body;

    expect(contents.error).toContain('User validation failed: username: Path `username` (`oi`) is shorter than the minimum allowed length (3).');
  });

  test('creation fails when name is missing', async () => {
    const newUser = {
      username: 'testdude',
      password: 'secret',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const contents = response.body;

    expect(contents.error).toContain('User validation failed: name: Path `name` is required.');
  });

  test('creation fails when name too short', async () => {
    const newUser = {
      name: 'oi',
      username: 'testdude',
      password: 'secret'
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const contents = response.body;

    expect(contents.error).toContain('User validation failed: name: Path `name` (`oi`) is shorter than the minimum allowed length (3).');
  });

  test('creation fails when password is too short', async () => {
    const newUser = {
      name: 'Test Dude',
      username: 'testdude',
      password: 'sc'
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const contents = response.body;

    expect(contents.error).toContain('password is too short.');
  });

  test('creation fails when pasword is missing', async () => {
    const newUser = {
      name: 'Test Dude',
      username: 'testdude'
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const contents = response.body;

    expect(contents.error).toContain('password is required.');
  });
});