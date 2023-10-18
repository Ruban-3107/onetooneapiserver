const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const userCtrl = require('./user.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/user - Get list of users */
  .get(userCtrl.list)

  /** POST /api/user - Create new user */
  .post(userCtrl.create);
  // .post(validate(paramValidation.createUser), userCtrl.create);

// router.route('/roche')
// /** POST /api/user/roche - Create new roche user */
//   .post(userCtrl.createRocheUser);
//
// router.route('/roche/:accountId')
// /** GET /api/user/roche/:accountId - update user details based on account_id */
//   .put(userCtrl.update);

router.route('/:accountId')
  /** GET /api/user/:accountId - Get user details based on account_id */
  .get(userCtrl.get)

  /** PUT /api/user/:userId - Update user */
  .put(userCtrl.update)
  // .put(validate(paramValidation.updateUser), userCtrl.update)

  /** DELETE /api/user/:userId - Delete user */
  .delete(userCtrl.remove);

router.route('/distress/:userId')
/** GET /api/user/distress/:userId - get user distress details*/
  .get(userCtrl.userDistressDetails);

router.route("/account/update")
/** PUT /api/user/account/update - Update account User name */
  .put(userCtrl.updateAccount);

router.route("/app_version/:userId")
  /** PUT /api/user/app_version/:userId - Update user app version*/
  .put(userCtrl.updateUserDetails);

router.route("/integration/update")
/** POST /api/v2/user/integration/update - Update user from cms */
  .post(userCtrl.updateUserCms);

/** Load user when API with userId route parameter is hit */
router.param('accountId', userCtrl.load);

module.exports = router;
