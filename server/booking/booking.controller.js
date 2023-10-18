const Booking = require("./booking.model");
const getuuid = require("../helpers/Utils");
const bookingIdUtils = require("../helpers/bookingIdUtils");
const getMongoDBID = require("../helpers/mongoDBUtils");
const request = require("request");
const Account = require("../account/account.model");
// const OneSignal = require("../oneSignal/oneSignal.model");
// const User = require("../user/user.model");
const dateFormat = require("dateformat");
// const Template = require("../template/template.model");
// const Config = require("../../config/config");
const Counsellor = require("../counsellor/counsellor.controller");
const convertArrToMongoObj = require("../helpers/mongoDBTemp");
const bookingSlotModel = require("../bookingSlot/bookingSlot.model");
const SettingCtrl = require("../setting/setting.controller");
const MeetingLink = require('./booking.meetingWrapper');

/**
 * Load booking and append to req.
 */
async function load(req, res, next, id) {
  Booking.get(id)
    .then((booking) => {
      req.booking = booking; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch((e) => next(e));
}

/**
 * Get Booking
 * @returns {Booking}
 */
function get(req, res) {
  return res.json(req.booking);
}

async function newBookingClass(req){
  let booking_Id = await bookingIdUtils();

  return new Booking({
    concern : req.body.concern
      ? getMongoDBID(req.body.concern)
      : null,
    context : req.body.context ? convertArrToMongoObj(req.body.context) : [],
    user_details: getMongoDBID(req.body.user_details),
    audio_url: req.body.audio_url,
    context_input: req.body.context_input ,
    intensity_scale: req.body.intensity_scale,
    booking_type: req.body.booking_type,
    marriage_status: req.body.marriage_status,
    created_date: req.body.created_date,
    creator_name: req.body.creator_name,
    creator_phone: req.body.creator_phone,
    booking_date: req.body.booking_date,
    booking_slot: getMongoDBID(req.body.booking_slot),
    booking_status: req.body.booking_status,
    payment_details: req.body.payment_details
      ? getMongoDBID(req.body.payment_details)
      : null,
    booking_mode: req.body.booking_mode
      ? getMongoDBID(req.body.booking_mode)
      : null,
    preferred_slots : req.body.preferred_slots,
    reschedule_counter: req.body.reschedule_counter,
    session_rating: req.body.session_rating ,
    session_feedback: req.body.session_feedback
      ? getMongoDBID(req.body.session_feedback)
      : null,
    session_location: req.body.session_location,
    meeting_url: req.body.meeting_url
      ? getMongoDBID(req.body.meeting_url)
      : null,
    booking_line_id: req.body.booking_line_id,
    session_language: req.body.session_language,
    booking_Id: booking_Id,
    counsellor_id: req.body.counsellor_id,
    suicidal_option: req.body.suicidal_option,
    source: req.body.source ,
    updatedChannel: req.body.updatedChannel ,
    appId : req.body.appId,
    booking_initaitor : req.body.booking_initaitor,
    booking_initaitor_id : req.body.booking_initaitor_id,
    is_couple : req.body.is_couple,
    is_critical : req.body.is_critical,
    risk_level : req.body.risk_level,
    counselor_type : req.body.counselor_type,
    is_new: req.body.is_new,
    type_of_session: req.body.type_of_session,
    notifyUser : true,
    rescheduleFlag : false,
    distress: req.body.distress,
    cutoff_id : req.body.cutoff_id
      ? getMongoDBID(req.body.cutoff_id)
      : null
  });
}

/**
 * Create new Booking
 * @property {string} req.body.userid - The userid of user.
 * @property {string} req.body.user_details - The userid in string.
 * @property {string} req.body.concern - The concern id string.
 * @property {array} req.body.context - The context id in array.
 * @property {string} req.body.context_input - The context input in string.
 * @property {object} req.body.audio_url - The audio details.
 * @property {string} req.body.intensity_scale - The intensity_scale.
 * @property {string} req.body.booking_type - The booking type.
 * @property {string} req.body.marriage_status - The marriage status
 * @property {date} req.body.created_date - The created date.
 * @property {string} req.body.creator_name - The creator name.
 * @property {string} req.body.creator_phone - The creator phone number.
 * @property {date} req.body.booking_date - The booking Date.
 * @property {string} req.body.booking_slot - The booking Slot details.
 * @property {string} req.body.booking_status - The booking status.
 * @property {date} req.body.last_updated - The last updated Date.
 * @property {object} req.body.payment_details - The payment details.
 * @property {number} req.body.session_rating - The session rating.
 * @property {string} req.body.session_feedback - The session feedback id.
 * @property {string} req.body.booking_Id - The booking Id auto generated.
 */
async function create(req, res, next) {
  const booking = await newBookingClass(req);
  booking
    .save()
    .then(async (savedBooking) => {
      if(req.body.suicidal_option){
        await SettingCtrl.getSuicidalOption(req.body.distress, req.body.intensity_scale, req.body.suicidal_option, req.body.user_details, req.body.appId)
      }
      res.json(savedBooking)
    })
    .catch((e) => next(e));
}

async function confirmBooking(req,res,next){
  try{
    const url = await new MeetingLink(req).sendData('create');
    req.body.meeting_url = url._id ;
    let condition = { $and :[{booking_Id: req.body.booking_Id},{booking_status: 'Requested'}]};
    const options = {new :true};
    Booking.updateBookingData(condition,req.body,options)
      .then((booking) => {
        console.log("saved Booking---->>>>>",booking)
        res.json({'booking_Id': booking.booking_Id , 'meeting_url': url.meeting_url});
    })
  .catch((error) => next(error));
  }catch(error){
    next(error)
  }
}

async function updateBooking(req,res,next){
  try{
    let data = req.body;
    data.notifyUser = false;
    data.rescheduleFlag = false;
    console.log("obeject to update-->>>>>",data)
    const options = {new :true};
    let condition = {$and :[{'user_details': req.body.user_details},{'booking_Id': req.body.booking_Id},{booking_status: 'Confirmed'}]};
    if(req.body.booking_confirmedDate && req.body.booking_startTime && req.body.booking_endTime){
       data = {booking_status: 'Reschedule',notifyUser : false, rescheduleFlag:false};
    }
    Booking.updateBookingData(condition,data,options)
      .then(async(booking) => {
        let dataObj;
        dataObj = {'booking_Id': booking.booking_Id , 'message': "Booking updated Successfully"};
        if((req.body.counsellor_Id) || (req.body.booking_confirmedDate && req.body.booking_startTime))
           dataObj= await validateUpdateFunc(req.body,booking)
        res.json(dataObj);
      })
      .catch((error) => next(error));
  }catch(error){
    next(error)
  }
}

function completeBooking(req,res,next){
  try{
    let userId = req.body.uuid?req.body.uuid : req.body.user_details;
    let condition = { $and :[{booking_Id: req.body.booking_Id},{booking_status: 'Confirmed'},{'user_details':userId}]};
    const options = {new :true};
    Booking.updateBookingData(condition,req.body,options)
      .then((booking) => {
        res.json({'booking_Id': booking.booking_Id , 'message': "Booking updated Successfully"});
    })
    .catch((error) => next(error));
  }catch(error){
    next(error)
  }
}

/**
 update cancellation booking feedback
 */
function updateFeedback(req, res, next) {
  Booking.updateBookingFeedback(req.body, req.params)
    .then((bookingFeedback) => {
      res.json(bookingFeedback);
    })
    .catch((e) => next(e));
}
/**
update cancellation booking
*/
async function cancelBooking(req, res, next) {
  
  let body = req.body;
  console.log(req.body)
  let updateObject;
  let options = {new :true};
   let condition = {$and : [{'booking_Id': req.body.booking_Id},{$or : [{'booking_status': 'Requested'},{'booking_status': 'Confirmed'}]}]};
  if (body && body.cancel_within_limit) {
    const booking_line_id = ("000" + (Number(body.booking_line_id || 1) - 1)).slice(-3);
    updateObject = {
      cancellation_reasons: body.cancellation_reasons,
      cancellation_date: body.cancellation_date,
      booking_status: body.booking_status,
      cancel_within_limit: body.cancel_within_limit,
      comments: body.comments,
      booking_line_id: booking_line_id,
      notifyUser:true,
      rescheduleFlag : false,
      
    }
  }else if(body){
    
    updateObject = {
      cancellation_reasons: body.cancellation_reasons,
      cancellation_date: body.cancellation_date,
      booking_status: body.booking_status,
      comments: body.comments,
      updatedChannel : body.updatedChannel,
      notifyUser:true,
      rescheduleFlag : false,
      
    }
  }
  
 
  Booking.updateBookingData(condition,updateObject,options)
    .then((booking) => {
      
    
    res.json(booking);
  })
  .catch((e) => next(e));

}

/**
update booking details
*/
function updateBookingDetails(req, res, next) {
  Booking.updateBookingData(req.params.Id, req.body)
    .then((booking) => {
      res.json(booking);
    })
    .catch((e) => next(e));
}

// function createMeetingLink(){
//
// }

/**
update booking details
*/
function updateBookingStatus(req, res, next) {
  Booking.bookingStatus(req.params.bookingID, req.body)
    .then((booking) => {
      res.json(booking);
    })
    .catch((e) => next(e));
}

function getBookingGroupByConcern(req, res, next) {
  Booking.bookingGroupByConcern(req.params.user_id)
    .then((concernBooking) => {
      res.json(concernBooking);
    })
    .catch((e) => next(e));
}

function getBookingGroupByConcernNames(req, res, next) {
  Booking.bookingGroupByConcernNames(req.params.user_id)
    .then((concernBooking) => {
    res.json(concernBooking);
  })
  .catch((e) => next(e));
}

function getBookingStatusSort(req, res, next){
  let statusQuery = { booking_status: { $ne: "New"}};
  Booking.getBookingStatusSort(req.params.user_id, statusQuery)
    .then((bookingData) => {
    res.json(bookingData)
  })
  .catch((e) => next(e));
}

function getBookingNewStatusSort(req, res, next){
  let statusQuery = { booking_status: "New"};
  Booking.getBookingStatusSort(req.params.user_id, statusQuery)
    .then((bookingData) => {
    res.json(bookingData)
  })
  .catch((e) => next(e));
}

function getBookingByAppId(req, res, next) {
  Booking.get(req.params)
    .then((booking) => {
    res.json(booking)
  })
  .catch((e) => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of booking to be skipped.
 * @property {number} req.query.limit - Limit number of bookings to be returned.
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Booking.list({ limit, skip })
    .then((booking) => res.json(booking))
    .catch((e) => next(e));
}

validateUpdateFunc = (data, booking) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result;
      let meetingObj;
      if(data.counsellor_Id && !data.booking_confirmedDate && !data.booking_startTime){
        console.log("When councellor is sent to update----->>>>");
        meetingObj = {'body' : booking};
        result = {'booking_Id': booking.booking_Id , 'message': "Booking updated Successfully"};
      }else if(data.booking_confirmedDate && data.booking_startTime && data.booking_endTime ){
        console.log("when requested for reschedule--->>>>>>>>>")
        let obj = {...booking};
        let mergeObj = Object.assign(obj._doc, data);
        delete mergeObj['_id'];
        mergeObj['created_date'] = new Date();
        mergeObj['booking_status'] = "Confirmed";
        mergeObj['notifyUser'] = true;
        mergeObj['rescheduleFlag'] = true;
        let condition  = {$and :[{'booking_Id':booking.booking_Id},{'booking_status':"Confirmed"}]};
        const options = { new: true , upsert : true};
          await Booking.updateBookingData(condition, mergeObj,options)
            .then((bookingData) => {
            console.log("Reschedule obj--->>>>>>>")
            meetingObj = {"body" : bookingData};
            result = {'booking_Id': bookingData.booking_Id , 'message': "Booking updated Successfully"};
        })
        .catch((e) => reject(e));

      }
      const url = await new MeetingLink(meetingObj).sendData('update');
      resolve(result)
    } catch (error) {
      reject(error);
    }
  });
};


module.exports = {
  load,
  get,
  create,
  list,
  cancelBooking,
  updateFeedback,
  updateBookingDetails,
  updateBookingStatus,
  getBookingGroupByConcern,
  getBookingGroupByConcernNames,
  getBookingNewStatusSort,
  getBookingStatusSort,
  getBookingByAppId,
  confirmBooking,
  updateBooking,
  completeBooking
};
