const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const feelingTodayCtrl = require('./feelingToday.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
/** POST /api/feelingToday - Create feeling against a userId  */
  .post(feelingTodayCtrl.create);

router.route('/:userId')
/** PUT /api/feelingToday/:userId - update feeling by userId  */
  .put(validate(paramValidation.feelingTodayCreateValidate), feelingTodayCtrl.createFeelingToday)

/** GET /api/feelingToday/:userId - get feeling by userId  */
  .get(validate(paramValidation.getFeelingByUserIdValidate) , feelingTodayCtrl.getFeelingByUserId);

module.exports = router;
