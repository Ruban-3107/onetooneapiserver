const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const contextCtrl = require('./context.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/context - Get list of context */
  .get(contextCtrl.list)

  /** POST /api/context - Create new context */
  .post(validate(paramValidation.contextCreate), contextCtrl.create);

router.route('/:id')
  /** GET /api/context/:id - Get context */
  .get(validate(paramValidation.getContextValidate), contextCtrl.get);

/** Load context when API with bookingID route parameter is hit */
router.param('id', contextCtrl.load);

module.exports = router;
