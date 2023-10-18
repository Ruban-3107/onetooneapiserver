const _domain = require('./domain.model');
const getMongoDBID = require('../helpers/mongoDBUtils');
const getuuid = require('../helpers/Utils');
const Redis=require("redis")

const redisClient=Redis.createClient()
const defaultExpiration=3600
/**
 * Load Domain and append to req.
 */
function load(req, res, next, id) {
  console.log("id:",id)
  _domain.get(id)
  .then((domain) => {
    req.domain = domain; // eslint-disable-line no-param-reassign
    // redisClient.setEx("id",defaultExpiration,JSON.stringify(domain))
    return next();
  })
  .catch(e => next(e));
}

/**
 * Get Domain
 * @returns {Domain}
 */
function get(req, res) {
  return res.json(req.domain);
}

// function getUniqueId(req, res, next) {
//   _domain.getUniqueId(req.params.uuid)
//     .then((uniqueIds) => {
//     console.log('uniqueIds  ',uniqueIds);
//     return res.json(uniqueIds)
//   })
// }

/**
 * Create new Domain
 * @property {string} req.body.user - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {Domain}
 */
function create(req, res, next) {
  const domain = new _domain({
    domain: req.body.domain,
    company_name: req.body.company_name,
    GST: req.body.GST,
    services: req.body.services,
    booking_type: req.body.booking_type,
    // uuid: getuuid(),
    appId: req.body.appId,
    authenticationType: req.body.authenticationType,
    cmsId:req.body.cmsId
  });

  domain.save()
    .then(savedDomain => res.json(savedDomain))
    .catch(e => next(e));
}

function getDomainByID(req, res, next) {
  _domain.getDomainById(req.params.id)
    .then((domain) => {
    return res.json(domain);
  })
  .catch(e => next(e));
}

function  getDomainByType(req, res, next) {
  _domain.get(req.params)
    .then((domain)=>{
    return res.json(domain);
  })
.catch(e => next(e));
}

/**
 * Get Domain list.
 * @property {number} req.query.skip - Number of domain to be skipped.
 * @property {number} req.query.limit - Limit number of domain to be returned.
 * @returns {Domain[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  _domain.list({ limit, skip })
    .then(domains => res.json(domains))
    .catch(e => next(e));
}

module.exports = { load, get, create, list, getDomainByID, getDomainByType};
