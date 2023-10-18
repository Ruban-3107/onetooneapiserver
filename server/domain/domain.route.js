const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const domainCtrl = require('./domain.controller');
const domainRequestWrapper = require('./domain.wrapper');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/domain- Get list of domain */
  .get(domainCtrl.list)

  /** POST /api/domain - Create new domain */
  .post((req, res, next) => new domainRequestWrapper(req).wrap(next),
    domainCtrl.create);

router.route('/:domainID')
  /** GET /api/domain/:domainID - Get domain */
  .get(validate(paramValidation.getDomainByID), domainCtrl.get);

router.route('/:domainID/type/:type')
  /** GET /api/domain/:domainID/type/:type - Get domain by appId */
  .get(validate(paramValidation.getDomainByNameAndAppId), domainCtrl.getDomainByType);

// router.route('/roche/:uuid')
// /** GET /api/domain/roche/:uuId - Get company */
//   .get(validate(paramValidation.getRocheDomainValidate), domainCtrl.getUniqueId);

router.route('/web-app/:id')
/** GET /api/domain/web-app/:id - Get domain */
  .get(validate(paramValidation.getDomainByIdValidate), domainCtrl.getDomainByID);

/** Load user when API with domain route parameter is hit */
router.param('domainID', domainCtrl.load);

module.exports = router;
