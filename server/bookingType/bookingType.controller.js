const booking_type = require('./bookingType.model');

/**
 * Load Booking Type and append to req.
 */
 function load(req, res, next, id) {
  booking_type.get(id)
    .then((bookingtype) => {
      req.bookingType = bookingtype; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get Booking Type
 * @returns {BookingType}
 */
function get(req, res) {
  return res.json(req.bookingType);
}

/**
 * Create new Booking Type
 * @property {string} req.body.type - The type of the booking
 * @returns {Booking}
 */
function create(req, res, next) {
  const bookingType = new booking_type({
    type: req.body.type,
    image: req.body.image || "",
    selected_img: req.body.selected_img || "",
    session_img: req.body.session_img || ""
  });

  bookingType.save()
    .then(savedBooking => res.json(savedBooking))
    .catch(e => next(e));
}


function getBookingTypeByType(req, res, next) {
  booking_type.getBookingType(req.params.type)
    .then((bookingtype) => {
      res.json(bookingtype); // eslint-disable-line no-param-reassign
  })
  .catch(e => next(e));
}

/**
 * Get Booking Type list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  booking_type.list({ limit, skip })
    .then(bookingType => res.json(bookingType))
    .catch(e => next(e));
}

module.exports = { load, get, create, list, getBookingTypeByType };
