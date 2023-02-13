const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../model/blog');
const logger = require('../utils/logger');
const listHelper = require('../test_utils/list_helper');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  logger.info('db cleared');

  for (let blog of listHelper.listWithManyBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
    logger.info('initial blog saved to db');
  }

  logger.info('db done');
});

describe('blog list tests', () => {
  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const contents = response.body.map(r => r.content);
    expect(contents).toHaveLength(6);

  }, 100000);
});
afterAll(async () => {
  await mongoose.connection.close();
});