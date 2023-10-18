/**
 * Created by sandeep on 02/03/21.
 */
const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Schema = mongoose.Schema;

/**
 * Domain Schema
 */
const EmployeeSchema = new mongoose.Schema({
  employee_code: {
    type: String,
  },
  domain:{
    type: Schema.Types.ObjectId,
    ref: "_domain",
  },
  phone :{
    type: Number
  },
  email :{
    type: String
  },
  company_name : {
    type: String
  },
  createdOn : {
    type : Date
  },
  updatedOn : {
    type : Date
  },
  isActive : {
    type : Boolean
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
EmployeeSchema.method({
});

/**
 * Statics
 */
EmployeeSchema.statics = {

  getEmployeeData(condition){
    return this.findOne(condition)
      .exec()
      .then((data) => {
        return data;
      });
  },

  updateData(id,data){
    return this.findByIdAndUpdate(id, data, {new: true})
      .exec()
      .then((data) => {
      console.log("update data --->>>>",data)
        if (data) {
          return data;
        }
        const err = new APIError('No employee exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  }

};

// /**
//  * @typedef Domain
//  */
module.exports = mongoose.model('_employee', EmployeeSchema);
