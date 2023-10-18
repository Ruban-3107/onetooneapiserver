const Feature = require('./feature.model');
const getMongoDBID = require('../helpers/mongoDBUtils');

/**
 * Load feature and append to req.
 */
function load(req, res, next, id) {
  Feature.get(id)
    .then((feature) => {
      req.feature = feature; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

// /**
//  * Get feature
//  * @returns {feature}
//  */
function get(req, res) {
  return res.json(req.feature);
}

/**
 * Create new feature
 * @property {string} req.body.featureName - feature name
 * @property {string} req.body.type - type of feature.
 * @property {string} req.body.featureId - unique id for the feature.
 * @property {string} req.body.img - img for the  feature.
 * @returns {feature}
 */
function create(req, res, next) {
  const feature = new Feature({
    featureName: req.body.featureName,
    type : req.body.type,
    featureId : req.body.featureId,
    img: req.body.img
  });
  feature.save()
    .then(savedFeature => res.json(savedFeature))
    .catch(e => next(e));
}

/**
 * Get feature list.
 * @property {number} req.query.skip - Number of features to be skipped.
 * @property {number} req.query.limit - Limit number of features to be returned.
 * @returns {feature[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Feature.list({ limit, skip })
    .then(features => res.json(features))
    .catch(e => next(e));
}


module.exports = { load, get, create, list };
