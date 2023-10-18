const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const featureCtrl = require('./feature.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/feature - Get list of features */
  .get(featureCtrl.list)

  /** POST /api/feature - Create new feature */
  .post(validate(paramValidation.createFeatureValidate), featureCtrl.create);

router.route('/:id')
  /** GET /api/feature/:id - Get feature by feature mongoId */
  .get(featureCtrl.get);

/** Load service when API with id route parameter is hit */
router.param('id', featureCtrl.load);

module.exports = router;
