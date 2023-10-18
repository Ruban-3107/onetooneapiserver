const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const notificationCtrl = require('./notification.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
/** GET /api/notification - Get list of notification */
  // .get(notificationCtrl.list)

  /** POST /api/notification - Create new notification */
  .post(notificationCtrl.create);

router.route('/inapp/:user_id')
  /** GET /api/notification/inapp - get inapp notifications */
  .get(notificationCtrl.getInappNotification);

router.route('/inapp/update/:_id')
  /** PUT /api/notification/inapp - update seen status */
  .put(notificationCtrl.updateNotificationSeenStatus);

router.route('/:id')
  /** GET /api/notification/:id- Get notification */
  .get(notificationCtrl.get);

  /** Load notification when API with notification route parameter is hit */
  router.param('id', notificationCtrl.load);

  module.exports = router;
