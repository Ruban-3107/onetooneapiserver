const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const counsellorCtrl = require('./counsellor.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
/** GET /api/counsellor - Get list of counsellor */
  .get(counsellorCtrl.list)

  /** POST /api/counsellor - Create new counsellor */
  .post(validate(paramValidation.counsellorCreate) ,counsellorCtrl.create);

router.route('/:counsellor_Id')
/** GET /api/counsellor/:counsellor_Id - Get counsellor */
  .get(validate(paramValidation.getCounsellorValidate), counsellorCtrl.get)

/** Load counsellor when API with bookingID route parameter is hit */
router.param('counsellor_Id', counsellorCtrl.load);

module.exports = router;
