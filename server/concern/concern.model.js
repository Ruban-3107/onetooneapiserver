const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Schema = mongoose.Schema;
const idvalidator = require('mongoose-id-validator');

/**
 * Concern Schema
 */
const ConcernSchema = new mongoose.Schema({
  concernName: {
    type: String
  },
  concernText: {
    type: String
  },
  concernDisplayCategory: {
    type: String
  },
  img: {
    type: String
  },
  featureMongoId:{
    type: Schema.Types.ObjectId,
    ref: "master_feature"
  },
  single_couple:{
    type : Boolean,
    default: true
  },
  status:{
    type : Boolean,
    default: true
  },
  concernId: {
    type: String
  },
  featureId: {
    type: String
  },
  displayOrder:{
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

ConcernSchema.plugin(idvalidator);

/**
 * Methods
 */
ConcernSchema.method({
});

/**
 * Statics
 */
ConcernSchema.statics = {
  /**
   * Get concern
   * @param {ObjectId} id - The objectId of concern.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((concern) => {
        if (concern) {
          return concern;
        }
        const err = new APIError('No such concern type exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List Concern in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of concerns to be skipped.
   * @param {number} limit - Limit number of concerns to be returned.
   * @returns {Promise<Concern[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  /**
   * Get Context based on Concerns array
   * @param {ObjectId} condition - The concerns array.
   * @returns {Promise<User, APIError>}
   */
  getcontext(condition) {
    return this.aggregate([
      {$match:{$or : condition}},
      {
        $lookup: {
          from: 'mapping_concern_contexts',
          localField: '_id',
          foreignField: 'concernMongoId',
          as: 'contexts'
        }
      },
      { $unwind: {path:"$contexts" ,preserveNullAndEmptyArrays:true} },
      { $lookup: {
          from: "master_contexts",
          localField: "contexts.contextMongoId",
          foreignField: "_id",
          as: "contexts.details"
      }},
      {
        $group : {
           "_id": "$_id",
          "concernName" : { '$first': "$concernName" },
          "concernText":{ '$first': "$concernText" },
          "displayOrder":{ '$first': "$displayOrder" },
          "concernDisplayCategory":{ '$first': "$concernDisplayCategory"},
          "contexts":{'$push' : "$contexts"},
          "img":{ '$first': "$img" },
          "status":{ '$first': "$status"},
          "single_couple":{ '$first': "$single_couple"} ,
          "concernId":{ '$first': "$concernId" },
          "featureMongoId":{ '$first': "$featureMongoId" }
        }
      },
      {
        $group: {
           "_id": "$featureMongoId",
           "concern": { "$push":
             {
               "_id":"$_id",
               "concernName":"$concernName",
               "concernText":"$concernText",
               "concernDisplayCategory":"$concernDisplayCategory",
               "displayOrder":"$displayOrder",
               "contexts":"$contexts",
               "image":"$img",
               "status":"$status",
               "single_couple":"$single_couple" ,
               "concernId":"$concernId"
             }
           }
        }
      },
      {
        $lookup: {
            from: 'master_features',
            localField: '_id',
            foreignField: '_id',
            as: 'feature'
        }
    }
    ])
    .exec()
    .then((context) => {
      if (context) {
        return context;
      }
      const err = new APIError('No context exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    })
  }
};

/**
 * @typedef Concern
 */
module.exports = mongoose.model('master_concern', ConcernSchema);
