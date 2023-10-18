const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Schema = mongoose.Schema;
const idvalidator = require('mongoose-id-validator');

/**
 * Context Schema
 */
const ContextSchema = new mongoose.Schema({
  contextName: {
    type: String
  },
  createdAt: {
    type : Date,
    default: Date.now()
  },
  contextId:{
    type: String
  }


});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

ContextSchema.plugin(idvalidator);

/**
 * Methods
 */
ContextSchema.method({
});

/**
 * Statics
 */
ContextSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of context.
   * @returns {Promise<Context, APIError>}
   */
  get(id) {
    return this.findById(id)
    .populate("concern", "concern")
      .exec()
      .then((context) => {
        if (context) {
          return context;
        }
        const err = new APIError('No such concern type exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List Context in descending order of 'createdAt' timestamp.
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
 * @typedef Context
 */
module.exports = mongoose.model('master_context', ContextSchema);
