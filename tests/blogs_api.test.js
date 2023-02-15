const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../model/blog');
const logger = require('../utils/logger');
const listHelper = require('../test_utils/list_helper');
const userHelper = require('../test_utils/user.helper');

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

    const rootUser = await userHelper.getRootUser();
    const newBlog = {
      title: 'Perfect Title',
      author: 'VMP',
      url: '',
      likes: 99,
      userId: rootUser.id
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
    const rootUser = await userHelper.getRootUser();
    const newBlogNoLikes = {
      title: 'New Title, no likes',
      author: 'VMP',
      url: '',
      userId: rootUser.id
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
    const rootUser = await userHelper.getRootUser();

    const newBlogNoLikes = {
      author: 'VMP',
      url: '',
      likes: 65,
      userId: rootUser.id
    };

    await api
      .post('/api/blogs')
      .send(newBlogNoLikes)
      .expect(400);
  });

  test('missing URL property throws bad request', async () => {
    const rootUser = await userHelper.getRootUser();

    const newBlogs = {
      title: 'New Title, no URL',
      author: 'VMP',
      likes: 65,
      userId: rootUser.id
    };

    await api
      .post('/api/blogs')
      .send(newBlogs)
      .expect(400);
  });

  test('invalid user Id throws bad request', async () => {
    const newBlogs = {
      title: 'New Title',
      author: 'VMP',
      likes: 65,
      url: '',
      userId: '63ecebfc379bd9c2801d2eb6'
    };

    await api
      .post('/api/blogs')
      .send(newBlogs)
      .expect(400);
  });
});

describe('blog delete tests', () => {
  test('blog is deleted', async () => {
    const id = '5a422a851b54a676234d17f7'; // React Patterns, Michael Chan

    await api
      .delete(`/api/blogs/${id}`)
      .expect(204);
  });

  test('blog is not deleted - id doesnt exist', async () => {
    const id = '4a422a851b54a676234d17f7';

    await api
      .delete(`/api/blogs/${id}`)
      .expect(404);
  });

});

describe('blog update tests', () => {
  test('blog is updated', async () => {
    const id = '5a422a851b54a676234d17f7'; // React Patterns, Michael Chan

    const blogToUpdate = {
      title: 'React Patterns (updated)',
      author: 'Michael Chan (updated)',
      url: 'updated url',
      likes: 9090
    };

    await api
      .put(`/api/blogs/${id}`)
      .send(blogToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('blog is not updated - id doesnt exist', async () => {
    const id = '6a422a851b54a676234d17f9';

    const blogToUpdate = {
      title: 'React Patterns (updated)',
      author: 'Michael Chan (updated)',
      url: 'updated url',
      likes: 9090
    };

    await api
      .put(`/api/blogs/${id}`)
      .send(blogToUpdate)
      .expect(404);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});