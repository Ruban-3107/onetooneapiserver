const Tags = require('./tags.model');
const getMongoDBID = require('../helpers/mongoDBUtils');


/**
 * Load Tags and append to req.
 */
 function load(req, res, next, id) {
  Tags.get(id)
    .then((tags) => {
      req.tags = tags; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get Tags
 * @returns {tags}
 */
function get(req, res) {
  return res.json(req.tags);
}

/**
 * Create new Tags
 * @property {string} req.body.name - The name of tag
 * @property {string} req.body.category - The category of the tag
 * @property {string} req.body.sub_category - The sub_category of the tag
 * @property {string} req.body.count - The count of tags
 * @returns {}
 */
function create(req, res, next) {
  const tags = new Tags({
    name: req.body.name,
    category: req.body.category,
    sub_category: req.body.sub_category,
    count: req.body.count,
    created_date: req.body.created_date,
    last_updated: req.body.last_updated
  });

  tags.save()
    .then(savedtags => res.json(savedtags))
    .catch(e => next(e));
}

/**
 * Get Tags list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 15, skip = 0 } = req.query;
  Tags.list({ limit, skip })
    .then(tags => res.json(tags))
    .catch(e => next(e));
}
function search(req,res,next){
  console.log("request.....");
  console.log(req.params);
  Tags.search(req.params)
    .then(tags => res.json(tags))
.catch(e => next(e));
}


module.exports = { load, get, create,  list,search  };
