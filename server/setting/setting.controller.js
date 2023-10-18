const {upcoming, profile, new_booking, about, hamburger, help, FAQ, permission, mydiary_firstscreen, mydiary_emoji_question, rocheConfig, rocheLoginCarousel, rocheHomeFirstScreen,leapHomeFirstScreen, rocheHomeSecondScreen, rocheBookingHomepage, rocheAssessmentHomepage, appVersionDetails, NPSFeedback, feelingToday, leapLoginPage,profileHomepage,profileTransition} = require('./setting.model');
const getMongoDBID = require('../helpers/mongoDBUtils');
const UserCtrl = require('../user/user.controller');
const DistressModel = require('../distressLog/distressLog.model');

/**
 * Load setting and append to req.
 */
function load(req, res, next, id) {
  upcoming.get(id)
    .then((setting) => {
      req.setting = setting; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

async function getSuicidalOption(distress, intensityScale, suicidalOpt, id, appId){
  try{
    let query = {$and: [{screen: "new_booking"},{appId: {$in: appId}}]};
    // if(appId){
    //   query = {$and: [{screen: "new_booking"},{appId: {$in: appId}}]};
    // } else{
    //   query = {$and : [{screen:"new_booking"}, {$or: [{appId: {$exists: false}}, {appId: {$nin: ["LEAP"]}}]}]};
    // }
     await new_booking.find(query).then(async (suicid)=> {
      let body = {};
      if(distress && distress.length)
        body.distress = distress;
        else
        body.distress = [];
        if(appId && appId[0] === "LEAP" && distress.length){
          if(suicid.length && suicid[0].distress_scale.length){
            for(let i=0; i< suicid[0].distress_scale.length; i++){
              for(let j=0; j< suicid[0].distress_scale[i].condition.length; j++){
                if(distress[0].distress_name == suicid[0].distress_scale[i].condition[j].distress && distress[0].suicide_risk == suicid[0].distress_scale[i].condition[j].risk){
                  body.distress_monthskip = suicid[0].distress_scale[i].monthskip;
                  body.distress_status = suicid[0].distress_scale[i].status;
                  body.distress[0].flag = suicid[0].distress_scale[i].flag;
                  body.current_distress = intensityScale;
                  body.distress_updated = new Date();
                  await UserCtrl.userDistressUpdate(id, body);
                  await DistressModel.createDistressByUser(body, id, intensityScale, suicidalOpt)
                  return true
                }
              }
            }
          }
        }else{
          if(intensityScale < 7){
            if(suicid.length && suicid[0].distress_questionnaire.length && suicid[0].distress_questionnaire[0].options.length){
              for(let i=0; i< suicid[0].distress_questionnaire[0].options.length; i++){
                if(suicidalOpt == suicid[0].distress_questionnaire[0].options[i]){
                  if(i < 2){
                    body.distress_monthskip = suicid[0].distress_scale.length ? (suicid[0].distress_scale[0].distress_monthskip.length ? suicid[0].distress_scale[0].distress_monthskip[0] : 3) : 3;
                    body.distress_status = suicid[0].distress_scale.length ? (suicid[0].distress_scale[0].distress_status.length ? suicid[0].distress_scale[0].distress_status[1] : "Distressed but not at risk") : "Distressed but not at risk";
                    body.current_distress = intensityScale;
                    body.distress_updated = new Date();
                    console.log('user -> Distressed but not at risk',i)
                    await UserCtrl.userDistressUpdate(id, body)
                    await DistressModel.createDistressByUser(body, id, intensityScale, suicidalOpt)
                  }else if(i > 1 && 4 > i){
                    body.distress_monthskip = suicid[0].distress_scale.length ? (suicid[0].distress_scale[0].distress_monthskip.length ? suicid[0].distress_scale[0].distress_monthskip[1] : 6) : 6;
                    body.distress_status = suicid[0].distress_scale.length ? (suicid[0].distress_scale[0].distress_status.length ? suicid[0].distress_scale[0].distress_status[2] : "Not Distressed") : "Not Distressed";
                    body.current_distress = intensityScale;
                    body.distress_updated = new Date();
                    console.log('user -> Not Distressed',i)
                    await UserCtrl.userDistressUpdate(id, body)
                    await DistressModel.createDistressByUser(body, id, intensityScale, suicidalOpt)
                  }
                }
              }
            }
          }else if(intensityScale == 7){
            if(suicid.length && suicid[0].distress_questionnaire.length && suicid[0].distress_questionnaire[0].options.length){
              for(let i=0; i< suicid[0].distress_questionnaire[0].options.length; i++){
                if(suicidalOpt == suicid[0].distress_questionnaire[0].options[i]){
                  if(i < 2){
                    body.distress_monthskip = suicid[0].distress_scale.length ? (suicid[0].distress_scale[0].distress_monthskip.length ? suicid[0].distress_scale[0].distress_monthskip[0] : 3) : 3;
                    body.distress_status =  suicid[0].distress_scale.length ? (suicid[0].distress_scale[0].distress_status.length ? suicid[0].distress_scale[0].distress_status[0] : "Distressed") : "Distressed";
                    body.current_distress = intensityScale;
                    body.distress_updated = new Date();
                    console.log('user -> Distressed',i, body)
                    await UserCtrl.userDistressUpdate(id, body)
                    await DistressModel.createDistressByUser(body, id, intensityScale, suicidalOpt)
                  }else if(i > 1 && 4 > i){
                    body.distress_monthskip = suicid[0].distress_scale.length ? (suicid[0].distress_scale[0].distress_monthskip.length ? suicid[0].distress_scale[0].distress_monthskip[0] : 3) : 3;
                    body.distress_status = suicid[0].distress_scale.length ? (suicid[0].distress_scale[0].distress_status.length ? suicid[0].distress_scale[0].distress_status[2] : "Not Distressed") : "Not Distressed";
                    body.current_distress = intensityScale;
                    body.distress_updated = new Date();
                    console.log('user -> Not Distressed',i)
                    await UserCtrl.userDistressUpdate(id, body)
                    await DistressModel.createDistressByUser(body, id, intensityScale, suicidalOpt)
                  }
                }
              }
            }
          }
        }
    });
  } catch(err) {
    console.log(err);
  }
}

// /**
//  * Get Setting
//  * @returns {Setting}
//  */
function get(req, res) {
    console.log("🚀 ~ file: setting.controller.js ~ line 74 ~ get ~ req", req.header)
    return res.json(req.setting);
  }

/**
 * Create new setting
 * @property {string} req.body.screen - name of the screen.
 * @property {boolean} req.body.display_maps - boolean value to display maps.
 * @property {number} req.body.reschedule_limits - reschedule limit for a booking.
 * @property {number} req.body.reschedule_threshold - reschedule threshold for a booking.
 * @property {number} req.body.cancellation_threshold - cancellation threshold for a booking.
 * @returns {Setting}
 */
 function create(req, res, next) {
  let setting = {};
  if(req.body.screen == 'upcoming'){
    setting = new upcoming({
      screen: req.body.screen,
      display_maps: req.body.display_maps || false,
      reschedule_limits: req.body.reschedule_limits || null,
      reschedule_threshold: req.body.reschedule_threshold || null,
      cancellation_threshold: req.body.cancellation_threshold || null,
      distress_threshold: req.body.distress_threshold || null,
      total_sessions: req.body.total_sessions || null,
      bookingSlot_threshold: req.body.bookingSlot_threshold || null,
      bookingReminder_threshold: req.body.bookingReminder_threshold || 15
    });
  }
  if(req.body.screen == 'profile_setup'){
    setting = new profile({
      screen: req.body.screen,
      age_limit: req.body.age_limit ,
      gender_option: req.body.gender_option || [],
      relationship_status: req.body.relationship_status || [],
      interest: req.body.interest || [null]
    });
  }
  if(req.body.screen == "new_booking"){
    setting = new new_booking({
      screen: req.body.screen,
      contents: req.body.contents,
      feedback: req.body.feedback || [],
      cancellation_reason: req.body.cancellation_reason || [],
      location: req.body.location || [],
      distress_questionnaire: req.body.distress_questionnaire || []
    });
  }
  if(req.body.screen == 'hamburger'){
    setting = new hamburger({
      screen: req.body.screen,
      options: req.body.options
    });
  }
  if(req.body.screen == 'about'){
    setting = new about({
      screen: req.body.screen,
      data: req.body.data
    });
  }
  if(req.body.screen == 'help'){
    setting = new help({
      screen: req.body.screen,
      email: req.body.email,
      phone: req.body.phone
    });
  }
  if(req.body.screen == 'FAQ'){
    setting = new FAQ({
      screen: req.body.screen,
      like_selected: req.body.like_selected,
      like_unSelected: req.body.like_unSelected,
      dislike_selected: req.body.dislike_selected,
      dislike_unSelected: req.body.dislike_unSelected,
      options: req.body.options
    });
  }
  if(req.body.screen == 'permission'){
    setting = new permission({
      screen: req.body.screen,
      options: req.body.options
    });
  }
  if(req.body.screen == 'mydiary_firstscreen'){
    setting = new mydiary_firstscreen({
      screen: req.body.screen,
      title: req.body.title,
      cards: req.body.cards,
      quote: req.body.quote,
      button: req.body.button
    })
  }
  if(req.body.screen == 'mydiary_emoji_question'){
    setting = new mydiary_emoji_question({
      screen: req.body.screen,
      question_emoji: req.body.question_emoji
    })
  }
  if(req.body.screen == 'roche_config'){
    setting = new rocheConfig({
      screen: req.body.screen,
      language: req.body.language,
      FAQ_email: req.body.FAQ_email,
      booking_email: req.body.booking_email
    })
  }
  if(req.body.screen == 'login_carousel'){
    setting = new rocheLoginCarousel({
      screen: req.body.screen,
      details: req.body.details
    })
  }
  if(req.body.screen == 'leap_login_page'){
    setting = new leapLoginPage({
      screen: req.body.screen,
      details: req.body.details,
      appId: req.body.appId
    })
  }
  if(req.body.screen == 'home_firstScreen'){
    setting = new rocheHomeFirstScreen({
      screen: req.body.screen,
      details: req.body.details
    })
  }
  if(req.body.screen == 'leap_booking_homepage'){
    setting = new leapHomeFirstScreen({
      screen: req.body.screen,
      details: req.body.details
    })
  }
  if(req.body.screen == 'home_secondScreen'){
    setting = new rocheHomeSecondScreen({
      screen: req.body.screen,
      details: req.body.details
    })
  }
  if(req.body.screen == 'booking_homepage'){
    setting = new rocheBookingHomepage({
      screen: req.body.screen,
      details: req.body.details
    })
  }
  if(req.body.screen == 'assessment_homepage'){
    setting = new rocheAssessmentHomepage({
      screen: req.body.screen,
      details: req.body.details
    })
  }
  if(req.body.screen == 'app_version'){
    setting = new appVersionDetails({
      screen: req.body.screen,
      details: req.body.details,
      appId: req.body.appId
    })
  }
  if(req.body.screen == 'nps_feedback'){
    setting = new NPSFeedback({
      screen: req.body.screen,
      like_about_options: req.body.like_about_options,
      area_of_improval: req.body.area_of_improval,
      appId: req.body.appId
    })
  }
  if(req.body.screen == 'daily_feeling'){
    setting = new feelingToday({
      screen: req.body.screen,
      feeling_questionnaire: req.body.feeling_questionnaire,
      appId: req.body.appId
    })
  }
  if(req.body.screen === 'profile_homePage'){
    setting = new profileHomepage({
      screen: req.body.screen,
      details: req.body.details,
      appId: req.body.appId
    })
  }
  if(req.body.screen === 'profile_personalising_transition'){
    setting = new profileTransition({
      screen: req.body.screen,
      details: req.body.details,
      appId: req.body.appId
    })
  }
  setting.save()
    .then(savedSetting => res.json(savedSetting))
.catch(e => next(e));
}

function update(req, res, next) {
  if (req.params.screen == 'new_booking') {
    new_booking.updateNewBooking(req.params.screen, req.body)
      .then((bookingSetup) => {
      res.json(bookingSetup)
    }).catch(e => next(e));
  } else if (req.params.screen == 'upcoming') {
    upcoming.updateUpcoming(req.params.screen, req.body)
      .then((upcomingSetup) => {
      res.json(upcomingSetup)
    }).catch(e => next(e));
  } else if (req.params.screen == 'profile_setup') {
    profile.updateProfileSetup(req.params.screen, req.body)
      .then((profileSetup) => {
      res.json(profileSetup)
    }).catch(e => next(e));
  } else if (req.params.screen == "about") {
    about.updateAbout(req.params.screen, req.body)
      .then((about) => {
      res.json(about)
    }).catch(e => next(e));
  } else if (req.params.screen == "hamburger") {
    hamburger.updateHamburger(req.params.screen, req.body)
      .then((hamburgerSetup) => {
      res.json(hamburgerSetup)
    }).catch(e => next(e));
  } else if (req.params.screen == "help") {
    help.updateHelp(req.params.screen, req.body)
      .then((helpSetup) => {
      res.json(helpSetup)
    }).catch(e => next(e));
  } else if (req.params.screen == "FAQ") {
    FAQ.updateFAQ(req.params.screen, req.body)
      .then((FAQsSetup) => {
      res.json(FAQsSetup)
    }).catch(e => next(e));
  } else if (req.params.screen == "permission") {
    permission.updatePermission(req.params.screen, req.body)
      .then((permissionSetup) => {
      res.json(permissionSetup)
    }).catch(e => next(e));
  } else if (req.params.screen == "mydiary_firstscreen") {
    mydiary_firstscreen.updateMyDiaryFirstScreen(req.params.screen, req.body)
      .then((myDiaryFirstScreenSetup) => {
      res.json(myDiaryFirstScreenSetup)
    }).catch(e => next(e));
  }else if (req.params.screen == "mydiary_emoji_question") {
    mydiary_emoji_question.updateMyDiaryEmojiQuestion(req.params.screen, req.body)
      .then((myDiaryEmojiQuestionSetup) => {
      res.json(myDiaryEmojiQuestionSetup)
    }).catch(e => next(e));
  }else if (req.params.screen == "roche_config") {
    rocheConfig.updateRocheConfig(req.params.screen, req.body)
      .then((rocheConfigSetup) => {
      res.json(rocheConfigSetup)
    }).catch(e => next(e));
  }else if (req.params.screen == "rochelogin_carousel") {
    rocheLoginCarousel.updateRocheLoginCarousel(req.params.screen, req.body)
      .then((rocheCarousel) => {
      res.json(rocheCarousel)
    }).catch(e => next(e));
  }
  else if (req.params.screen == "leap_login_page") {
    leapLoginPage.updateLeapLoginPage(req.params.screen, req.body)
      .then((leapLoginPageDetails) => {
      res.json(leapLoginPageDetails)
    }).catch(e => next(e));
  }else if (req.params.screen == "home_firstScreen") {
    rocheHomeFirstScreen.updateHomeFirstScreen(req.params.screen, req.body)
      .then((homefirstScreen) => {
      res.json(homefirstScreen)
    }).catch(e => next(e));
  }else if (req.params.screen == "leap_booking_homepage") {
      leapHomeFirstScreen.updateLeapHomeFirstScreen(req.params.screen, req.body)
        .then((homefirstScreen) => {
        res.json(homefirstScreen)
    }).catch(e => next(e));
  }else if (req.params.screen == "home_secondScreen") {
    rocheHomeSecondScreen.updateHomeSecondScreen(req.params.screen, req.body)
      .then((homeSecondScreen) => {
      res.json(homeSecondScreen)
    }).catch(e => next(e));
  }else if (req.params.screen == "booking_homepage") {
    rocheBookingHomepage.updateBookingHomepage(req.params.screen, req.body)
      .then((bookingHomepage) => {
      res.json(bookingHomepage)
    }).catch(e => next(e));
  }else if (req.params.screen == "assessment_homepage") {
    rocheAssessmentHomepage.updateAssessmentHomepage(req.params.screen, req.body)
      .then((assessmentHomepage) => {
      res.json(assessmentHomepage)
    }).catch(e => next(e));
  }else if (req.params.screen == "app_version") {
    appVersionDetails.updateAppVersionDetails(req.params.screen, req.body)
      .then((appVersionDetails) => {
      res.json(appVersionDetails)
    }).catch(e => next(e));
  }
  else if (req.params.screen == "nps_feedback") {
    appVersionDetails.updateNPSFeedbackDetails(req.params.screen, req.body)
      .then((appVersionDetails) => {
      res.json(appVersionDetails)
    }).catch(e => next(e));
  }
  else if(req.params.screen == "daily_feeling") {
    feelingToday.updateFeelingToday(req.params.screen, req.body)
      .then((feelingTodayDetails) => {
      res.json(feelingTodayDetails)
    }).catch(e => next(e));
  }
  else if(req.params.screen === "profile_homePage") {
    profileHomepage.updateProfileHomepage(req.params.screen, req.body)
      .then((profileHompageDetails) => {
        res.json(profileHompageDetails)
      }).catch(e => next(e));
  }
  else if(req.params.screen === "profile_personalising_transition") {
    profileTransition.updateProfileTransitionDetails(req.params.screen, req.body)
      .then((profileHompageDetails) => {
        res.json(profileHompageDetails)
      }).catch(e => next(e));
  }
}

async function updateFAQs(req, res, next) {
  let status = req.body.status;
  let option_type = req.body.option_type;
  let data_name = req.body.data_name;
  let user_id = req.body.user_id;
  let appId = req.body.appId;
  let setting = {};
  let params = {};
  if(appId && appId.length){
    params.screen = req.params.screen;
    params.appId = appId;
  }else{
    params = req.params.screen;
  }
  await upcoming.get(params)
    .then((result) => {
    if(result.length){
      setting = JSON.parse(JSON.stringify(result[0]));
    }
  })

  // let setting = req.body;
  if(setting.options.length){
    for(var i=0; i < setting.options.length; i++){
      if(setting.options[i].type == option_type){
        if(setting.options[i].data.length){
          for(var j=0; j < setting.options[i].data.length; j++){
            if(setting.options[i].data[j].name == data_name && setting.options[i].data[j][status]){
              if(status == "like"){
                if(setting.options[i].data[j][status].user_id.includes(user_id)){
                  setting.options[i].data[j][status].user_id.pop(user_id);
                } else{
                  if(setting.options[i].data[j]["dislike"].user_id.includes(user_id)){
                    setting.options[i].data[j]["dislike"].user_id.pop(user_id);
                  }
                  setting.options[i].data[j][status].user_id.push(user_id);
                }
              }else if(status == "dislike"){
                if(setting.options[i].data[j][status].user_id.includes(user_id)){
                  setting.options[i].data[j][status].user_id.pop(user_id);
                } else{
                  if(setting.options[i].data[j]["like"].user_id.includes(user_id)){
                    setting.options[i].data[j]["like"].user_id.pop(user_id);
                  }
                  setting.options[i].data[j][status].user_id.push(user_id);
                }
              }
            }
          }
        }
      }
    }
  }
  FAQ.updateFAQ(req.params.screen, setting)
    .then((FAQsSetup) => {
    res.json(FAQsSetup)
  }).catch(e => next(e));
}

function getSettingsByAppId(req, res, next){
   upcoming.get(req.params)
     .then((settings) => {
     res.json(settings)
  }).catch(e => next(e));
}

function getAllSettingsByAppid(req, res, next) {
  upcoming.list(req.params)
    .then((settings) => {
    res.json(settings)
  }).catch(e => next(e));
}

/**
 * Get setting list.
 */
function list(req, res, next) {
  console.log("🚀 ~ file: setting.controller.js ~ line 346 ~ list ~ req", req.headers)
  upcoming.list()
    .then(accounts => res.json(accounts))
    .catch(e => next(e));
}

module.exports = { load, get, create, list, update, getSuicidalOption, updateFAQs, getSettingsByAppId, getAllSettingsByAppid};
