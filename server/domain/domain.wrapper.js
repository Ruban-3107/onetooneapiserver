const APIError = require("../helpers/APIError");
const mongoose = require("mongoose");
const httpStatus = require("http-status");
const Services = require("../feature/feature.model");
const BookingType = require("../bookingType/bookingType.model");

class domainRequestWrapper{
  constructor(req){
    this.body = req.body;
    console.log("cms Request-->>>>>>>>>>>>>")
    console.log(req.body)

  }

  async wrap(next) {
    try {
      this.body.services = await this.wrapServices();
      this.body.booking_type = await this.wrapBookingType();
      next();
    } catch (error) {
      next(error);
    }
  }

  async wrapServices(){
    return new Promise(async (resolve, reject) => {
      if (this.body.cmsdata === "true" && this.body.services) {
        const serviceId = [];
        let temp = this.body.services.split(',');
        for(let i=0;i<temp.length;i++){
          let id = await this.getService(temp[i]);
          if(id)
            serviceId.push(id);
        }
        resolve(serviceId)
      } else resolve([]);
    });

  }

  wrapBookingType(){
    return new Promise(async (resolve, reject) => {
      if (this.body.cmsdata === "true" && this.body.booking_type) {
        const bookingTypeId = [];
        let temp = this.body.booking_type.split(',');
        for(let i=0;i<temp.length;i++){
          let id = await this.getBookingType(temp[i]);
          console.log(id);
          if(id)
            bookingTypeId.push(id);
        }
        resolve(bookingTypeId)
      } else resolve([]);
    });
  }

  getService(data){
    return new Promise(async (resolve, reject) => {
      Services
        .findOne({ services: data })
        .then((services) => {
          if (services && services._id) {
            resolve(services._id);
          } else {
            console.log("No such services exists", httpStatus.NOT_FOUND);
            resolve();
          }
        })
        .catch((error) => reject(error));
    });

  }

  getBookingType(data){
    console.log("type->>>>",data)
    return new Promise(async (resolve, reject) => {
      BookingType
        .findOne({ type: data })
        .then((type) => {
          if (type && type._id) {
            console.log(type)
            resolve(type._id);
          } else {
            console.log("No such Booking type exists", httpStatus.NOT_FOUND);
            resolve();
          }
        })
        .catch((error) => reject(error));
    });

  }

}
module.exports = domainRequestWrapper;
