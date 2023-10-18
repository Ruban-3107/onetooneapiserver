const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const feedbackCtrl = require('./feedback.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/feedback - Get list of feedback */
  .get(feedbackCtrl.list)

  /** POST /api/feedback - Create new feedback */
  .post(validate(paramValidation.CreateFeedBackValidate), feedbackCtrl.create);

router.route('/:booking_Id')
  /** GET /api/feedback/:booking_Id - Get feedback */
  .get(validate(paramValidation.getFeedbackValidate), feedbackCtrl.get)

/** Load feedback when API with bookingID route parameter is hit */
router.param('booking_Id', feedbackCtrl.load);

module.exports = router;
