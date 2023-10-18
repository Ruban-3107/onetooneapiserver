const OneSignal = require('./oneSignal.model');
const getuuid = require('../helpers/Utils');
const getMongoDBID = require('../helpers/mongoDBUtils');
const request = require("request");

/**
 * Load user id and append to req.
 */
 function load(req, res, next, id) {
    OneSignal.get(id)
    .then((oneSignal) => {
      req.oneSignal = oneSignal; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get OneSignal
 * @returns {OneSignal config}
 */
function get(req, res) {
  return res.json(req.oneSignal);
}

/**
 * Create new OneSignal entry
 * @property {string} req.body.appId - unique appId
 * @property {string} req.body.authKey - authKey of onesignal
 * @property {string} req.body.player_id - unique Id of user device
 * * @property {string} req.body.userId - mongoId of the user
 * @returns {OneSignal}
 */
function create(req, res, next) {
  const condition = {$and :[{ account_id: req.body.account_id }]}

  OneSignal.createAccount(condition,req.body)
    .then(oneSignal => res.json(oneSignal))
  .catch(e => next(e));

  // const oneSignal = new OneSignal({
  //   appId: req.body.appId,
  //   authKey: req.body.authKey ,
  //   player_id: req.body.player_id ,
  //   account_id: req.body.account_id
  // });
  // oneSignal.save()
  //   .then(savedOneSignal => res.json(savedOneSignal))
  //   .catch(e => next(e));
}

/**
 * Get Onesignal list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {Onesignal[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  OneSignal.list({ limit, skip })
    .then(oneSignal => res.json(oneSignal))
    .catch(e => next(e));
}


module.exports = { load, get, create, list };
