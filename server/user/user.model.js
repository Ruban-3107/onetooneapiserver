const Promise = require("bluebird");
const mongoose = require("mongoose");
const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");
const Schema = mongoose.Schema;
const _account = require("../account/account.model");
const userDataToCMS = require("./user.utility");
const idvalidator = require('mongoose-id-validator');

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  account_id: {
    type: Schema.Types.ObjectId,
    ref: "_account",
    unique:true
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
  relationship_status: {
    type: String,
  },
  birthdate: {
    type: String,
  },
  location: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
  session: {
    type: Object,
  },
  current_distress: {
    type: Number,
  },
  key_areas: {
    type: Array,
  },
  profile_img: {
    type: String,
  },
  notification: [
    {
      name: { type: String },
      value: { type: Boolean },
      image: { type: String },
    },
  ],
  language: [
    {
      type: String,
    },
  ],
  cmsmemberId: {
    type: String,
  },
  cmsData:{
    type: Boolean,
    required: true
  },
  distress_status:{
    type: String
  },
  distress_monthskip:{
    type: Number,
    default: 0
  },
  distress_updated:{
    type: Date
  },
  distress: [
    {
      distress_name: {type: String},
      distress_level: {type: String},
      suicide_risk: {type: String},
      score: {type: Number},
      flag: {type: String},
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  app_version: {
    type: String
  },
  area_of_interest: {
    type: String
  },
  appId: {
    type: Array,
  },
  first_name: {
    type : String
  },
  last_name : {
    type : String
  },
  cmsId : {
    type : String
  },
  updatedChannel:{
    type : String
  }

});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

// UserSchema.plugin(idvalidator);

UserSchema.post("findOneAndUpdate", async function (doc, next) {
  if(doc.updatedChannel === "App"){
    try {
      let populatedDocument = doc.populate("account_id").execPopulate();
      let userDocument;
      populatedDocument.then((doc) => {
        userDocument = doc;
        doc.account_id
          .populate("domain")
          .execPopulate()
          .then(async (doc) => {
            userDocument.account_id.domain = doc.domain;
            let data = await new userDataToCMS(userDocument).send();
            if (data.status == 200 && data.entity.memberId) {
              /**Saving to mongoDB currently not working.I have posted a question .Should try different approach later */
              doc
                .updateOne(
                  { _id: doc._id },
                  { cmsmemberId: data.entity.memberId },
                  { upsert: true }
                )
                .then((users) =>
                  console.log(
                    `User successfully posted to CMS and memberID  stored in DB against ${doc._id}`
                  )
                )
                .catch((err) => console.error(err));
            }
          });
      });

      next();
    } catch (error) {
      console.log("get -> error", error);
      next(error);
    }
  }else next()

});

/**
 * Methods
 */
UserSchema.method({});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.find({ account_id: mongoose.Types.ObjectId(id) })
      .populate("account_id")
      .populate({
        path: "account_id",
        populate: {
          path: "domain",
          populate: {
            path: "booking_type",
            match: {
              status: true,
            },
          },
        },
      })
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError("No such user exists!", httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  getUserByPhoneNo(phone) {
    return _account
      .find({ phone: phone })
      .exec()
      .then((user) => {
        if (user) {
          return user;
        } else {
          return user;
        }
      });
  },

  getUserDetails(userId) {
    return this.findById(userId)
        .populate("account_id")
        .exec()
        .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('failed', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  });
  },

  updateUser(user, accountId) {
    return this.findOneAndUpdate(
      { account_id: mongoose.Types.ObjectId(accountId) },
      user,
      { new: true }
    )
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError("failed", httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  updateUserById(user, id) {
    return this.findByIdAndUpdate(
        id,
        user,
        { new: true }
      )
        .exec()
        .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError("failed", httpStatus.NOT_FOUND);
    return Promise.reject(err);
  });
  },

  getDistress(userId){
    return this.findOne({_id: mongoose.Types.ObjectId(userId)})
      .exec()
      .then((user) =>{
        if(user && user.distress_updated){
          let presentDate = new Date();
          let distressUpdate = user.distress_updated;
          let monthSkip = user.distress_monthskip;
          let updated_monthSkip = new Date(distressUpdate.setMonth(distressUpdate.getMonth() + monthSkip));
          let dateDiff = parseInt(new Date(presentDate) - new Date(updated_monthSkip)) / (1000 * 60 * 60 * 24);
          console.log('day diff -=-=>>', dateDiff);
          let distressFlag = false;
          if(dateDiff >= 0){
            return {distressFlag: true};
          }else{
            return {distressFlag: false};
          }
        }else{
          return {distressFlag: true};
        }
      })
    .catch((err) => {
        err = new APIError(err, httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },

  async updateUserDistress(userId, user){
    console.log("User updated", userId, user);
    return this.update({_id: mongoose.Types.ObjectId(userId)},user)
      .exec()
      .then((user) =>{
        return user;
      })
    .catch((err) => {
        err = new APIError(err, httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
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

  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<account_id, APIError>}
   */
  getAccountId(userid) {
    console.log("getAccountId -> userid", userid);
    return this.findById(userid)
      .exec()
      .then((user) => {
        if (user) {
          return user.account_id;
        }
        const err = new APIError("No such user exists!", httpStatus.NOT_FOUND);
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

  getNotificationsPref(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user.notification;
        }
        const err = new APIError("failed", httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  }


};

/**
 * @typedef User
 */
module.exports = mongoose.model("_user", UserSchema);
