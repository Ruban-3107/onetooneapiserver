const Feedback = require('./feedback.model');
const getMongoDBID = require('../helpers/mongoDBUtils');


/**
 * Load Feedback and append to req.
 */
 function load(req, res, next, id) {
  Feedback.get(id)
    .then((feedback) => {
      req.feedback = feedback; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get Feedback
 * @returns {feedback}
 */
function get(req, res) {
  return res.json(req.feedback);
}

/**
 * Create new Feedback
 * @property {object} req.body.feedback - The feedback object.
 * @property {number} req.body.rating - The feedback rating.
 * @property {string} req.body.booking_objId - The booking Object Id.
 * @returns {feedback}
 */
function create(req, res, next) {
  const feedback = new Feedback({
    feedback: req.body.feedback,
    rating: req.body.rating,
    booking_objId: getMongoDBID(req.body.booking_objId)
  });

  feedback.save()
    .then(savedFeedback => res.json(savedFeedback))
    .catch(e => next(e));
}

/**
 * Get Feedback list.
 * @property {number} req.query.skip - Number of feedback to be skipped.
 * @property {number} req.query.limit - Limit number of feedback to be returned.
 * @returns {feedback[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Feedback.list({ limit, skip })
    .then(feedback => res.json(feedback))
    .catch(e => next(e));
}

module.exports = { load, get, create, list };
