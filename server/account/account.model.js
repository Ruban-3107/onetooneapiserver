const Promise = require("bluebird");
const mongoose = require("mongoose");
const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");
const PasswordHash = require("../helpers/PasswordHash");
const Schema = mongoose.Schema;
const request = require("request");
const idvalidator = require('mongoose-id-validator');

/**
 * Account Schema
 */
const AccountSchema = new mongoose.Schema({
  email: {
    type: String
  },
  password: {
    type: String,
    trim: true
  },
  phone: {
    type: Number,
    required: true,
    unique: true
  },
  other_phone: {
    type: Number
  },
  first_name: {
    type: String
  },
  domain: {
    type: Schema.Types.ObjectId,
    ref: "_domain"
  },
  otp: {
    type: String
  },
  employee_code: {
    type: String
  },
  email_verified: {
    type: Boolean,
    default: false
  },
  phone_verified: {
    type: Boolean,
    default: false
  },
  activated: {
    type: Boolean,
    default: false
  },
  registration_status: {
    type: String
  },
  otpFor: {
    type: String
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  entitlement: {
    type: String
  },
  appId: {
    type: Array
  },
  cmsData: {
    type: Boolean
  },
  accountType: {
    type: String
  },
  qr_code: {
    type: String
  },
  cmsId :{
    type : String
  },
  source :{
    type: String
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

AccountSchema.plugin(idvalidator);

/**
 * Methods
 */
AccountSchema.method({});

/**
 * Statics
 */
AccountSchema.statics = {

  get(id) {
    return this.find({ _id: id })
      .populate({
        path: "domain",
        populate: {
          path: "services",
        },
      })
      .populate({
        path: "domain",
        populate: {
          path: "booking_type",
          match: {
            status: true
          }
        },
      })
      .exec()
      .then((account) => {
        if (account) {
          return account;
        }
        const err = new APIError(
          "No such account exists!",
          httpStatus.NOT_FOUND
        );
        return Promise.reject(err);
      });
  },

  updateAccount(account) {
    return this.findByIdAndUpdate(account._id, account, { new: true })
      .exec()
      .then((account) => {
        if (account) {
          return account;
        }
        const err = new APIError("failed", httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  getEmailId(id) {
    return this.findById(id)
      .exec()
      .then((account) => {
        if (account) {
          return account.email;
        }
        const err = new APIError("No Email ID found", httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  getPhoneNumber(id) {
    return this.findById(id)
      .exec()
      .then((account) => {
        if (account) {
          return account.phone;
        }
        const err = new APIError("No Phone Number found", httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  getUserName(id) {
    return this.findById(id)
      .exec()
      .then((account) => {
        if (account) {
          return account.first_name;
        }
        const err = new APIError("No user name found", httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  }
};

// /**
//  * @typedef Account
//  */
module.exports = mongoose.model("_account", AccountSchema);
