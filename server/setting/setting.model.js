const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const { date } = require('joi');
const Schema = mongoose.Schema;

/**
 * Setting Schema
 */
const SettingUpcomingSchema = new mongoose.Schema({
  screen: {
    type: String,
    required: true
  },
  display_maps: {
    type: Boolean
  },
  reschedule_limits: {
    type: Number
  },
  reschedule_threshold: {
    type: Number
  },
  cancellation_threshold: {
    type: Number
  },
  distress_threshold: {
    type: Number
  },
  total_sessions:{
    type: Number
  },
  appId:{
    type: Array
  },
  booking_threshold: {
    type: Number
  },
  bookingId_name : {
    type: String
  },
  bookingId_sequence: {
    type: Number,
    required: true
  },
  bookingSlot_threshold: {
    type: Number
  },
  bookingReminder_threshold: {
    type : Number
  }
});

const SettingProfileSchema = new mongoose.Schema({
  screen: {
    type: String,
    required: true
  },
  age_limit: {
    type: Boolean,
  },
  gender_option: {
    type: Array,
  },
  relationship_status: {
    type: Array,
  },
  interest: {
    type: Array,
  },
  appId:{
    type: Array
  }
});

const SettingBookingSchema = new mongoose.Schema({
  screen: {
    type: String,
    required: true
  },
  contents: [{
    type: Object
  }],
  feedback: [{
    type: Object
  }],
  cancellation_reason: {
    type: Array
  },
  location: [{
    type: Object
  }],
  distress_questionnaire: [{
    type: Object
  }],
  distress_scale: [{
    type: Object
  }],
  appId:{
    type: Array
  }
});
const SettingHamburgerSchema = new mongoose.Schema({
  screen: {
    type: String,
    required: true
  },
  options: [{
    image: String,
    name: String
  }],
  appId:{
    type: Array
  }
});

const SettingAboutSchema = new mongoose.Schema({
  screen: {
    type: String,
    required: true
  },
  data: {
    type: String,
  },
  appId:{
    type: Array
  }
});

const SettingHelpSchema = new mongoose.Schema({
  screen: {
    type: String,
    required: true
  },
  email: {
    type: String,
  },
  phone: {
    type: Number,
  },
  appId:{
    type: Array
  }
});

const SettingFAQSchema = new mongoose.Schema({
  screen: {
    type: String,
    required: true
  },
  like_selected: {
    type: String
  },
  like_unSelected: {
    type: String
  },
  dislike_selected: {
    type: String
  },
  dislike_unSelected: {
    type: String
  },
  options: [{
    type:{type:String},
    data: [{
      name: {type:String},
      value:{type:String},
      like: {type: Object},
      dislike: {type: Object}
    }]
  }],
  appId:{
    type: Array
  }
});

const SettingPermissionSchema = new mongoose.Schema({
  screen: {
    type: String,
    required: true
  },
  options: [{
    type:{type:String},
    data: [{
    name: {type:String},
    value:{type:Boolean}
    }]
  }],
  appId:{
    type: Array
  }
});

const SettingMyDiaryFirstScreen = new mongoose.Schema({
  screen: {type: String,
    required: true},
  title: {type: String},
  cards: [{
          image: {type: String},
          contant: {type: String}
      }],
  quote: {
      author: {type: String},
      quote: {type: String},
      note: {type: String}
  },
  button: {type: String},
  created_date: {type: Date,
    default: Date.now},
  last_updated: {type: Date,
    default: Date.now},
  appId:{
    type: Array
  }
})

const SettingMyDiaryEmojiQuestion = new mongoose.Schema({
  screen: {type: String,
    required: true},
  question_emoji: [{
    emoji: {type: String},
    question: [{type: String}],
    rate:{type:Number}
  }],
  created_date: {type: Date,
    default: Date.now},
  last_updated: {type: Date,
    default: Date.now},
  appId:{
    type: Array
  }
})

const SettingRocheConfig = new mongoose.Schema({
  screen: {type: String,
    required: true},
  FAQ_email: {type: String},
  booking_email: {type: String},
  language: [{type: Object}],
  appId:{
    type: Array
  },
  distress_phone: {type: Number}
})

const SettingRocheLoginCarousel = new mongoose.Schema({
  screen: {type: String,
    required: true},
  details: [{type: Object}],
  appId:{
    type: Array
  }
})

