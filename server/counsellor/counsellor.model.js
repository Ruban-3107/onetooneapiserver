const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Schema = mongoose.Schema;
const idvalidator = require('mongoose-id-validator');

/**
 * Counsellor Schema
 */
const CounsellorSchema = new mongoose.Schema({
  counsellor_id: {type: String},
  counsellor_name : {type: String},
  counsellor_phone : {type: String},
  counsellor_email : {type: String},
  mode : [{type: String}],
  concerns: [{type: String}],
  contexts : [{type: String}],
  age : {type: Number},
  company_type : {type: String},
  experience : {type: String},
  context_profile : {type: String},
  language : [{type: String}],
  gender : {type: String},
  role : {type: String},
  sessions_perday : {type: Number},
  sessions_permonth : {type: Number},
  sessions_peryear : {type: Number},
  sessions_taken : {type: Number},
  start_time : {type: String},
  end_time : {type: String},
  created_date: {type: Date,
  default :Date.now}
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

CounsellorSchema.plugin(idvalidator);

/**
 * Methods
 */
CounsellorSchema.method({
});

/**
 * Statics
 */
CounsellorSchema.statics = {
  /**
   * Get Counsellor
   * @param {ObjectId} id - The objectId of counsellor.
   * @returns {Promise<Counsellor, APIError>}
   */
  get(id) {
    return this.find({_id: id})
        .exec()
        .then((counsellor) => {
        if (counsellor) {
          return counsellor;
        }
        const err = new APIError('No such counsellor type exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  });
  },

  getEmail(id) {
    return this.findById(id)
      .exec()
      .then((counsellor) => {
        if (counsellor) {
          return counsellor.counsellor_email;
          console.log("counsellor.counsellor_email:"+counsellor.counsellor_email)
        }
        const err = new APIError('No such counsellor email exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  // getCounsellors(filterData){
  //   return this.aggregate({$match: {$and: filterData}})
  //     .exec()
  //     .then((counsellorRespo) =>{
  //     console.log('counsellorRespo', counsellorRespo);
  //     })
  // },



  updateCounsellorSession(counsellorId, sessionCount){
    return this.update({_id: counsellorId}, {$inc: { sessions_taken: sessionCount }}).exec()
      .then((counsellorRes) => {
        console.log('counsellor updated', counsellorRes);
      })
  },


  // updateCounsellorSessionAvailable(counsellorId){
  //   console.log(counsellorId);
  //   return this.update({_id: counsellorId}, {$inc: { sessions_taken: -1 }}).exec()
  //       .then((counsellorRes) => {
  //       console.log('counsellor updated available', counsellorRes);
  //   })
  // },

  /**
   * List Counsellor in descending order of 'created_date' timestamp.
   * @param {number} skip - Number of counsellor to be skipped.
   * @param {number} limit - Limit number of counsellor to be returned.
   * @returns {Promise<Feedback[]>}
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
 * @typedef Counsellor
 */
module.exports = mongoose.model('_counsellor', CounsellorSchema);
