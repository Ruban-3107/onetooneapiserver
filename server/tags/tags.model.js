const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Schema = mongoose.Schema;
const idvalidator = require('mongoose-id-validator');

/**
 * tags Schema
 */
const TagsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String
  },
  sub_category:{
    type: String
  },
  count: {
    type: Number
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  last_updated: {
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

TagsSchema.plugin(idvalidator);

/**
 * Methods
 */
TagsSchema.method({
});

/**
 * Statics
 */
TagsSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((tags) => {
        if (tags) {
          return tags;
        }
        const err = new APIError('No such tag exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List Tags in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 15 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },
  search(search) {
    console.log("Search filter......");
    console.log(search);
    return this.find({$or:[{'name':{ $regex: search.searchstring, $options: 'i' }},{'category':{ $regex: search.searchstring, $options: 'i' }},{'sub_category':{ $regex: search.searchstring, $options: 'i' }}]})
        .exec()
        .then((tags) => {
        if (tags) {
          return tags;
        }
        const err = new APIError('No such tag exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  });
  }
};

/**
 * @typedef Tags
 */
module.exports = mongoose.model('_tags', TagsSchema);
