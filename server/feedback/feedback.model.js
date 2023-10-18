const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Schema = mongoose.Schema;
const idvalidator = require('mongoose-id-validator');

/**
 * Feedback Schema
 */
const FeedbackSchema = new mongoose.Schema({
  feedback: [{
    type: Object
  }],
  rating: {
    type: Object
  },
  booking_objId: {
    type: Schema.Types.ObjectId,
    ref: "_booking"
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

FeedbackSchema.plugin(idvalidator);

/**
 * Methods
 */
FeedbackSchema.method({
});

/**
 * Statics
 */
FeedbackSchema.statics = {
  /**
   * Get Feedback
   * @param {ObjectId} id - The objectId of booking.
   * @returns {Promise<Feedback, APIError>}
   */
  get(id) {
    return this.find({booking_objId: id})
      .exec()
      .then((feedback) => {
        if (feedback) {
          return feedback;
        }
        const err = new APIError('No such feedback exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List Feedback in descending order of 'created_date' timestamp.
   * @param {number} skip - Number of feedbacks to be skipped.
   * @param {number} limit - Limit number of feedbacks to be returned.
   * @returns {Promise<Feedback[]>}
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
 * @typedef Feedback
 */
module.exports = mongoose.model('_feedback', FeedbackSchema);
