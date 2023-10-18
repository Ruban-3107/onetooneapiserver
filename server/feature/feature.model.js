const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Schema = mongoose.Schema;
const idvalidator = require('mongoose-id-validator');

/**
 * Service Schema
 */
const FeatureSchema = new mongoose.Schema({
  featureName: {
    type: String
  },
  type: {
    type: String
  },
  featureId: {
    type: String
  },
  img : {
    type: String
  }

});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
FeatureSchema.plugin(idvalidator);
/**
 * Methods
 */
FeatureSchema.method({
});

/**
 * Statics
 */
FeatureSchema.statics = {
  get(id) {
    return this.find({_id:id})
      .then((feature) => {
        if (feature) {
          return feature;
        }
        const err = new APIError('No such feature exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

// /**
//  * @typedef Feature
//  */
module.exports = mongoose.model('master_feature', FeatureSchema);
