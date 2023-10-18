const NpsFeedback = require('./nps.model');
const getMongoDBID = require('../helpers/mongoDBUtils');

/**
 * Create new NPS feedback against a userId
 * @property {string} req.body.userId - mongoid of the user
 * @property {number} req.body.intensity - intensity scale user selected
 * @property {array} req.body.userId - area_of_improval user selected
 * @property {array} req.body.userId - like_about_us user selected
 * @property {string} req.body.userId - additional_feedback of the user
 * @returns {Booking}
 */
function create(req, res, next) {
  const nps = new NpsFeedback({
    userId: getMongoDBID(req.body.userId),
    intensity: req.body.intensity,
    area_of_improval: req.body.area_of_improval,
    like_about_us: req.body.like_about_us,
    area_of_improval_feedback: req.body.area_of_improval_feedback,
    like_about_us_feedback: req.body.like_about_us_feedback
  });

  nps.save()
    .then(savedFeedback => res.json(savedFeedback))
.catch(e => next(e));
}

module.exports = {create};