const SettingLeapLoginPage = new mongoose.Schema({
  screen: {type: String,
    required: true},
  details: [{type: Object}],
  appId:{
    type: Array
  }
})

const SettingHomeFirstScreen = new mongoose.Schema({
  screen: {type: String,
    required: true},
  details: {type: Object},
  appId:{
    type: Array
  }
})


const SettingLeapHomeFirstScreen = new mongoose.Schema({
  screen: {type: String,
    required: true},
  details: {type: Object},
  appId:{
    type: Array
  }
})

const SettingHomeSecondScreen = new mongoose.Schema({
  screen: {type: String,
    required: true},
  details: {type: Object},
  appId:{
    type: Array
  }
})

const SettingRocheBookingHomepage = new mongoose.Schema({
  screen: {type: String,
    required: true},
  details: {type: Object},
  appId:{
    type: Array
  }
})

const SettingLeapProfileHomePage = new mongoose.Schema({
  screen: {type: String,
    required: true},
  details: {type: Object},
  appId:{
    type: Array
  }
})

const SettingRocheAssessmentHomepage = new mongoose.Schema({
  screen: {type: String,
    required: true},
  details: {type: Object},
  appId:{
    type: Array
  }
})

const SettingAppVersionDetails = new mongoose.Schema({
  screen: {type: String,
    required: true},
  details: {type: Object},
  appId:{
    type: Array
  },
  created_date: { type: Date, default: Date.now }
})

const SettingNPSFeedbackSchema = new mongoose.Schema({
  screen: {
    type: String,
    required: true
  },
  like_about_options: {
    type: Array
  },
  area_of_improval: {
    type: Array
  },
  appId:{
    type: Array
  }
});

const SettingFeelingTodaySchema = new mongoose.Schema({
  screen: {
    type: String,
    required: true
  },
  feeling_questionnaire: [{
    type: Object
  }],
  appId: {
    type: Array
  }
});

