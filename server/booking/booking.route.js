const express = require("express");
const validate = require("express-validation");
const paramValidation = require("../../config/param-validation");
const bookingCtrl = require("./booking.controller");
const bookingRequestWrapper = require("./booking.wrapper");
const bookingUpdateWrapper = require("./booking.updateWrapper");

const router = express.Router(); // eslint-disable-line new-cap

router
  .route("/")
  /** GET /api/v2/booking - Get list of booking */
  .get(bookingCtrl.list);   //question what is created -1 ,skip and limit

router
  .route("/request")
  /** POST /api/v2/booking/request - Create new booking request with preferred dates  */
  .post(
    (req, res, next) => new bookingRequestWrapper(req).wrap(next),
    bookingCtrl.create
  );

router
  .route("/confirmation")
  /** POST /api/v2/booking/confirmation - Confirm booking request with confirmed dates  */
  .post(
    (req, res, next) => new bookingRequestWrapper(req).wrap(next),
    bookingCtrl.confirmBooking
  );

router
  .route("/cancel")
  /** POST /api/v2/booking/cancel - Cancel booking request or confrimation*/
  .post(
    (req, res, next) => new bookingRequestWrapper(req).wrap(next),
  bookingCtrl.cancelBooking
);

router
  .route("/update")
  /** POST /api/v2/booking/update - update confirmed booking */
  .post(
    (req, res, next) => 
    new bookingUpdateWrapper(req).wrap(next),
  bookingCtrl.updateBooking
);

router
  .route("/statusupdate")
  /** POST /api/v2/booking/statusupdate - update confirmed booking */
  .post(bookingCtrl.completeBooking);

router
  .route("/:user_id")
  /** GET /api/v2/booking/:user_id - Get booking */
  .get(validate(paramValidation.getBookingByUserId), bookingCtrl.get);

router
  .route("/feedback/:Id")
  /** PUT /api/v2/booking/feedback/:bookingID - Put and update a past booking feedback */
  .put(validate(paramValidation.updateFeedbackValidate), bookingCtrl.updateFeedback);

router
  .route("/update/:Id")
  /** PUT /api/v2/booking/update/:ObjID - update a booking data */
  .put(validate(paramValidation.updateBookingDetailsValidate), bookingCtrl.updateBookingDetails);

router
  .route("/cancellation/:Id")
  /** PUT /api/v2/booking/cancellation/:Id - cancel booking */
  .put(validate(paramValidation.updateCancellationValidate), bookingCtrl.cancelBooking);
// .put(validate(paramValidation.cancelBooking), bookingCtrl.cancelBooking);

// router.route("/processBookingUpdate/:bookingID")
// /** PUT /api/booking/processBookingUpdate/:bookingID - Update booking status */
//   .put(validate(paramValidation.udpateBookingStatusToComplete), bookingCtrl.updateBookingStatus);







//used for web app
router.route("/concern/past_booking/:user_id")
  /** GET /api/booking/concern/past_booking/:user_id - Get past booking */
  .get(validate(paramValidation.getBookingConcernByuserId), bookingCtrl.getBookingGroupByConcern);

router.route("/concern-names/past_booking/:user_id")
  /** GET /api/booking/concern-names/past_booking/:user_id - Get past booking */
  .get(validate(paramValidation.getBookingConcernNamesByuserId), bookingCtrl.getBookingGroupByConcernNames);

router.route("/web-app/status/:user_id")
  /** GET /api/booking/web-app/status/:user_id - Get booking status sort for webapp */
  .get(validate(paramValidation.getBookingForWebAppStatusByuserId), bookingCtrl.getBookingStatusSort);

router.route("/web-app/new-status/:user_id")
  /** GET /api/booking/web-app/new-status/:user_id - Get booking new status for webapp */
  .get(validate(paramValidation.getBookingForWebAppNewStatusByuserId), bookingCtrl.getBookingNewStatusSort);

router.route("/:userId/app-id/:appId")
  /** GET /api/booking/:userId/app-id/:appId - Get booking by userid and appId */
  .get(validate(paramValidation.getBookingByAppId), bookingCtrl.getBookingByAppId);

/** DELETE /api/booking/:bookingID - Delete booking */
//   .delete(userCtrl.remove);

/** Load user when API with user_id route parameter is hit */
router.param("user_id", bookingCtrl.load);
// ref https://www.geeksforgeeks.org/express-js-router-param-function/

module.exports = router;
