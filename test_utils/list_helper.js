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
  var maxValue = Math.max.apply(null, blogs.map(blog => blog.likes));

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
      .map((value, key) => ({ author: key, bloqQty: value.length }))
      .value();
  // get the biggest number of blogs by any author
  const biggestBlogQty = Math.max.apply(null, blogsPerAuthor.map(authorData => authorData.bloqQty));
  // find the data of the author with most blogs 
  return blogsPerAuthor.find(authorData => authorData.bloqQty === biggestBlogQty);
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
};