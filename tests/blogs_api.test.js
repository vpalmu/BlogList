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
  }

  logger.info('db initialized');
});

describe('blog list tests', () => {
  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const contents = response.body;
    expect(contents).toHaveLength(6);

  });

  test('each blog has id property', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const contents = response.body;

    for (let blog of contents) {
      expect(blog.id).toBeDefined();
    }
  }, 100000);
});

describe('blog post tests', () => {
  test('new blog is added', async () => {

    const newBlog = {
      title: 'Perfect Title',
      author: 'VMP',
      url: '',
      likes: 99
    };

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const contents = response.body;

    expect(contents.author).toBe('VMP');
    expect(contents.id).toBeDefined();
  });

  test('missing likes property defaults to zero', async () => {

    const newBlogNoLikes = {
      title: 'New Title, no likes',
      author: 'VMP',
      url: ''
    };

    const response = await api
      .post('/api/blogs')
      .send(newBlogNoLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const contents = response.body;

    expect(contents.likes).toBeDefined();
    expect(contents.likes).toBe(0);
  });

  test('missing title property throws bad request', async () => {

    const newBlogNoLikes = {
      author: 'VMP',
      url: '',
      likes: 65
    };

    await api
      .post('/api/blogs')
      .send(newBlogNoLikes)
      .expect(400);
  });

  test('missing URL property throws bad request', async () => {

    const newBlogs = {
      title: 'New Title, no URL',
      author: 'VMP',
      likes: 65
    };

    await api
      .post('/api/blogs')
      .send(newBlogs)
      .expect(400);
  });
});

describe('blog delete tests', () => {
  test('blog is deleted', async () => {

    const newBlog = {
      title: 'Perfect Title',
      author: 'VMP',
      url: '',
      likes: 99
    };

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const contents = response.body;

    expect(contents.author).toBe('VMP');
    expect(contents.id).toBeDefined();
  });

});

afterAll(async () => {
  await mongoose.connection.close();
});