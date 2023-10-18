const _user = require("../user/user.model");
const _account = require("../account/account.model");
const onesignal = require("../oneSignal/oneSignal.model");
const BookingSlot = require("../bookingSlot/bookingSlot.model");
const Booking = require("../booking/booking.model");
const {upcoming} = require("../setting/setting.model");
const dateFormateUtils = require("./bookingDateFormatUtils");
const BookingType = require('../bookingType/bookingType.model');
const Meeting = require('../meeting/meeting.model');

const eventEnum = Object.freeze({
  cancel: "Cancel",
  booked: "Booked",
  requested: "Booking_request",
  reschedule: "Reschedule",
  noshow: "No_show",
  newregistration: "New_registration",
});

class MessageSchema {
  constructor(bookingID, event, details,rescheduleId) {
    console.log('event--->>>>>>>>',event)
    console.log('details--->>>>>>>>',details)
    // this.rescheduleId = rescheduleId;
    this.bookingID = bookingID;
    this.event = event;
    this.userid = details.user_details;
    this.bookingDetails = details;
    this.messageObj = {};
    this.messageObj.appId = details.appId[0] ? details.appId[0] : ["LEAP"];
  }

  async getSchema() {
    return new Promise(async (resolve,reject)=>{
      try {
        this.messageObj.messageExchange = 'Booking';
        this.getBookingID();
        this.getUserID();
        this.messageEvent();
        this.getNotificationClass();
        await this.getUserDetails();
        resolve(this.messageObj);
      } catch (error) {
          reject(error)
      }
    })
  }

  getBookingID() {
    this.messageObj.bookingID = this.bookingID;
  }

  getUserID() {
    this.messageObj.userID = this.userid;
  }

  async getUserDetails() {
    return new Promise(async(resolve,reject) =>{
      try {
        let accountid = await this.getaccountID(this.userid);
        let emailID = await this.getEmailID(accountid.toString());
        let phoneNumber = await this.getPhoneNumber(accountid.toString());
        let onesignal = await this.getonesignal(accountid.toString());
        let notification = await this.getuserNotificationPref(this.userid);
        let userName = await this.getName(accountid.toString());
        let bookingMode = await this.getBookingType(this.bookingDetails.booking_mode);
        // let rescheduleThreshold = await this.getThresholdLimit('reschedule_threshold');
        let reminderThreshold = await this.getThresholdLimit('bookingReminder_threshold');
        let notification_date = await dateFormateUtils(this.bookingDetails.booking_confirmedDate,"date");
        let notification_time = await dateFormateUtils(this.bookingDetails.booking_startTime,"time");
        let booking_startTime = await dateFormateUtils(this.bookingDetails.booking_startTime,"24hrs");


        // if(this.event === 'reschedule' && this.rescheduleId)
        //   this.messageObj.rescheduled_Id = this.rescheduleId;
        let pref =[];

        for ( var i=0 ;i< notification.length ; i++){
          if(notification[i].value){
            pref.push(notification[i].name)
          }
        }
        if(!emailID) pref = pref.filter(e => e !== 'Email');
        this.messageObj.emailID = emailID;
        this.messageObj.phoneNumber = phoneNumber;
        this.messageObj.pref = pref;
        this.messageObj.userName = userName;
        this.messageObj.onesignal = onesignal;
        this.messageObj.bookingDate = notification_date;
        this.messageObj.bookingTime = notification_date+' '+notification_time;
        this.messageObj.bookingDetails = this.bookingDetails;
        this.messageObj.booking_type = bookingMode;
        this.messageObj.reminderThreshold = reminderThreshold ? reminderThreshold : 15;
        // this.messageObj.rescheduleThreshold = rescheduleThreshold ? rescheduleThreshold : 24;
        this.messageObj.notification_category = "Booking";
        this.messageObj.notification_type = bookingMode;
        this.messageObj.notification_bookingtype = this.bookingDetails.booking_status;
        this.messageObj.notification_date = notification_date;
        this.messageObj.notification_time = notification_time;
        this.messageObj.booking_startTime = booking_startTime;
        if(this.bookingDetails.meeting_url)
          this.messageObj.meeting_url = await this.getURL(this.bookingDetails.meeting_url,'shorten_url');
        resolve();
        } catch (error) {
            reject(error);
        }
    })
  }

