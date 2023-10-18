const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const cutoffTimeCtrl = require('./cutoffTime.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
/** GET /api/cutoff-time- Get list of cutoff time for the companies */
  .get(cutoffTimeCtrl.list)

  /** POST /api/cutoff-time - Create new cutoff time for a company */
  .post(validate(paramValidation.cutoffTimeCreateValidate) , cutoffTimeCtrl.create);

router.route('/:company_id')
/** GET /api/cutoff-time/:company_id - Get cutoff-time */
  .get(cutoffTimeCtrl.get)

router.route('/domain/:company')
/** GET /api/cutoff-time/domain/:domain - Get cutoff-time */
  .get(cutoffTimeCtrl.getByDomain)


/** Load user when API with domain route parameter is hit */
router.param('company_id', cutoffTimeCtrl.load);

module.exports = router;
