const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogPosts) => {
  var totalLikes = blogPosts.reduce((sum, order) => {
    return sum + order.likes;
  }, 0);

  return totalLikes;
};

const favoriteBlog = (blogPosts) => {
  var maxValue = Math.max.apply(null, blogPosts.map(post => post.likes));

  var post = blogPosts.find(post => post.likes === maxValue);

  return {
    'title': post.title,
    'author': post.author,
    'likes': post.likes
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
};