var _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  var totalLikes = blogs.reduce((sum, order) => {
    return sum + order.likes;
  }, 0);

  return totalLikes;
};

const favoriteBlog = (blogs) => {
  var maxValue = Math.max.apply(
    null, blogs.map(blog => blog.likes)
  );

  var favoriteBlog = blogs.find(blog => blog.likes === maxValue);

  return {
    'title': favoriteBlog.title,
    'author': favoriteBlog.author,
    'likes': favoriteBlog.likes
  };
};

const mostBlogs = (blogs) => {
  // create a list that has author name and number of blogs created by that author
  const blogsPerAuthor =
    _(blogs).groupBy(blog => blog.author)
      .map((value, key) => ({ author: key, blogQty: value.length }))
      .value();
  // get the biggest number of blogs by any author
  const biggestBlogQty = Math.max.apply(
    null, blogsPerAuthor.map(authorData => authorData.blogQty)
  );
  // find the data of the author with most blogs
  return blogsPerAuthor.find(authorData => authorData.blogQty === biggestBlogQty);
};

const mostLikes = (blogs) => {
  // create a list that has author name and number of blogs created by that author
  const blogsPerAuthor =
   _(blogs).groupBy(blog => blog.author)
     .map((value, key) => ({ author: key, bloqs: value }))
     .value();

  // create a list of authors and times their blogs have been liked
  const likesPerAuthor = blogsPerAuthor.map(authorData => {
    const likes = authorData.bloqs.reduce((sum, blog) => {
      return sum + blog.likes;
    }, 0);

    return { author: authorData.author, likes: likes };
  });

  // get the biggets quantity of likes
  const biggestNbrOfLikes = Math.max.apply(null, likesPerAuthor.map(authorData => authorData.likes));

  // find the most liked author
  return likesPerAuthor.find(authorData => authorData.likes === biggestNbrOfLikes);
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};