const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const oneSignalCtrl = require('./oneSignal.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/onesignal - Get list of onesignal */
  .get(oneSignalCtrl.list)

  /** POST /api/onesignal - Create new onesignal */
  .post(oneSignalCtrl.create);

router.route('/:userID')
  /** GET /api/onesignal/:userID - Get onesignal using userId */
  .get(oneSignalCtrl.get)

  /** PUT /api/onesignal/:userID - Update onesignal using userId */
//   .put(oneSignalCtrl.update)

/** Load user when API with userID route parameter is hit */
router.param('userID', oneSignalCtrl.load);

module.exports = router;
