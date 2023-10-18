
const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Schema = mongoose.Schema;
const idvalidator = require('mongoose-id-validator');

/**
 * myDiary Schema
 */
const MyDiarySchema = new mongoose.Schema({
  rating: [{
      image:{type:String},
      rating:{type:Number}
  }],
  details: [{
    data: {type: String},
  }],
  images: [{
    image: {type: String},
    creater_name: {type: String},
    created_date: {type: Date,
      default: Date.now}
  }],
  audio: [{
    url: {type: String},
    duration: {type: String},
    file_name: {type: String},
    location: {type: String},
    size: {type: String},
    creater_name: {type: String},
    created_date: {type: Date,
      default: Date.now}
  }],
  file: [{
    url: {type: String},
    size: {type: String},
    extension: {type: String},
    file_name: {type: String},
    location: {type: String},
    creater_name: {type: String},
    created_date: {type: Date,
      default: Date.now},
    file_image:{type:String}
  }],
  tags: [{
    type: Schema.Types.ObjectId,
    ref: '_tags'
  }],
  created_date: {
    type: Date,
    default: Date.now
  },
  last_updated: {
    type: Date,
    default: Date.now
  },
  status:{
    type:String
  },
  user_id:{
    type: Schema.Types.ObjectId,
    ref: '_user'
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

MyDiarySchema.plugin(idvalidator);

/**
 * Methods
 */
MyDiarySchema.method({
});

/**
 * Statics
 */
MyDiarySchema.statics = {
  /**
   * Get myDiary
   * @param {id} id
   * @returns {Promise<admin, APIError>}
   */
  get(id) {
    console.log('mydiary id',id);
    return this.find({ $and : [{'user_id': id},{"status": {$ne:"Deleted"}} ]})
    .populate("tags")
        .exec()
        .then((myDiaryObj) => {
        if (myDiaryObj.length) {
          console.log("My diary Object........");
          console.log(myDiaryObj);
          return myDiaryObj;
        }
        const err = new APIError('No such myDiary Config exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    })
  },

  // updateMyDiaryConfig(body, params) {
  //   return this.findOneAndUpdate({config_type:params.config_type },
  //       { config: body.config },{new: true})
  //       .exec()
  //       .then((myDiaryConfig) => {
  //       if (myDiaryConfig) {
  //         return myDiaryConfig;
  //       }
  //       const err = new APIError('No such myDiary Config exists!', httpStatus.NOT_FOUND);
  //   return Promise.reject(err);
  // });
  // },
  updateMyDiary(body,diaryId){

    return this.findOneAndUpdate({ _id: diaryId.Id},
        {
          status : body.status,
          last_updated : body.last_updated
          },
          {new: true})
          .exec()
        .then((diary) => {
        if ( diary ) {
          return diary
        }
        else {

          const err = new APIError("No such page exists!", httpStatus.NOT_FOUND);
    return Promise.reject(err);
  }
  });
  },

  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .populate("tags")
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

module.exports = MyDiary = mongoose.model('_diary', MyDiarySchema);
