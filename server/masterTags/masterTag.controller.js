const Tags = require('./materTag.model');
const Blogs = require('../blog/blog.model');
const getMongoDBID = require('../helpers/mongoDBUtils');

function list(req, res, next) {
  Tags.list()
    .then((tags) => {
      if(tags){
        return res.json(tags);
      }
  })
  .catch(e => next(e));
}

function getByTags(req, res, next) {
  Blogs.groupByTags()
    .then((tags) =>{
      if(tags){
        return res.json(tags)
      }
    })
  .catch(e => next(e));
}

function curatedBlogs(req, res, next) {
  console.log("curatedBlogs",req.params.date);
  let date = req.params.date ;
  let condition = {$and :[{Date_for_publish: {'$lte': date}},{isCurated : true}]};
console.log("condition-->>>>",condition)
  Blogs.getBycondition(condition)
    .then((tags) =>{
    if(tags){
      return res.json(tags)
    }
  })
.catch(e => next(e));
}

module.exports = { list, getByTags ,curatedBlogs };
