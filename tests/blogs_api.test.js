const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

describe('blog list tests', () => {
  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const contents = response.body.map(r => r.content);
    expect(contents).toHaveLength(3);

  }, 100000);
});

afterAll(async () => {
  await mongoose.connection.close();
});