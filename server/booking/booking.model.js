
const Promise = require("bluebird");
const mongoose = require("mongoose");
const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");
const Schema = mongoose.Schema;
const request = require("request");
const MessageSchema = require("../helpers/mesageschema");
const MessageQueue = require("../../config/messagequeue");
const bookingDataToCMS = require("./booking.cmsData");
const idvalidator = require('mongoose-id-validator');
const MeetingLink = require('./booking.meetingWrapper');

/**
 * Booking Schema
 */
const BookingSchema = new mongoose.Schema({
  user_details: {
    type: Schema.Types.ObjectId,
    ref: "_user"
  },
  booking_Id: {
    type: String,
    required: true
  },
  booking_line_id: {
    type: String,
    required: true
  },
  booking_mode: {
    type: Schema.Types.ObjectId,
    ref: "booking_type"
  },
  concern: {
    type: Schema.Types.ObjectId,
    ref: "master_concern",
    required: false
  },
  context: [
    {
      type: Schema.Types.ObjectId,
      ref: "master_context",
      required: false
    }
  ],
  preferred_slots : [{
    dateTime : String
  }],
  booking_status: {
    type: String,
    required: true
  },
  context_input: {
    type: String
  },
  session_topic: {
    type: String
  },
  session_language: {
    type: String
  },
  booking_type :{
    type: String
  },
  audio_url: [
    {
      url: { type: String },
      file_name: { type: String },
      duration: { type: String },
      created_date: { type: Date, default: Date.now }
    }
  ],

  intensity_scale: {
    type: String,
    required: false
  },

  marriage_status: {
    type: String
  },
  reschedule_counter: {
    type: Number,
    default: 0
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  creator_name: {
    type: String
  },
  creator_phone: {
    type: Number,
    required: false
  },

  booking_confirmedDate: {
    type: Date
  },

  booking_startTime: {
    type: Date
  },
  booking_endTime: {
    type: Date
  },
  duration :{
    type : Number
  },

  session_location: {
    type: String
  },
  session_rating: {
    type: Object
  },
  session_feedback: {
    type: Schema.Types.ObjectId,
    ref: "_feedback"
  },
  meeting_url: {
    type: Schema.Types.ObjectId,
    ref: "_meeting"
  },
  payment_details: {
    type: Schema.Types.ObjectId,
    ref: "_payment"
  },
  cancellation_reasons: {
    type: String
  },
  cancellation_date: {
    type: Date
  },
  cancellation_threshold: {
    type: Number
  },
  add_to_calender: {
    type: Boolean,
    default: false
  },
  comments: {
    type: String
  },
  suicidal_option: {
    type: String
  },
  cmsData: {
    type: Boolean
  },
  counsellor_Id: {
    type: Schema.Types.ObjectId,
    ref: '_counsellor'
  },
  source:{
    type: String
  },
  updatedChannel : {
    type: String,
    required : true
  },
  appId: {
    type: Array
  },
  booking_initaitor :{
    type : String
  },
  booking_initaitor_id : {
    type : String
  },
  is_couple :{
    type : Boolean,
    default: false
  },
  is_critical :{
    type : Boolean,
    default: false
  },
  risk_level :{
    type : String,
    default: "none"
  },
  counselor_type :{
    type : String
  },
  cutoff_id : {
    type : Schema.Types.ObjectId,
    ref : '_cutoff_time'
  },
  is_new: {
    type : Boolean
  },
  type_of_session: {
    type: String
  },
  notifyUser: {
    type: Boolean
  },
  rescheduleFlag :{
    type: Boolean
  },
  distress: [{
    distress_name : {type: String},
    suicidal_risk : {type: String},
    intensityScale: {type: Number}
  }]
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

BookingSchema.plugin(idvalidator);


/**
 * Methods
 */
BookingSchema.method({});

/**
 * Message will be fired on succesful database entry .
 */

BookingSchema.post("save", async (doc, next) => {
  if(doc.notifyUser){
    try {
      let messagebroker = new MessageQueue();
      await messagebroker.connect();
      let bookingStatus;
      if (doc.booking_status === "Requested") bookingStatus = "requested";
      let message = new MessageSchema(doc._id, bookingStatus, doc);
      message = await message.getSchema();
      messagebroker.send(JSON.stringify(message));
      next();
    } catch (error) {
      console.log("get -> error", error);
      next();
    }
  }else next()
});

BookingSchema.post("save", async (doc, next) => {
  if (doc.updatedChannel === 'App') {
    try {
      //Handle populate error
      // let populatedDocument = doc.populate("booking_slot").execPopulate();

      let  bookingDocument =
        doc
          .populate("context")
          .populate("concern")
          .populate("booking_mode")
          .execPopulate()
          .then(async(doc) => {
            let data = await new bookingDataToCMS(doc).send('booking');
            /**Saving to mongoDB currently not working.I have posted a question .Should try different approach later */
          });

      next();
    } catch (error) {
      console.log("get -> error", error);
      next(error);
    }
  } else next();
});

BookingSchema.post("findOneAndUpdate", async function (doc, next) {
  if(doc.notifyUser){
    try {
      let messagebroker = new MessageQueue();
      await messagebroker.connect();
      let message;
      let event;
      let temp;
      if (doc.booking_status === 'Cancelled'){
        event = 'cancel';
        if(doc.meeting_url){
          console.log("meeting_url:))))))))))))))))"+doc.meeting_url)
          let body=Object.assign(doc);
          let temp;
          temp={body};
  
          await new MeetingLink(temp).sendData(event);

        }
      }
      // if (doc.booking_status === 'Cancelled')event = "cancel";
      if (doc.booking_status === 'Confirmed')event = "booked";
      if (doc.booking_status === 'Confirmed' && doc.rescheduleFlag)event = "reschedule";
      message = new MessageSchema(doc._id,event, doc);
      message = await message.getSchema();
      messagebroker.send(JSON.stringify(message));
      next();
    } catch (error) {
      console.log("get -> error", error);
      next(error);
    }
  }else next();
});


BookingSchema.post("findOneAndUpdate", async (doc, next) => {
  if (doc.updatedChannel === 'App') {
    try {
      let data = await new bookingDataToCMS(doc).send('cancel');

    } catch (error) {
      console.log("get -> error", error);
      next(error);
    }
  } else next();
});

/**
 * Statics
 */
BookingSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    let query = {$and: [{ user_details: id.userId }, { booking_status: { $ne: "Reschedule" } },{appId: {$in: id.appId}}]};

    return (
      this.find(query)
        .populate("user_details")
        .populate("concern")
        .populate("context")
        .populate("session_feedback")
        .populate("booking_slot")
        .populate("meeting_url")
        .populate("booking_mode")
        .populate({
          path: "concern",
          populate: {
            path: "service"
          }
        })
        .exec()
        .then((booking) => {
          if (booking) {
            return booking;
          }
          const err = new APIError(
            "No such booking exists!",
            httpStatus.NOT_FOUND
          );
          return Promise.reject(err);
        })
    );
  },


  /**
   * Update a booking for feedback.
   * @param {string} id - Booking id of the booking for feedback.
   * @property {string} - req.body.session_feedback booking session feedback.
   * @property {number} - req.body.session_rating booking session rating.
   */
  updateBookingFeedback(body, bookingId) {
    return this.update(
      { _id: bookingId.Id },
      {
        session_feedback: body.session_feedback,
        session_rating: body.session_rating,
      },
      { new: true }
    )
      .exec()
      .then((bookingFeedback) => {
        if (bookingFeedback) {
          return bookingFeedback;
        }
        const err = new APIError(
          "No such booking exists!",
          httpStatus.NOT_FOUND
        );
        return Promise.reject(err);
      });
  },

  getBookingbyBookingId(id) {
    return this.findOne({
        $and: [{ booking_Id: id }, { booking_status: "Requested" }]
      })
        .exec()
        .then((booking) => {
        if (booking) {
          return booking;
        }
        const err = new APIError(
          "No such booking exists!",
          httpStatus.NOT_FOUND
        );
      return Promise.reject(err);
    });
  },

  getBookingMongoIdByBookingId(id , condition) {
    
    return this.findOne({
        $and: [{ booking_Id: id }, condition]
      })
        .exec()
        .then((booking) => {
        if (booking) {
          return booking._id;
        }
        const err = new APIError(
          "No such booking exists!",
          httpStatus.NOT_FOUND
        );
    return Promise.reject(err);
  });
  },

  bookingGroupByConcern(user_id){
      return this.aggregate([{$match: {$and: [{"user_id": mongoose.Types.ObjectId(user_id)},{"booking_status": {$ne: 'New'}},{"booking_status": {$ne: 'Reschedule'}}]}},
        {
          $lookup: {
            from: "_users",
            localField: "user_details",
            foreignField: "_id",
            as: "user_details"
          }
        },
        {
          $lookup: {
            from: "booking_slots",
            localField: "booking_slot",
            foreignField: "_id",
            as: "booking_slot"
          }
        },
        {
          $lookup: {
            from: "_concerns",
            localField: "concern",
            foreignField: "_id",
            as: "concern"
          }
        },
        {
          $lookup: {
            from: "_contexts",
            localField: "context",
            foreignField: "_id",
            as: "context"
          }
        },
        {
          $unwind: {
            path: "$concern",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "_services",
            localField: "concern.service",
            foreignField: "_id",
            as: "concern.service"
          }
        },
        {
          $unwind: {
            path: "$booking_slot",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "booking_types",
            localField: "booking_slot.booking_type",
            foreignField: "_id",
            as: "booking_slot.booking_type"
          }
        },
        {"$group": {_id: "$concern", bookingDetails: {$first: '$$ROOT'}}},
        {$sort: { created_date: -1 }},
      ]).exec();
  },

  bookingGroupByConcernNames(user_id){
    return this.aggregate([{$match: {$and: [{"user_id": mongoose.Types.ObjectId(user_id)},{"booking_status": {$ne: 'New'}}]}},
      {"$group": {_id: "$concern"}},
      {
        $lookup: {
          from: "_concerns",
          localField: "_id",
          foreignField: "_id",
          as: "concern"
        }
      },
    ]).exec()
  },

  getBookingStatusSort(id, statusQuery){
    return (
      this.find({
        $and: [{ user_id: id }, statusQuery],
      }).sort({ created_date: -1 })
        .populate("user_details")
        .populate("concern")
        .populate("context")
        .populate("session_feedback")
        .populate("booking_slot")
        .populate("meeting_url")
        .populate({
          path: "concern",
          populate: {
            path: "service",
          },
        })
        .populate({
          path: "booking_slot",
          populate: {
            path: "booking_type",
          },
        })
        .exec()
        .then((booking) => {
        if (booking) {
          return booking;
        }
        const err = new APIError(
          "No such booking exists!",
          httpStatus.NOT_FOUND
        );
      return Promise.reject(err);
    })
  );
  },

  /**
   * List bookings in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of bookings to be skipped.
   * @param {number} limit - Limit number of bookings to be returned.
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  /**
   * Update a booking for Reschedule.
   * @param {string} id - Booking id of the booking for reschedule.
   */
  updateBooking(id) {
    return this.update(
      { booking_Id: id, booking_status: "New" },
      { $set: { booking_status: "Reschedule" } }
    )
      .exec()
      .then((booking) => {
        if (booking) {
          return booking;
        }
        const err = new APIError(
          "No such booking exists!",
          httpStatus.NOT_FOUND
        );
        return Promise.reject(err);
      });
  },

  bookingStatus(id, body) {
    return this.update(
      { booking_Id: id, booking_status: "New"},
      { $set: { booking_status:  body.booking_status} }
    )
      .exec()
      .then((booking) => {
        if (booking.n == 1) {
          return booking;
        }
        const err = new APIError(
          "No such booking exists!",
          httpStatus.NOT_FOUND
        );
        return Promise.reject(err);
      });
  },

  // get booking by user and booking id
  getBookingbyUserIdBookingId(matchQuery) {
    return this.find(matchQuery)
        .exec()
        .then((response) => {
        if (response && response.length) {
        return response;
      }
      const err = new APIError(
        "No such booking exists!",
        httpStatus.NOT_FOUND
      );
      return Promise.reject(err);
    })
  },


  getRescheduledIdObjectId(id) {
    return mongoose.model('_booking').find({ $and :[{booking_Id: id},{booking_status: 'Reschedule'}]})
      .exec()
      .then((response) => {
        if (response && response.length) {
          return response[response.length - 1]._id;
        }
        const err = new APIError(
          "No such booking exists!",
          httpStatus.NOT_FOUND
        );
        return Promise.reject(err);
      });
  },

  updateBookingData(condition, data,options) {
    return this.findOneAndUpdate(condition,data,options)
      .exec()
      .then((response) => {
        if (response) {
          return response;
        }
        const err = new APIError(
          "No such booking exists!",
          httpStatus.NOT_FOUND
        );
      return Promise.reject(err);
    });
  },

  getBookingById(id) {
    return this.findById(id)
      .exec()
      .then((response) => {
        if (response) {
          return response;
        }
        const err = new APIError(
          "No such booking exists!",
          httpStatus.NOT_FOUND
        );
      return Promise.reject(err);
    });
  },

  updateByBookingMongoId(id,obj){
    return this.findByIdAndUpdate(id, obj)
      .exec()
      .then((response) => {
        if (response){
          return response ;
        }
        const err = new APIError(
          "No such booking exists!",
          httpStatus.NOT_FOUND
        )
      })
  }

};

/**
 * @typedef Booking
 */
module.exports = mongoose.model("_booking", BookingSchema);