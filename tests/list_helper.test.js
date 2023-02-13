const listHelper = require('../test_utils/list_helper');

describe('dummy tests', () => {
  const blogs = [];

  test('dummy returns one', () => {
    const result = listHelper.dummy(blogs);
    expect(result).toBe(1);
  });
});

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ];

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });

  test('of bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listHelper.listWithManyBlogs);
    expect(result).toBe(36);
  });
});

describe('favorite blog', () => {
  test('of list is found', () => {
    const result = listHelper.favoriteBlog(listHelper.listWithManyBlogs);

    expect(result.author).toBe('Edsger W. Dijkstra');
    expect(result.title).toBe('Canonical string reduction');
    expect(result.likes).toBe(12);
  });
});

describe('most blogs', () => {
  test('author with most blogs is found', () => {
    const result = listHelper.mostBlogs(listHelper.listWithManyBlogs);

    expect(result.author).toBe('Robert C. Martin');
    expect(result.blogQty).toBe(3);
  });
});

describe('most liked', () => {
  test('author with most likes is found', () => {
    const result = listHelper.mostLikes(listHelper.listWithManyBlogs);

    expect(result.author).toBe('Edsger W. Dijkstra');
    expect(result.likes).toBe(17);
  });
});