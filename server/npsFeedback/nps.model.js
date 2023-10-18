const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Schema = mongoose.Schema;
const idvalidator = require('mongoose-id-validator');

/**
 * Audio Schema
 */
const npsFeedbackSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: '_user',
    required: true
  },
  intensity: {
    type: Number
  },
  area_of_improval: {
    type: Array
  },
  like_about_us: {
    type: Array
  },
  area_of_improval_feedback: {
    type: String
  },
  like_about_us_feedback: {
    type: String
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

npsFeedbackSchema.plugin(idvalidator);

/**
 * Methods
 */
npsFeedbackSchema.method({
});

/**
 * Statics
 */
npsFeedbackSchema.statics = {
};

/**
 * @typedef Booking
 */
module.exports = mongoose.model('nps_feedback', npsFeedbackSchema);
