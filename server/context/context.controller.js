const _context = require('./context.model');
const getMongoDBID = require('../helpers/mongoDBUtils');

/**
 * Load Context and append to req.
 */
 function load(req, res, next, id) {
  _context.get(id)
    .then((context) => {
      req.context = context; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get Context
 * @returns {context}
 */
function get(req, res) {
  return res.json(req.context);
}

/**
 * Create new Context
 * @property {string} req.body.context - The type of the context
 * @property {string} req.body.concern - The Id  of the concern
 * @returns {Booking}
 */
function create(req, res, next) {
  const context = new _context({
    contextName: req.body.contextName,
    contextId: req.body.contextId
  });

  context.save()
    .then(savedcontext => res.json(savedcontext))
    .catch(e => next(e));
}

/**
 * Get Context list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  _context.list({ limit, skip })
    .then(context => res.json(context))
    .catch(e => next(e));
}


module.exports = { load, get, create,  list };
