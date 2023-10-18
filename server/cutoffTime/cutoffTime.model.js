const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Schema = mongoose.Schema;
const idvalidator = require('mongoose-id-validator');

/**
 * cutoff time  Schema
 */
const CutoffTimeSchema = new mongoose.Schema({
  cutoff_time: {
    type: String,
  },
  company_id: [
    {
      type: Schema.Types.ObjectId,
      ref: "_domain"
    }
  ]
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

CutoffTimeSchema.plugin(idvalidator);

/**
 * Methods
 */
CutoffTimeSchema.method({
});

/**
 * Statics
 */
CutoffTimeSchema.statics = {
//   /**
//    * Get cutoff time
//    * @param {ObjectId} id - The objectId of cutoff time object.
//    * @returns {Promise<Cutoff-time, APIError>}
//    */
  get(id) {
    return this.findById(id)
        .populate({
          path: "company_id",
        })
        .exec()
        .then((data) => {
        if (data) {
          return data;
        }
        const err = new APIError('No such cutoff time for a company exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  });
  },

  getByDomain(domain) {
    return this.find({'company_id': domain})
        .exec()
        .then((data) => {
        if (data) {
          return data;
        }
        const err = new APIError('No such cutoff time for a company exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  });
  },

  /**
   * List cutoff-time
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

// /**
//  * @typeof cutoff-time
//  */
module.exports = mongoose.model('_cutoff_time', CutoffTimeSchema);
