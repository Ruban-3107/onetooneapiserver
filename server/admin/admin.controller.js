const AdminConfig = require('./admin.model');
const getMongoDBID = require('../helpers/mongoDBUtils');

/**
 * Load admin and append to req.
 */
function load(req, res, next, id) {
  AdminConfig.get(id)
    .then((adminConfig) => {
      req.admin = adminConfig; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get admin config
 * @returns {configaration}
 */
function get(req, res) {
  return res.json(req.admin);
}

/**
 * Create new admin config
 * @property {string} req.body.config_type - name of the config_type.
 * @property {object} req.body.config - admin configuration.
 * @returns {configaration}
 */
function create(req, res, next) {
  const admin = new AdminConfig({
    config_type: req.body.config_type,
    config: req.body.config
  });
  admin.save()
  .then(savedConfig => res.json(savedConfig))
  .catch(e => next(e));
}

/**
 update admin configaration
 */
function update(req, res, next){
  AdminConfig.updateAdminConfig(req.body, req.params)
  .then((adminConfig) => { res.json( adminConfig )}).catch((e) => next(e));
}

/**
 * Get setting list.
 */
function list(req, res, next) {
  AdminConfig.list()
  .then(accounts => res.json(accounts))
  .catch(e => next(e));
}

module.exports = { load, get, create, list, update};
