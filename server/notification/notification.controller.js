const Notification = require("./notification.model");
const getMongoDBID = require("../helpers/mongoDBUtils");

/**
 * Load Notification and append to req.
 */
 function load(req, res, next, id) {
  Notification.get(id)
  .then((notification) => {
      req.notification = notification; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get Notification
 * @returns {notification}
 */
function get(req, res) {
  return res.json(req.notification);
}

function getInappNotification(req, res, next) {
  Notification.getInappNotifications(req.params)
    .then((notification) => {
    console.log("inapp notification", notification);
  res.json(notification)
})
.catch(e => next(e));
}

function updateNotificationSeenStatus(req, res, next) {
  req.body.seen = true;
  Notification.updateSeenNotification(req.params._id, req.body)
    .then((statusResponse) => {
    console.log("update notification status", statusResponse)
    res.json(statusResponse)
  })
  .catch(e => next(e));
}

/**
 * Create new notification
 * @property {string} req.body.Type - The notification object.
 * @property {string} req.body.template - The notification rating.
 * @returns {notification}
 */
function create(req, res, next) {
  const notification = new Notification({
    mode: req.body.mode || '',
    content: req.body.content,
    status: req.body.status,
    user_id: req.body.user_id,
    booking_id: req.body.booking_id,
    subject: req.body.subject,
    created_date: req.body.created_date,
    notification_id: req.body.notification_id,
    notification_date: req.body.notification_date,
    notification_time: req.body.notification_time,
    notification_player_ids: req.body.notification_player_ids
  });

  notification.save()
    .then(savedNotification => res.json(savedNotification))
    .catch(e => next(e));
}

// /**
//  * Get Notification list.
//  * @property {number} req.query.skip - Number of notification to be skipped.
//  * @property {number} req.query.limit - Limit number of notification to be returned.
//  * @returns {notification[]}
//  */
// function list(req, res, next) {
//   const { limit = 50, skip = 0 } = req.query;
//   Notification.list({ limit, skip })
//     .then(notification => res.json(notification))
//     .catch(e => next(e));
// }

module.exports = { load, get, create, getInappNotification, updateNotificationSeenStatus };
