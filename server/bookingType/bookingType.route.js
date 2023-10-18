const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const bookingTypeCtrl = require('./bookingType.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/bookingtype - Get list of bookingtype */
  .get(bookingTypeCtrl.list)

  /** POST /api/bookingtype - Create new bookingtype */
  .post(validate(paramValidation.bookingTypeCreate), bookingTypeCtrl.create);

router.route('/:bookingTypeID')
  /** GET /api/bookingtype/:bookingID - Get bookingtype */
  .get(validate(paramValidation.getBookingTypeValidate), bookingTypeCtrl.get);





router.route("/web-app/:type")
  /** GET /api/bookingtype/web-app/:type - Get list of bookingtype by type */
  .get(validate(paramValidation.getBookingTypeByTypeValidate), bookingTypeCtrl.getBookingTypeByType);

/** Load user when API with bookingID route parameter is hit */
router.param('bookingTypeID', bookingTypeCtrl.load);

module.exports = router;
