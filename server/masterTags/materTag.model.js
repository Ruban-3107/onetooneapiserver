const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Schema = mongoose.Schema;
const idvalidator = require('mongoose-id-validator');

/**
 * Tag Schema
 */
const TagSchema = new mongoose.Schema({
  name: {
    type: String
  },
  image: {
    type: String
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

TagSchema.plugin(idvalidator);

/**
 * Methods
 */
TagSchema.method({
});

/**
 * Statics
 */
TagSchema.statics = {

  list() {
    return this.find({})
      .exec()
      .then((tags) => {
        return tags;
    })
  }
};

/**
 * @typedef Booking
 */
module.exports = mongoose.model('master_tag', TagSchema);
