const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Schema = mongoose.Schema;
const idvalidator = require('mongoose-id-validator');

/**
 * Feeling Schema
 */
const feelingTodaySchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: '_user',
    required: true
  },
  feeling: [{
    text: {
      type: String
    },
    smiley: {
      type: String
    },
    created_date: {
      type: Date,
      default: Date.now()
    }
  }],
  created_date: {
    type: Date,
    default: Date.now()
  },
  updated_date: {
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

feelingTodaySchema.plugin(idvalidator);

/**
 * Methods
 */
feelingTodaySchema.method({
});

/**
 * Statics
 */
feelingTodaySchema.statics = {
  createFeelingByUser(body, userId) {
    return this.update(
        { userId: userId },
        {
          $set: {
            "userId": userId,
            "updated_date": body.updated_date || new Date()
        },
          $push: {
              feeling: {
                text: body.text,
                smiley: body.smiley,
                created_date: new Date()
            }
          }
        },
        { upsert: true }
      )
        .exec()
        .then((feelingtoday) => {
        if (feelingtoday) {
          return feelingtoday;
        }
        const err = new APIError(
          "No such user exists!",
          httpStatus.NOT_FOUND
        );
      return Promise.reject(err);
    });
  },

  getFeelingByUserId(userId){
      return this.findOne({userId: mongoose.Types.ObjectId(userId)})
          .exec()
          .then((user) => {
          if (user) {
            return user;
          }else{
            return user;
          }
          const err = new APIError('failed', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  }
};

/**
 * @typedef feeling
 */
module.exports = mongoose.model('today_feeling', feelingTodaySchema);