const SettingProfilePersonalisingTransitionDetails = new mongoose.Schema({
  screen: {
    type: String,
    required: true
  },
  details: {
    type: Object
  },
  appId:{
    type: Array
  },
  created_date: { type: Date, default: Date.now }
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
SettingUpcomingSchema.method({
});

/**
 * Statics
 */
SettingUpcomingSchema.statics = {
//   /**
//    * Get user
//    * @param {ObjectId} id - The objectId of user.
//    * @returns {Promise<User, APIError>}
//    */
  get(params) {
    let query = {};
    let screen = "";
    if(params.appId){
      screen = params.screen;
      query = {$and : [{screen:screen},{appId: {$in : params.appId}}]};
    }else{
      screen = params;
      query = {$and : [{screen:screen}, {$or: [{appId: {$exists: false}}, {appId: {$nin: ["LEAP"]}}]}]};
    }
    return this.find(query)
    .exec()
      .then((setting) => {
        if (setting.length) {
          setting = JSON.parse(JSON.stringify(setting));
          if(screen == "home_firstScreen" && setting[0].details && setting[0].details.carousel && setting[0].details.carousel.length){
            let carousel = [];
            let video_carousel = [];
            for(var i=0; i< setting[0].details.carousel.length; i++){
              if (setting[0].details.carousel[i].status) {
                carousel.push(setting[0].details.carousel[i]);
              }
            }
            setting[0].details.carousel = carousel;
            if(setting[0].details.video_carousel && setting[0].details.video_carousel.length){
              for(var i=0; i< setting[0].details.video_carousel.length; i++){
                if (setting[0].details.video_carousel[i].status) {
                  video_carousel.push(setting[0].details.video_carousel[i]);
                }
              }
              setting[0].details.video_carousel = video_carousel;
            }
          }
          return setting;
        }
        const err = new APIError('No such setting line exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
    });
  },

  updateUpcoming(screen, setting) {
    return this.updateOne({'screen' :screen}, setting)
    .exec()
        .then((settings) => {
        if (settings) {
          return settings;
        }
        const err = new APIError('failed', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },

  list(params, { skip = 0, limit = 50 } = {}) {
    let query = {};
    if(params && params.appId && params.appId.length){
      query = {appId: {$in : params.appId}};
    }else{
      query = {$or: [{appId: {$exists: false}}, {appId: {$nin: ["LEAP"]}}]};
    }
    return this.find(query)
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

SettingBookingSchema.statics = {
  get(id) {
    return this.find({screen:id})
    .exec()
      .then((setting) => {
        if (setting) {
          return setting;
        }
        const err = new APIError('No such setting line exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
    });
  },

  getNewBookingSettings(id) {
    return this.find({screen:id})
        .exec()
        .then((setting) => {
        if (setting) {
          return setting;
        }
        const err = new APIError('No such setting line exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },

  updateNewBooking(screen, setting) {
    let query = {};
    if(setting.appId && setting.appId.length){
      query = {$and: [{"screen": screen},{"appId": {$in: setting.appId}}]}
    }else{
      query = {$and : [{screen:screen}, {$or: [{appId: {$exists: false}}, {appId: {$nin: ["LEAP"]}}]}]}
    }
    return this.updateOne(query, setting,{ new: true })
    .exec()
        .then((settings) => {
        if (settings) {
          return settings;
        }
        const err = new APIError('failed', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },

  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

SettingProfileSchema.statics = {
  updateProfileSetup(screen, setting) {
    return this.updateOne({'screen' :screen}, setting,{ new: true })
    .exec()
        .then((settings) => {
        if (settings) {
          return settings;
        }
        const err = new APIError('failed', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
};

SettingHamburgerSchema.statics = {
  updateHamburger(screen, setting) {
    let thisData = this;
    return updateOneQuery(thisData, screen, setting)
  }
};

SettingAboutSchema.statics = {
  updateAbout(screen, setting) {
    let thisData = this;
    return updateOneQuery(thisData, screen, setting)
  }
};

SettingHelpSchema.statics = {
  updateHelp(screen, setting) {
    let thisData = this;
    return updateOneQuery(thisData, screen, setting)
  }
};

SettingFAQSchema.statics = {
  updateFAQ(screen, setting) {
    let thisData = this;
    return updateOneQuery(thisData, screen, setting)
  }
};

SettingPermissionSchema.statics = {
  updatePermission(screen, setting) {
    let thisData = this;
    return updateOneQuery(thisData, screen, setting)
  }
};

SettingMyDiaryFirstScreen.statics = {
  updateMyDiaryFirstScreen(screen, setting) {
    let thisData = this;
    setting.last_updated = new Date();
    return updateOneQuery(thisData, screen, setting)
  }
}

SettingMyDiaryEmojiQuestion.statics = {
  updateMyDiaryEmojiQuestion(screen, setting) {
    let thisData = this;
    setting.last_updated = new Date();
    return updateOneQuery(thisData, screen, setting)
  }
}

SettingRocheConfig.statics = {
  updateRocheConfig(screen, setting) {
    let thisData = this;
    return updateOneQuery(thisData, screen, setting)
  }
}

SettingRocheLoginCarousel.statics = {
  updateRocheLoginCarousel(screen, setting){
    let thisData = this;
    return updateOneQuery(thisData, screen, setting)
  }
}

SettingLeapLoginPage.statics = {
  updateLeapLoginPage(screen, setting){
    let thisData = this;
    return updateOneQuery(thisData, screen, setting)
  }
}

SettingHomeFirstScreen.statics = {
  updateHomeFirstScreen(screen, setting){
    let thisData = this;
    return updateOneQuery(thisData, screen, setting)
  }
}

SettingLeapHomeFirstScreen.statics = {
  updateLeapHomeFirstScreen(screen, setting){
    let thisData = this;
    return updateOneQuery(thisData, screen, setting)
  }
}

SettingHomeSecondScreen.statics = {
  updateHomeSecondScreen(screen, setting){
    let thisData = this;
    return updateOneQuery(thisData, screen, setting)
  }
}

SettingRocheBookingHomepage.statics = {
  updateBookingHomepage(screen, setting){
    let thisData = this;
    return updateOneQuery(thisData, screen, setting)
  }
}

SettingLeapProfileHomePage.statics = {
  updateProfileHomepage(screen, setting){
    let thisData = this;
    return updateOneQuery(thisData, screen, setting)
  }
}

SettingRocheAssessmentHomepage.statics = {
  updateAssessmentHomepage(screen, setting){
    let thisData = this;
    return updateOneQuery(thisData, screen, setting)
  }
}

SettingAppVersionDetails.statics = {
  updateAppVersionDetails(screen, setting){
    let thisData = this;
    return this.updateOneQuery(thisData, screen, setting)
  }
}

SettingNPSFeedbackSchema.statics = {
  updateNPSFeedbackDetails(screen, setting){
    let thisData = this;
    return this.updateOneQuery(thisData, screen, setting)
  }
}

SettingFeelingTodaySchema.statics = {
  updateFeelingToday(screen, setting){
    let thisData = this;
    return this.updateOneQuery(thisData, screen, setting)
  }
}

SettingProfilePersonalisingTransitionDetails.statics = {
  updateProfileTransitionDetails(screen, setting){
    let thisData = this;
    return this.updateOneQuery(thisData, screen, setting)
  }
}

function updateOneQuery(thisData, screen, setting){
  let query = {};
  if(setting.appId && setting.appId.length){
    query = {$and: [{"screen": screen},{"appId": {$in: setting.appId}}]}
  }else{
    query = {$and : [{screen:screen}, {$or: [{appId: {$exists: false}}, {appId: {$nin: ["LEAP"]}}]}]}
  }
  return thisData.updateOne(query, setting)
    .exec()
    .then((settings) => {
    if (settings) {
      return settings;
    }
    const err = new APIError('failed', httpStatus.NOT_FOUND);
  return Promise.reject(err);
  });
}

// /**
//  * @typedef Setting
//  */
const upcoming = mongoose.model('Upcoming', SettingUpcomingSchema, '_settings');
const profile = mongoose.model('Profile', SettingProfileSchema, '_settings');
const new_booking = mongoose.model('New_Booking', SettingBookingSchema, '_settings');
const hamburger = mongoose.model('Hamburger', SettingHamburgerSchema, '_settings');
const about = mongoose.model('About', SettingAboutSchema, '_settings');
const help = mongoose.model('Connect', SettingHelpSchema, '_settings');
const FAQ = mongoose.model('FAQ', SettingFAQSchema, '_settings');
const permission = mongoose.model('Permission', SettingPermissionSchema, '_settings');
const mydiary_firstscreen = mongoose.model('Mydiary_Firstscreen', SettingMyDiaryFirstScreen, '_settings');
const mydiary_emoji_question = mongoose.model('Mydiary_Emoji_Question', SettingMyDiaryEmojiQuestion, '_settings');
const rocheConfig = mongoose.model('Roche_Config', SettingRocheConfig, '_settings');
const rocheLoginCarousel = mongoose.model('rocheLoginCarousel', SettingRocheLoginCarousel, '_settings');
const leapLoginPage = mongoose.model('leapLoginPage', SettingLeapLoginPage, '_settings');
const rocheHomeFirstScreen = mongoose.model('rocheFirstScreen', SettingHomeFirstScreen, '_settings');
const leapHomeFirstScreen = mongoose.model('leapHomeFirstScreen', SettingLeapHomeFirstScreen, '_settings');
const rocheHomeSecondScreen = mongoose.model('rocheSecondScreen', SettingHomeSecondScreen, '_settings');
const rocheBookingHomepage = mongoose.model('rocheBookingHomepage', SettingRocheBookingHomepage, '_settings');
const leapProfilehomepage = mongoose.model('leapProfilehomepage', SettingLeapProfileHomePage, '_settings');
const rocheAssessmentHomepage = mongoose.model('rocheAssessmentHomepage', SettingRocheAssessmentHomepage, '_settings');
const appVersionDetails = mongoose.model('appVersionDetails', SettingAppVersionDetails, '_settings');
const NPSFeedback = mongoose.model('NPSFeedback', SettingNPSFeedbackSchema, '_settings');
const feelingToday = mongoose.model('FeelingToday', SettingFeelingTodaySchema, '_settings');
const profilePersonalisingTransition = mongoose.model('ProfilePersonalisingTransition', SettingProfilePersonalisingTransitionDetails, '_settings');
module.exports = {
  upcoming,
  profile,
  new_booking,
  hamburger,
  about,
  help,
  FAQ,
  permission,
  mydiary_firstscreen,
  mydiary_emoji_question,
  rocheConfig,
  rocheLoginCarousel,
  rocheHomeFirstScreen,
  leapHomeFirstScreen,
  rocheHomeSecondScreen,
  rocheBookingHomepage,
  rocheAssessmentHomepage,
  appVersionDetails,
  NPSFeedback,
  feelingToday,
  leapProfilehomepage,
  profilePersonalisingTransition
};
// module.exports = mongoose.model('_setting', SettingSchema);
