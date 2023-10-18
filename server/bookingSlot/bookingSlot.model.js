const Promise = require("bluebird");
const mongoose = require("mongoose");
const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");
const idvalidator = require("mongoose-id-validator");
const Schema = mongoose.Schema;
const Counsellor = require('../counsellor/counsellor.model');
const Booking = require('../booking/booking.model');

/**
 * Booking Slot Schema
 */
const BookingSlotSchema = new mongoose.Schema({
  start_time: {
    type: String,
    required: true
  },
  end_time: {
    type: String,
    required: true
  },
  time_of_day: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  booking_type: [{ type: Schema.Types.ObjectId, ref: "booking_type" }],
  price: {
    type: String,
    required: function () {
      return !this.cmsData;
    }
  },
  location: {
    type: String,
    required: function () {
      return !this.cmsData;
    }
  },
  address: {
    type: String
  },
  status : {
    type: String
  },
  appId : {
    type: Array
  },
  cmsData: {
    type: String
  },
  counsellor_id: {
    type: Schema.Types.ObjectId,
    ref: "_counsellor"
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

BookingSlotSchema.plugin(idvalidator);

/**
 * Methods
 */
BookingSlotSchema.method({});

/**
 * Statics
 */
BookingSlotSchema.statics = {
  /**
   * Get Booking Slot
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(date) {
    return this.find({ date: date })
      .populate({
        path: "booking_type",
      })
      .exec()
      .then((bookingslot) => {
        if (bookingslot) {
          return bookingslot;
        }
        const err = new APIError(
          "No such bookingslot  exists!",
          httpStatus.NOT_FOUND
        );
        return Promise.reject(err);
      });
  },

  getSlotFilter(queryMatch, counsellorFilter, appId) {
    let slotArray = [];
    if(queryMatch.length) {

      if(queryMatch.length == 1){
        queryMatch.push({"status": "Available"});
        if(appId == "LEAP")
          queryMatch.push({"appId":{$in: appId}})
        else
          queryMatch.push({$or: [{"appId": {$exists: false}},{appId: {$nin: ["LEAP"]}}]})
      }

      let aggregateQuery = [];
      if(appId == "LEAP"){
        aggregateQuery = [{$match: {$and: queryMatch}},
          {
            $lookup: {
              from: "_counsellors",
              localField: "counsellor_id",
              foreignField: "_id",
              as: "counsellor"
            }
          },
          {"$match": {$and: counsellorFilter}},
          {"$group": {_id: "$start_time", count: {$sum: 1}, slotObject: {$push: '$$ROOT'}}}
        ]
      }else{
        aggregateQuery = [{$match: {$and: queryMatch}},
          {"$group": {_id: "$start_time", slotObject: {$push: '$$ROOT'}}}]
      }
      return this.aggregate(aggregateQuery).then((bookingslot) => {
          if (bookingslot.length) {
            for(var i=0; i< bookingslot.length; i++){
              slotArray.push(bookingslot[i].slotObject[0])
            }
            slotArray.sort((a, b) => {
              return new Date(convertToDateFormat(a.start_time)) - new Date(convertToDateFormat(b.start_time));
            });
            function convertToDateFormat(stringDate) {
              var date = stringDate.split(" ");
              var time = date[1];
              date = date[0];
              time = time.split(":");
              date = date.split("-");
              var month = Number(date[1]) - 1;
              var date_formate = new Date(date[2], month, date[0], time[0], time[1], time[2]);
              return date_formate;
            }
            return slotArray;
          }else{
            return slotArray;
          }
        });
    }else{
      return slotArray;
    }
  },

  getTimeSlots(queryMatch, slotDateTime, counsellorFilter){
    let query = {};
    query ={start_time:slotDateTime}
    let queryMatchTime = [];
    queryMatchTime = [query];
    queryMatchTime.push({status: "Available"});
    if(queryMatch.appId)
      queryMatchTime.push({appId: {$in : queryMatch.appId}})
    counsellorFilter.push({"counsellor.sessions_perday":{$exists:true}});

    return this.aggregate([{$match: {$and: queryMatchTime}},
        {
          $lookup: {
            from: "_counsellors",
            localField: "counsellor_id",
            foreignField: "_id",
            sas: "counsellor"
          }
        },
        {"$match": {$and: counsellorFilter}},
        {"$group": {_id: "$start_time", count: {$sum: 1}, slotObject: {$push: '$$ROOT'}}}
      ]).then((bookingslot) => {

      let slotArray = [];
        if (bookingslot.length) {
          for (let i = 0; i < bookingslot.length; i++) {
            if (bookingslot[i].slotObject.length) {
              for (let j = 0; j < bookingslot[i].slotObject.length; j++) {
                let counsellor = bookingslot[i].slotObject[j].counsellor;
                bookingslot[i].slotObject[j].availableCounsellorPerDay = 100 - (counsellor[0].sessions_taken / counsellor[0].sessions_perday) * 100;
                bookingslot[i].slotObject[j].availableCounsellorPerMonth = 100 - (counsellor[0].sessions_taken / counsellor[0].sessions_permonth) * 100;
                bookingslot[i].slotObject[j].availableCounsellorPerYear = 100 - (counsellor[0].sessions_taken / counsellor[0].sessions_peryear) * 100;
              }
              let xValues = bookingslot[i].slotObject.map(function (o) {
                return o.availableCounsellorPerMonth;
              });
              // xValues = Array.from(bookingslot[i].slotObject, o => o.availableCounsellorPerMonth);
              let xMax = Math.max.apply(null, xValues);
              let maxXObjects = bookingslot[i].slotObject.filter(function (o) {
                return o.availableCounsellorPerMonth === xMax && o.availableCounsellorPerMonth > 0;
              });

              // objects.map(function(o) { return o.x; });
              if (maxXObjects.length) {
                slotArray.push(maxXObjects[0]);
              }
            }
          }
          return slotArray;
        }else{
          return slotArray;
        }
      })
  },

  findBookingSlotObj(booking){
    let slotObjId = booking.booking_slot;
    return this.findOne({$and: [{_id: slotObjId},{status: "Available"}]}).exec()
        .then((counsellorRes) => {
        if(counsellorRes){
          return true;
        }else{
          return false;
        }
      // let counsellor = Counsellor.updateCounsellorSession(counsellorRes.counsellor_id);
      console.log('counsellor updated not available', counsellorRes);
    })
  },

  updateBookingSlotSession(slotId, slotStatus){
    let sessionTaken = 0;
    if(slotStatus == "NotAvailable"){
      sessionTaken = 1;
    }else if(slotStatus == "Available"){
      sessionTaken = -1;
    }
    return this.findOneAndUpdate({_id: slotId}, {$set: {status: slotStatus}}).exec()
        .then((counsellorRes) => {
        let counsellor = Counsellor.updateCounsellorSession(counsellorRes.counsellor_id, sessionTaken);
        console.log('counsellor updating', counsellorRes, counsellor);
    }).catch((e) => {
      console.log(e)
    });
  },

  /**
   * List Booking Slot in descending order of 'createdAt' timestamp.
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

  getBookingSlotById(id) {
    return this.findById(id)
      .exec()
      .then((slot) => {
        if (slot) {
          return slot;
        }
        const err = new APIError(
          "No such booking slot  exists!",
          httpStatus.NOT_FOUND
        );
        return Promise.reject(err);
      });
  },
};

/**
 * @typedef Booking
 */
module.exports = mongoose.model("booking_slot", BookingSlotSchema);
