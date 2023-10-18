const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const settingCtrl = require('./setting.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/setting - Get list of settings */
  .get(settingCtrl.list)

  /** POST /api/setting - Create new setting line */
  .post(validate(paramValidation.createSettingValidate), settingCtrl.create);

router.route("/:screen")
  /** GET /api/setting/:screen - Get setting line screen on page type */
  .get(validate(paramValidation.getSettingByScreenValidate), settingCtrl.get)
/** PUT /api/setting/:screen - setting line screen on page type */
  .put(validate(paramValidation.updateSettingValidate), settingCtrl.update);

router.route("/appId/:appId")
  /** GET /api/setting/appId/:appId - Get list of settings by appId */
  .get(validate(paramValidation.getAllSettingByAppIdValidate), settingCtrl.getAllSettingsByAppid);

router.route("/:screen/appId/:appId")
  /** GET /api/setting/:screen/appId/:appId - Get settings by screen and appId */
  .get(validate(paramValidation.getEachSettingByAppIdValidate), settingCtrl.getSettingsByAppId);

router.route('/updateFAQ/:screen')
  /** PUT /api/setting/updatefaq/:screen - update setting FAQs on screen */
  .put(validate(paramValidation.updateFAQValidate), settingCtrl.updateFAQs)

/** Load user when API with screen route parameter is hit */
router.param('screen', settingCtrl.load);

module.exports = router;
