const booking_slot = require('./bookingSlot.model');
const BookingSlotQuery = require('./bookingSlot.query');
const booking = require('../booking/booking.model');
const _user = require('../user/user.model');
const SettingModel = require("../setting/setting.model");

/**
 * Load Booking Slot and append to req.
 */
async function load(req, res, next, id) {
  try {
    let indiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    let temp = new Date(id);
    year = temp.getFullYear();
    month = temp.getMonth() + 1;
    dt = temp.getDate();
    if (dt < 10) {
      dt = '0' + dt;
    }
    if (month < 10) {
      month = '0' + month;
    }
    let date = dt + '-' + month + '-' + year;

    let query = {};
    query = {date: date}
    if (temp.getDate() == new Date(indiaTime).getDate()) {
      let thresholdTime = new Date(indiaTime);
      let condition;
      if(req.body.appId && req.body.appId.length){
        condition =  {$and: [{screen: "upcoming"},{appId: {$in: req.body.appId[0]}}]}
      }else{
        condition = {$and : [{screen:"upcoming"}, {$or: [{appId: {$exists: false}}, {appId: {$nin: ["LEAP"]}}]}]};
      }
      await SettingModel.upcoming.find(condition).then((data)=>{
        let threshold = 0;
        if(data.length){
          threshold = data[0].bookingSlot_threshold ? data[0].bookingSlot_threshold : 0 ;
        }
        thresholdTime.setHours(thresholdTime.getHours() + threshold);
      });
      time = new Date(thresholdTime).toTimeString().split(' ')[0];
      let dateTime = dt + '-' + month + '-' + year + ' ' + time;
      query = {date: date, start_time: {'$gte': dateTime}, end_time: {'$gte': dateTime}}
    }

    let concern = req.body.concern;
    let context = req.body.context;
    let mode = req.body.mode;
    let location = req.body.location;
    let gender = req.body.gender;
    let language = req.body.language;
    let genderPreference = false;
    let languagePreference = false;
    let user_id = req.body.user_id;
    let booking_Id = req.body.booking_Id;
    let appId = req.body.appId;

    let slotClass = await new BookingSlotQuery(mode, concern, context, date, gender, language, location);
    let userDetails = await slotClass.getUserDetails(user_id);
    let queryMatch = [query];
    let counsellorFilter = [];

    if(appId && appId.length){
      counsellorFilter = [{"counsellor.concerns": concern}];
      if(mode){
        counsellorFilter.push({"counsellor.mode": mode});
      }
      if(context && context.length){
        counsellorFilter.push({"counsellor.contexts":{'$in':context}});
      }

      if (booking_Id) {
        queryMatch = [{'user_id': user_id}, {"booking_Id": booking_Id}];
        //find in booking previous counsellor
        let bookingRes = [];
        // bookingRes = await booking.getBookingbyBookingId(queryMatch);
        // booking.find({$and : [{'user_id': user_id},{"booking_Id": booking_Id},{"booking_status": "Completed"}]}).then((bookingRes) => {
        if (bookingRes.length) {
          //get booking slot
          queryMatch = [query];
          let bookingSlot = await slotClass.getBookingSlot(queryMatch, counsellorFilter);
          if (bookingSlot.length == 1) {
            req.bookingSlot = bookingSlot;
            return next();
          } else if (bookingSlot.length > 1) {
            counsellorFilter = await filterSlot(genderPreference, languagePreference, mode, gender, language, location, date);
            let filterSlots = await slotClass.getSlot(queryMatch, counsellorFilter, appId);
            req.bookingSlot = filterSlots; // eslint-disable-line no-param-reassign
            return next();
          } else {
            //bookingSlot.length == 0
            // req.bookingSlot = bookingSlot;
            // return next();
            counsellorFilter = await filterSlot(genderPreference, languagePreference, mode, gender, language, location, date);
            let filterSlots = await slotClass.getSlot(queryMatch, counsellorFilter, appId);
            req.bookingSlot = filterSlots;
            return next();
          }
        } else {
          counsellorFilter = await filterSlot(genderPreference, languagePreference, mode, gender, language, location, date, counsellorFilter);
          queryMatch = [query];
          let filterSlots = await slotClass.getSlot(queryMatch, counsellorFilter, appId);
          req.bookingSlot = filterSlots;
          return next();
        }
        // })
      } else {
        counsellorFilter = await filterSlot(genderPreference, languagePreference, mode, gender, language, location, date, counsellorFilter);
        let filterSlots = await slotClass.getSlot(queryMatch, counsellorFilter, appId);
        req.bookingSlot = filterSlots;
        return next();
      }
    }else{
      counsellorFilter = await filterSlot(genderPreference, languagePreference, mode, gender, language, location, date);
      let filterSlots = await slotClass.getSlot(queryMatch, counsellorFilter);
      req.bookingSlot = filterSlots;
      return next();
    }
  }catch (err){
    console.log(err);
  }
}

