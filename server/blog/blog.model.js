const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Schema = mongoose.Schema;
const idvalidator = require('mongoose-id-validator');

/**
 * Audio Schema
 */
const blogSchema = new mongoose.Schema({
  type: {
    type: String,
    default : "Article",
    required: true
  },
  Viewed_Users: {
    type: Array
  },
  isPopular :{
    type : Boolean
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

// blogSchema.plugin(idvalidator);

/**
 * Methods
 */
blogSchema.method({
});

/**
 * Statics
 */
blogSchema.statics = {

  getViewsByUserId(id) {
    return this.aggregate([{$match:{$and:[{Viewed_Users:{$elemMatch : {user_id : id}}},{Viewed_Users: {$exists: true}}]}},
      {"$group":
        {_id: "$type",count : {$addToSet: "$_id"}}
      },
    ]).exec()
  },

  getBycondition(condition) {
    return this.find(condition)
      .sort({ Date_for_publish: -1 })
      .limit(+20)
      .exec()
      .then((blogs) => {
        return blogs;
    })
  },

  list() {
    return this.find({})
      .exec()
      .then((blogs) => {
        return blogs;
    })
  },

  groupByTags() {
    return this.aggregate([ {$match:{}},
      {"$group":
        {_id: "$primaryTag",count : {$push: "$type"}}
      }
    ]).exec()
      .then((blogs) => {
        return blogs;
    })
  }
};

/**
 * @typedef Blog
 */
module.exports = mongoose.model('Blog', blogSchema);
