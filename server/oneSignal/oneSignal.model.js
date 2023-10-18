const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Schema = mongoose.Schema;
const idvalidator = require('mongoose-id-validator');

/**
 * oneSignal Schema
 */
const oneSignalSchema = new mongoose.Schema({
  appId: {
    type: String,
    required: true
  },
  authKey:{
    type:String,
    required: true
  },
  player_id:{
    type:String,
    required: true
  },
  account_id: {
    type: Schema.Types.ObjectId,
    ref: "_account",
    required: true
  },
  createdAt: {
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

oneSignalSchema.plugin(idvalidator);

/**
 * Methods
 */
oneSignalSchema.method({
});

/**
 * Statics
 */
oneSignalSchema.statics = {
  /**
   * Get OneSignal using userID
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((oneSignal) => {
        if (oneSignal) {
          return oneSignal;
        }
        const err = new APIError('No such user exists in onesignal!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List oneSignal config in descending order of 'createdAt' timestamp.
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
  },

  getOneSiganlDetails(accountId){
    console.log("getOnesiganl -> details", accountId)
    return this.find({account_id : accountId})
    .exec()
    .then((oneSignal) => {
      if (oneSignal) {
        return oneSignal;
      }
      const err = new APIError('No such user exists in onesignal!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });

  },

  createAccount(condition,data){
    console.log("getOnesiganl -> details", condition)

    return this.findOneAndUpdate(condition,data,{upsert: true,new: true})
        .exec()
        .then((oneSignal) => {
        if (oneSignal) {
          return oneSignal;
        }
        const err = new APIError('No such user exists in onesignal!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  });

  },
};

/**
 * @typedef Onesignal
 */
module.exports = mongoose.model('onesignal', oneSignalSchema);
