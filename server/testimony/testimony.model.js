const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Schema = mongoose.Schema;
const idvalidator = require('mongoose-id-validator');

/**
 * Testimony Schema
 */
const TestimonySchema = new mongoose.Schema({
  username: {
    type: String
  },
  user_pic: {
    type: String
  },
  title: {
    type: String
  },
  content: {
    type: String
  },
  createdAt : {
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

TestimonySchema.plugin(idvalidator);

/**
 * Methods
 */
TestimonySchema.method({
});

/**
 * Statics
 */
TestimonySchema.statics = {
  /**
   * Get Testimony
   * @param {ObjectId} id - The objectId of Testimony.
   * @returns {Promise<Testimony, APIError>}
   */
  get(id) {
    return this.findById(id)
        .exec()
        .then((testimony) => {
        if (testimony) {
          return testimony;
        }
        const err = new APIError('No such booking type exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  });
  },

  /**
   * List testimony in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of testimonys to be skipped.
   * @param {number} limit - Limit number of testimonys to be returned.
   * @returns {Promise<Testimony[]>}
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
 * @typedef Testimony
 */
module.exports = mongoose.model('testimony', TestimonySchema);