/**
 * Get Booking Slot
 * @returns {bookingSlot}
 */
function get(req, res) {
  return res.json(req.bookingSlot);
}

async function filterSlot(genderPreference, languagePreference, mode, gender, language, location, dateParam, counsellorFilter) {
  if(!counsellorFilter || !counsellorFilter.length)
    counsellorFilter = [];
  try {
    if(genderPreference){
      counsellorFilter.push({"counsellor.gender": gender})
    }
    if(languagePreference){
      counsellorFilter.push({"counsellor.language": language})
    }
    // if(mode == "Visit"){
    //   counsellorFilter.push({"counsellor.location": location})
    // }
    return counsellorFilter; // eslint-disable-line no-param-reassign
  } catch (err){
    console.log(err);
  }
}

async function getSlots(req,res,next) {
  let id = req.params.date;
  let appId = req.params.appId;
  let indiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
  let temp = new Date(id);
  year = temp.getFullYear();
  month = temp.getMonth()+1;
  dt = temp.getDate();
  // time = new Date(indiaTime).toTimeString().split(' ')[0];
  if (dt < 10) {
    dt = '0' + dt;
  }
  if (month < 10) {
    month = '0' + month;
  }

  let date = dt+'-' + month + '-'+year;
  // let dateTime = dt+'-' + month + '-'+year+ ' ' +time;
  let condition=[];
  let query;
  query ={date:date};
  if(temp.getDate() == new Date(indiaTime).getDate()){
    let thresholdTime = new Date(indiaTime);
    let thresholdCondition =  {$and: [{screen: "upcoming"},{appId: {$in: req.body.appId}}]}
    await SettingModel.upcoming.find(thresholdCondition).then((data)=>{
      let threshold = 0;
      if(data.length){
        threshold = data[0].bookingSlot_threshold ? data[0].bookingSlot_threshold : 0 ;
      }
      thresholdTime.setHours(thresholdTime.getHours() + threshold);
    });
    time = new Date(thresholdTime).toTimeString().split(' ')[0];
    let dateTime = dt + '-' + month + '-' + year + ' ' + time;
    query = {date: date, start_time: {'$gte': dateTime}, end_time: {'$gte': dateTime}}
  }

  condition.push(query)
  if(appId)
    condition.push({appId: {$in: ["LEAP"]}});
    let cond = {$and : condition};

    booking_slot.find(cond)
      .populate("booking_type")
      .sort({createdAt: 1})
      .then((bookingSlot) => {
          res.json(bookingSlot)
    })
    .catch(e => next(e));

}

async function getCounsellorSlot(req, res, next) {
  let genderPreference = req.body.genderPreference;
  let languagePreference = req.body.languagePreference;
  let mode = req.body.mode;
  let gender = req.body.gender;
  let language = req.body.language;
  let location = req.body.location;
  let slotDateTime = req.params.slotDateTime;

  let counsellorFilter = await filterSlot(genderPreference, languagePreference, mode, gender, language, location, slotDateTime);
  let dataFilter = req.body;
  // filter()
  booking_slot.getTimeSlots(dataFilter, slotDateTime, counsellorFilter)
    .then(slots => {
      res.json(slots);
    })
.catch(e => next(e));
}

/**
 * Create new Booking Slot
 * @property {string} req.body.type - The type of the booking
 * @returns {Booking}
 */
function create(req, res, next) {
  const bookingSlot = new booking_slot({
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    time_of_day: req.body.time_of_day,
    date: req.body.date,
    booking_type: req.body.booking_type,
    price: req.body.price,
    location: req.body.location,
    address: req.body.address ? req.body.address : "",
    counsellor_id: req.body.counsellor_id,
    appId: req.body.appId ? req.body.appId : []
  });

  bookingSlot.save()
    .then(savedBooking => res.json(savedBooking))
    .catch(e => next(e));
}

/**
 * Get Booking Slot list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  booking_slot.list({ limit, skip })
    .then(bookingSlot => res.json(bookingSlot))
    .catch(e => next(e));
}

module.exports = { load, get, create, list, getCounsellorSlot, filterSlot,getSlots};
