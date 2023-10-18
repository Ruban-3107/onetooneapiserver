const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const adminCtrl = require('./admin.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/v2/admin - Get list of admin settings */
  .get(adminCtrl.list)

  /** POST /api/v2/admin - Create new admin line */
  .post(validate(paramValidation.createAdmin), adminCtrl.create);
  // .post(adminCtrl.create);

router.route('/:config_type')
  /** GET /api/v2/admin/:config_type - Get admin line on config_type */
  .get(validate(paramValidation.getAdmin), adminCtrl.get)

  /** PUT /api/v2/admin/:config_type - Update admin config */
  .put(validate(paramValidation.updateAdminValidate) ,adminCtrl.update)

/** Load user when API with screen route parameter is hit */
router.param('config_type', adminCtrl.load);

module.exports = router;
