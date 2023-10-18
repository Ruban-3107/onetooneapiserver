const Cutoff = require('./cutoffTime.model');
const getMongoDBID = require('../helpers/mongoDBUtils');


/**
 * Load Context and append to req.
 */
function load(req, res, next, id) {
  Cutoff.get(id)
    .then((time) => {
    req.time = time; // eslint-disable-line no-param-reassign
  return next();
})
.catch(e => next(e));
}

/**
 * Get CutttoffTime
 * @returns {company cutoff time object}
 */
function get(req, res) {
  return res.json(req.time);
}

/**
 * Create new Context
 * @property {string} req.body.context - The type of the context
 * @property {string} req.body.concern - The Id  of the concern
 * @returns {Booking}
 */
function create(req, res, next) {
  const cutoffTime = new Cutoff({
    cutoff_time: req.body.cutoff_time,
    company_id: getMongoDBID(req.body.company_id)
  });

  cutoffTime.save()
    .then(savedtime => res.json(savedtime))
.catch(e => next(e));
}

function getByDomain(req,res,next){
  Cutoff.getByDomain(req.params.id)
    .then((cutoff) => {
    return res.json(cutoff);
})
.catch(e => next(e));
}


/**
 * Get cutoff-time for all company list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Cutoff.list({ limit, skip })
    .then(cutoff => res.json(cutoff))
.catch(e => next(e));
}

module.exports = { load, get, create,  list , getByDomain};

