const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Schema = mongoose.Schema;
const idvalidator = require('mongoose-id-validator');

/**
 * Domain Schema
 */
const DomainSchema = new mongoose.Schema({
  domain: {
      type: String
  },
  company_name: {
      type: String
  },
  GST: {
      type: String
  },
  features: [
    {
      type: Schema.Types.ObjectId,
      ref: "master_feature"
    }
  ],
  booking_type: [
    {
      type: Schema.Types.ObjectId,
      ref: "booking_type"
    }
  ],
  authenticationType :{
      type : Array
  },
  appId: {
    type: Array,
  },
  cmsId : {
   type: String
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

DomainSchema.plugin(idvalidator);

/**
 * Methods
 */
DomainSchema.method({
});

/**
 * Statics
 */
DomainSchema.statics = {
//   /**
//    * Get domain
//    * @param {ObjectId} id - The objectId of user.
//    * @returns {Promise<User, APIError>}
//    */
  get(params) {
    let query = {};
    if(params.type){
      query = {$and : [{_id:params.domainID}, {appId: {$in : params.type}}]}
    }else{
      query = {$and : [{_id:params}, {$or: [{appId: {$exists: false}}, {appId: {$nin: ["LEAP"]}}]}]}
      console.log("queryyyy",query)
    }
    return this.find(query)
      .populate({
        path:'booking_type',
        match: {
          status: true
        }
      })
      .then((domain) => {
        console.log("domain:",domain)
        if (domain) {
          return domain;
        }
        const err = new APIError('No such domain exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
    });
  },

  // getUniqueId(uniqueId) {
  //   return this.findOne({ uuid: uniqueId})
  //       .exec()
  //       .then((company) => {
  //       if (company) {
  //         return company;
  //       }
  //       else{
  //         return company;
  //       }
  //       // const err = new APIError('No such company exists!', httpStatus.NOT_FOUND);
  //   // return Promise.reject(err);
  // });
  // },

  getDomainById(id) {
    return this.findById(id)
        .populate({
          path:'booking_type',
          match: {
            status: true
          }
        })
        .then((domain) => {
        if (domain) {
          return domain;
        }
        const err = new APIError('No such domain exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },

  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
    .populate('booking_type')
    // .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec();
  }
};

// /**
//  * @typedef Domain
//  */
module.exports = mongoose.model('_domain', DomainSchema);
