const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const bookingSlotCtrl = require('./bookingSlot.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/bookingslot - Get list of bookingslot */
  .get(bookingSlotCtrl.list)

  /** POST /api/bookingslot - Create new bookingslot */
  .post(validate(paramValidation.postCreateBookingSlot), bookingSlotCtrl.create);

router.route('/:bookingSlotDate')
  /** PUT /api/bookingslot/:bookingSlotDate - Get Booking slot */
  .put(validate(paramValidation.getSlotsValidate), bookingSlotCtrl.get);


router.route('/leap/:date/:appId')
/** GET /api/bookingslot/:bookingSlotDate - Get Booking slot */
  .get(bookingSlotCtrl.getSlots);

router.route('/counsellor/:slotDateTime')
  /** PUT /api/bookingslot/counsellor/:slotDate*/
  .put(validate(paramValidation.getCounsellorSlot), bookingSlotCtrl.getCounsellorSlot);

  /** PUT /api/bookingslot/:bookingSlotID - Update user */
//   .put(validate(paramValidation.updateUser), userCtrl.update)

  /** DELETE /api/bookingslot/:bookingID - Delete user */
//   .delete(userCtrl.remove);

/** Load user when API with bookingSlotDate route parameter is hit */
router.param('bookingSlotDate', bookingSlotCtrl.load);

module.exports = router;
