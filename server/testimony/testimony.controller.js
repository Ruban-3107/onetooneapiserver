const Testimony = require('./testimony.model');

/**
 * Load testimony and append to req.
 */
function load(req, res, next, id) {
  Testimony.get(id)
    .then((testimony) => {
    req.testimony = testimony; // eslint-disable-line no-param-reassign
  return next();
})
.catch(e => next(e));
}

/**
 * Get Testimony
 * @returns {Testimony}
 */
function get(req, res) {
  return res.json(req.testimony);
}

/**
 * Create new testimony
 * @property {string} req.body.username - The name of the testimony
 * @property {string} req.body.type - The user_pic of the testimony
 * @property {string} req.body.type - The title of the testimony
 * @property {string} req.body.type - The content of the testimony
 * @returns {Testimony}
 */
function create(req, res, next) {
  const testimony = new Testimony({
    username: req.body.username,
    user_pic:req.body.user_pic,
    title: req.body.title,
    content:req.body.content
  });

  testimony.save()
    .then(savedtestimony => res.json(savedtestimony))
.catch(e => next(e));
}

/**
 * Get testimony list.
 * @property {number} req.query.skip - Number of testimonys to be skipped.
 * @property {number} req.query.limit - Limit number of testimonys to be returned.
 * @returns {Testimony[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Testimony.list({ limit, skip })
    .then(testimony => res.json(testimony))
.catch(e => next(e));
}

module.exports = { load, get, create, list };

