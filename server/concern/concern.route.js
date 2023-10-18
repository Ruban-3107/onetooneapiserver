const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const concernCtrl = require('./concern.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/v2/concern - Get list of concerns */
  .get(concernCtrl.list)

  /** POST /api/concern - Create new concern */
  .post(validate(paramValidation.concernCreate), concernCtrl.create);

router.route('/:id')
  /** GET /api/concern/:concernID - Get concern */
  .get(validate(paramValidation.getConcernValidate), concernCtrl.get);

router.route('/contextDetails')
  /** POST /api/v2/concern/contextDetails - Get context based on concern */
  // .post(validate(paramValidation.getConcernAndContext), concernCtrl.loadcontext);
  .post(concernCtrl.loadcontext);

/** Load user when API with concernID route parameter is hit */
router.param('id', concernCtrl.load);

module.exports = router;
