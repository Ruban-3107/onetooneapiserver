const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Schema = mongoose.Schema;
const idvalidator = require('mongoose-id-validator');

/**
 * Booking Type Schema
 */
const BookingTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  image:{
    type:String
  },
  selected_img:{
    type:String
  },
  session_img: {
    type: String
  },
  homepage_img: {
    type: String
  },
  bookingTypeId : {
    type: String
  }

});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

BookingTypeSchema.plugin(idvalidator);

/**
 * Methods
 */
BookingTypeSchema.method({
});

/**
 * Statics
 */
BookingTypeSchema.statics = {
  /**
   * Get Booking Type
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((bookingtype) => {
        if (bookingtype) {
          return bookingtype;
        }
        const err = new APIError('No such booking type exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  getBookingType(type) {
    return this.findOne({"type": type})
      .exec()
      .then((bookingType)=> {
      console.log(bookingType)
        if(bookingType){
          return bookingType;
        }
        const err = new APIError('No such booking type exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List Booking Type in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef Booking
 */
module.exports = mongoose.model('booking_type', BookingTypeSchema);
