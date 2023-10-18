const APIError = require("../helpers/APIError");
const mongoose = require("mongoose");
const httpStatus = require("http-status");
const Concern = require("../concern/concern.model");
const Context = require("../context/context.model");
const BookingTypeModel = require("../bookingType/bookingType.model");
const User = require('../user/user.model');
const Counsellor = require('../counsellor/counsellor.model');

class bookingRequestWrapper {
  constructor(req) {
    this.body = req.body;
  }

  async wrap(next) {
    try {
      this.body.user_details = this.body.uuid ? this.body.uuid : this.body.user_details ;
      if(this.body.updatedChannel !== "App"){
        this.body.appId = [this.body.appId];
      }
      if((this.body.booking_status === 'Requested' || this.body.booking_status === 'Confirmed') && this.body.updatedChannel !== "App" ){
        this.body.booking_mode = this.body.booking_mode? await this.getBookingType():null;
        this.body.concern = this.body.concern ? await this.wrapConcern():null;
        this.body.context = this.body.context ? await this.wrapContext():null
        console.log(this.body.booking_status)
        if(this.body.booking_status === 'Confirmed'){
          this.body.counsellor_Id = await this.wrapCounsellorId();
          this.body.duration = "1"
          // this.body.duration = await this.timeDifference(this.body.booking_startTime,this.body.booking_endTime);
        }
        if(this.body.updatedChannel !== "App"){
          this.body.preferred_slots = this.body.preferred_slots ? await this.wrapPreferredDates():[];

        }
      }
      next();
    } catch (error) {
      next(error);
    }
  }

  getBookingType() {
    return new Promise(async (resolve, reject) => {
      if (this.body.updatedChannel !== "App") {
        BookingTypeModel
          .findOne({ bookingTypeId: this.body.booking_mode})
          .then((bookingType) => {
            if (bookingType && bookingType._id) {
              resolve(bookingType._id);
            } else {
              console.log("No such bookingType exists", httpStatus.NOT_FOUND);
              reject("No such bookingType exists", httpStatus.NOT_FOUND);
            }
          })
          .catch((error) => reject(error));
      } else resolve(this.body.booking_mode);
    });
  }

  wrapConcern() {
    return new Promise(async (resolve, reject) => {
      if (this.body.updatedChannel !== "App") {
        Concern
          .findOne({ concernId: this.body.concern })
          .then((concern) => {
            if (concern && concern._id) {
              resolve(concern._id);
            } else {
                console.log("No such concern exists", httpStatus.NOT_FOUND);
                reject("No such concern exists", httpStatus.NOT_FOUND);
            }
          })
          .catch((error) => reject(error));
      } else resolve(this.body.concern);
    });
  }

  wrapContext() {
    return new Promise(async (resolve, reject) => {
      if (this.body.updatedChannel !== "App") {
        if(this.body.context){
          let contextArr = [];
          let contextIds = this.body.context.split(",");
          console.log("contextIds--->>>",contextIds)
          for (let i=0;i< contextIds.length ; i++){
            Context
              .findOne({ contextId: contextIds[i] })
              .then((context) => {
              if (context && context._id) {
              contextArr.push(context._id);
            }
          })
          .catch((error) => reject(error));
          }
          resolve(contextArr)
        }
      } else resolve(this.body.context);
    });
  }

  wrapPreferredDates() {
    return new Promise(async (resolve, reject) => {
      if (this.body.updatedChannel !== "App") {
        let dateArr =[];
        let dates = this.body.preferred_slots.split(",");
        for (let i=0; i< dates.length;i++){
          dateArr.push({'dateTime':dates[i]})
        }
        resolve(dateArr)
      } else resolve(this.body.preferred_slots);
    });
  }


  wrapCounsellorId() {
    return new Promise(async (resolve, reject) => {
      if (this.body.updatedChannel !== "App") {
        Counsellor
          .findOne({counsellor_id: this.body.counsellor_Id})
          .then((counsellor) => {
          if (counsellor && counsellor._id) {
            resolve(counsellor._id);
          }else {
              console.log("No such counsellor exists", httpStatus.NOT_FOUND);
              reject("No such counsellor exists", httpStatus.NOT_FOUND);
          }
        })
        .catch((error) => reject(error));
      } else resolve();
    });
  }

  timeDifference(startTime,endTime) {
    let start = new Date(startTime);
    let end = new Date(endTime);
    let difference = end - start ;
    return Math.floor(difference/60e3);
  }

}
module.exports = bookingRequestWrapper;