  messageEvent() {
    switch (this.event) {
      case "booked":
        this.messageObj.event = eventEnum.booked;
        break;
      case "cancel":
        this.messageObj.event = eventEnum.cancel;
        break;
      case "requested":
        this.messageObj.event = eventEnum.requested;
        break;
      case "noshow":
        this.messageObj.event = eventEnum.noshow;
        break;
      case "newregistration":
        this.messageObj.event = eventEnum.newregistration;
        break;
      case "reschedule":
        this.messageObj.event = eventEnum.reschedule;
        break;
    }
  }

  getNotificationClass() {
    this.messageObj.class = "CLASSA";
  }

  getaccountID() {
    return new Promise((resolve, reject) => {
      _user.getAccountId(this.userid)
        .then((user) => {
        console.log("MessageSchema -> getaccountID -> user", user)
          if (user && user.length !== 0) resolve(user);
          else reject("No user found");
        })
        .catch((e) => reject(e));
    });
  }

  getuserNotificationPref() {
    return new Promise((resolve, reject) => {
      _user
        .getNotificationsPref(this.userid)
        .then((user) => {
          console.log("MessageSchema -> getnotificationPref -> user", user)
          if (user && user.length !== 0) resolve(user);
          else reject("No user notification found");
        })
        .catch((e) => reject(e));
    });
  }

  getEmailID(accountid) {
    return new Promise((resolve, reject) => {
      _account
        .getEmailId(accountid)
        .then((email) => {
          if (email && email.length !== 0) resolve(email);
          else resolve();
        })
        .catch((e) => reject(e));
    });
  }

  getPhoneNumber(accountid) {
    return new Promise((resolve, reject) => {
      _account
        .getPhoneNumber(accountid)
        .then((phone) => {
          if (phone && phone.length !== 0) resolve(phone);
          else resolve("No phone number found");
        })
        .catch((e) => reject(e));
    });
  }

  getName(accountid) {
    return new Promise((resolve, reject) => {
      _account
        .getUserName(accountid)
        .then((user) => {
          if (user) resolve(user);
          else resolve("User");
        })
        .catch((e) => reject(e));
    });
  }

  getonesignal(accountid) {
    return new Promise((resolve, reject) => {
      onesignal.getOneSiganlDetails(accountid)
        .then((data) => {
          if (data) resolve(data);
          else resolve("No details found");
        })
        .catch((e) => reject(e));
    });
  }

  getBookingDate(){
    return new Promise((resolve, reject) => {
      BookingSlot.getBookingSlotById(this.bookingSlotId)
        .then((slot) => {
          console.log("getBookingSlot -> getBookingSlot -> slot", slot)
          if (slot) resolve(slot);
          else reject("No booking slot found");
        })
        .catch((e) => reject(e));
    });
  }

  getRescheduledId(id){
    return new Promise((resolve, reject) => {
      Booking.getRescheduledIdObjectId(id)
        .then((bookingId) => {
          console.log("RescheduledObjectId -> RescheduledObjectId -> Id", bookingId)
          if (bookingId) resolve(bookingId);
          else reject("No booking found");
        })
        .catch((e) => reject(e));
    });
  }

  getThresholdLimit(key){
    return new Promise((resolve, reject) => {
      upcoming.get("upcoming")
        .then((setting) => {
          console.log("setting -> setting -> setting", setting)
          if (setting) resolve(setting[0][key]);
          else resolve("");
        })
        .catch((e) => reject(e));
    });
  }

  getBookingType(id) {
    return new Promise((resolve, reject) => {
      BookingType.get(id)
        .then((type) => {
        if (type) resolve(type.type);
    else reject("No booking Mode found ");
    })
    .catch((e) => reject(e));
    });
  }

  getURL(id,key){
    return new Promise((resolve, reject) => {
      Meeting.getMeeting(id,key)
        .then((shortenURL) => {
        if (shortenURL) resolve(shortenURL);
        else resolve("");
      })
      .catch((e) => reject(e));
    });
  }

}

module.exports = MessageSchema;
