const Concern = require('./concern.model');
const mongoose = require('mongoose');
const getMongoDBID = require('../helpers/mongoDBUtils');

/**
 * Load concern and append to req.
 */
function load(req, res, next, id) {
  Concern.get(id)
    .then((concern) => {
      req.concern = concern; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Load context based on concern and append to req.
 */
function loadcontext(req, res, next) {
  const body = req.body.featureMongoId;
  let query=[];
  if(body && body.length){
    for(let i=0;i<body.length;i++){
      query.push({$and:[{'featureMongoId':mongoose.Types.ObjectId(body[i])},{'status' : true}]});
    }
  }
  Concern.getcontext(query)
  .then(concern => res.json(concern))
  .catch(e => next(e));
}

/**
 * Get concern
 * @returns {concern}
 */
function get(req, res) {
  return res.json(req.concern);
}

/**
 * Create new concern
 * @property {string} req.body.concernName - Name of concern
 * @property {string} req.body.concernText - concern text
 * @property {string} req.body.concernDisplayCategory - name to be displayed for the concern
 * @property {string} req.body.img - Name of concern
 * @property {string} req.body.featureId - mongoID of feature
 * @property {string} req.body.concernID - unique Id for the concern
 * @returns {Concern}
 */
function create(req, res, next) {
  const concern = new Concern({
    concernName: req.body.concernName,
    concernText : req.body.concernText,
    concernDisplayCategory : req.body.concernDisplayCategory,
    img: req.body.img ||'',
    featureId:req.body.featureId,
    featureMongoId: getMongoDBID(req.body.featureMongoId),
    concernID : req.body.concernID
  });

  concern.save()
    .then(savedConcern => res.json(savedConcern))
    .catch(e => next(e));
}

/**
 * Get concern list.
 * @property {number} req.query.skip - Number of concerns to be skipped.
 * @property {number} req.query.limit - Limit number of concerns to be returned.
 * @returns {Concern[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Concern.list({ limit, skip })
    .then(concern => res.json(concern))
    .catch(e => next(e));
}


module.exports = { load, get, create,list,loadcontext};
