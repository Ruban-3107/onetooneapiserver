booking_slot = require('./bookingSlot.model');
const Booking = require('../booking/booking.model');
const _user = require('../user/user.model');

class getSlotFilter {
    constructor(mode, concern, context, date, gender, language, location) {
      this.mode = mode;
      this.concern = concern;
      this.context = context;
      this.date = date;
      this.gender = gender;
      this.language = language;
      this.location = location;
      this.slotObj = Object.create({});
    }

    getSlot(matchQuery, counsellorFilter, appId){
      return new Promise((resolve, reject) =>{
        booking_slot.getSlotFilter(matchQuery, counsellorFilter, appId)
          .then((bookingSlot) => {
          if(bookingSlot.length){
            resolve(bookingSlot)
          }else{
            if(counsellorFilter.length > 1){
              counsellorFilter.pop();
              resolve(this.getSlot(matchQuery, counsellorFilter, appId))
            }else{
              resolve(bookingSlot)
            }
          }
        })
        .catch(e => reject(e));
      })
    }

    async getBookingSlot(matchQuery, counsellorFilter) {
      return new Promise((resolve, reject) =>{
        booking_slot.getSlotFilter(matchQuery, counsellorFilter)
        .then((bookingSlot) => {
            if(bookingSlot.length){
            resolve(bookingSlot)
          }else{
            // getBookingSlot()
            resolve(bookingSlot);
          }
        })
        .catch(e => reject(e));
      })
    }

    getUserDetails(userID){
      return new Promise((resolve,reject) =>{
        _user.getUserDetails(userID)
        .then((user) => {
          if(user.length !== 0)
            resolve(user);
          else
            reject("User not found")
        })
        .catch(e => reject(e));
      })
    }

  getBooking(matchQuery) {
    matchQuery = {$and : matchQuery}
    return new Promise((resolve, reject) =>{
      Booking.find(matchQuery)
          .then((booking) => {
          console.log("booking ->", booking);
        resolve(booking);
      })
      .catch(e => reject(e));
    })
  }

}

module.exports = getSlotFilter;
