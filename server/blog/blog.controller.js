const Blog = require('./blog.model');
const getMongoDBID = require('../helpers/mongoDBUtils');

function getViews(req, res, next) {
  Blog.getViewsByUserId(req.params.userId)
    .then((blogs) => {
    return res.json(blogs);
})
.catch(e => next(e));
}

function getPopularBlogs(req, res, next) {
  const condition = {'isPopular' : true};
  Blog.getBycondition(condition)
    .then((blogs) => {
    return res.json(blogs);
})
.catch(e => next(e));
}

function list(req, res, next) {
  Blog.list()
    .then((blogs) => {
    return res.json(blogs);
})
.catch(e => next(e));
}

function getByTags(req, res, next) {
  Blog.groupByTags()
    .then((blogs) => {
    return res.json(blogs);
})
.catch(e => next(e));
}

module.exports = { getViews , getPopularBlogs , list , getByTags };
