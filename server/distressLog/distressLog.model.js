const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Schema = mongoose.Schema;
const idvalidator = require('mongoose-id-validator');

/**
 * Distress Log Schema
 */
const distressLogSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: '_user',
    required: true
  },
  distress: [{
    distress_name: {
      type: String
    },
    distress_level: {
      type: String
    },
    suicide_risk: {
      type: String
    },
    score: {
      type: Number
    },
    flag: {
      type: String
    },
    created_date: {
      type: Date,
      default: Date.now
    }
  }],
  updated_date: {
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

distressLogSchema.plugin(idvalidator);

/**
 * Methods
 */
distressLogSchema.method({
});

/**
 * Statics
 */
distressLogSchema.statics = {

  createDistressByUser(body, userId, intensity, suicide_risk) {
    let distressObj = {};
    if(body.distress && body.distress.length){
      distressObj = {
        distress_name: body.distress[body.distress.length-1].distress_name,
        distress_level: body.distress[body.distress.length-1].distress_level,
        suicide_risk: body.distress[body.distress.length-1].suicide_risk,
        score: body.distress[body.distress.length-1].score,
        flag: body.distress[body.distress.length-1].flag,
        created_date: new Date()
      }
    }else{
      distressObj = {
        distress_name: body.distress_name || '',
        distress_level: body.distress_status,
        suicide_risk: suicide_risk,
        score: intensity,
        flag: body.flag || '',
        created_date: new Date()
      }
    }
    return this.update(
        { userId: userId },
        {
          $set: {
            "userId": userId,
            "updated_date": body.updated_date || new Date()
          },
          $push: {
            distress: distressObj
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
};

/**
 * @typedef distressLog
 */
module.exports = distressLog = mongoose.model('distress_log', distressLogSchema);
