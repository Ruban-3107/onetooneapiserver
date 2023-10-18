const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

module.exports = {
  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  //POST /api/admin
  createAdmin: {
    body: {
      config_type: Joi.string().required(),
      config: Joi.object().required()
    }
  },

  // GET /api/admin/:config_type
  getAdmin: {
    params: {
      config_type: Joi.string().required()
    }
  },

  // PUT /api/admin: config_type
  updateAdminValidate: {
    params: {
      config_type: Joi.string().required()
    },
    body: {
      config: Joi.object().required()
    }
  },

  //POST /api/audio
  CreateAudio: {
    body: {
      file_name: Joi.string().required(),
      url: Joi.string().required()
    }
  },

  //GET /api/audio/:audioID
  getAudioValidate: {
    params: {
      audioID: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  },

  // UPDATE /api/booking/:userId/cancellation/:bookingId
  cancelBooking: {
    body: {
      cancellation_reasons: Joi.string().required(),
      cancellation_date: Joi.string().required(),
      booking_status: Joi.string().required()
    },
    params: {
      Id: Joi.string().required()
    }
  },

  // POST /api/booking/reschedule
  postRescheduleValid: {
    body: {
      context: Joi.array().required(),
      audio_url: Joi.array().required(),
      booking_date: Joi.string().required(),
      booking_slot: Joi.objectId().required(),
      booking_status: Joi.string().required(),
      booking_Id: Joi.string().required(),
      booking_line_id: Joi.string().required()
    }
  },

  // POST /api/booking
  postRequestBooking: {
    body: {
      // context: Joi.required(),
      concern : Joi.string().required(),
      // audio_url: Joi.array().required(),
      // intensity_scale: Joi.string().required(),
      // creater_phone: Joi.string().required(),
      booking_date: Joi.string().required(),
      booking_slot: Joi.objectId().required(),
      booking_status: Joi.string().required(),
      booking_Id: Joi.string().required(),
      booking_line_id: Joi.string().required()
    }
  },

  //GET /api/booking/:user_id
  getBookingByUserId: {
    params: {
      user_id: Joi.string().hex().required()
    }
  },

  //PUT /api/booking/feedback/:Id
  updateFeedbackValidate: {
    params: {
      Id: Joi.string().hex().required()
    },
    body: {
      session_feedback: Joi.string().hex().required()
    }
  },

  //PUT /api/booking/update/:Id
  updateBookingDetailsValidate: {
    params: {
      Id: Joi.string().hex().required()
    }
  },

  //PUT /api/booking/cancellation/:Id
  updateCancellationValidate: {
    params: {
      Id: Joi.string().hex().required()
    },
    body: {
      cancellation_reasons: Joi.string().required(),
      cancellation_date: Joi.date().required(),
      booking_status: Joi.string().required()
    }
  },

  //PUT /api/booking/processBookingUpdate/:bookingID
  udpateBookingStatusToComplete: {
    params: {
      bookingID: Joi.string().required()
    },
    body: {
      booking_status: Joi.string().required()
    }
  },

  //GET /api/booking/concern/post_booking/:user_id
  getBookingConcernByuserId: {
    params: {
      user_id: Joi.string().hex().required()
    }
  },

  //GET /api/booking/concern-names/post_booking/:user_id
  getBookingConcernNamesByuserId: {
    params: {
      user_id: Joi.string().hex().required()
    }
  },

  //GET /api/booking/web-app/status/:user_id
  getBookingForWebAppStatusByuserId: {
    params: {
      user_id: Joi.string().hex().required()
    }
  },

  //GET /api/booking/web-app/new-status/:user_id
  getBookingForWebAppNewStatusByuserId: {
    params: {
      user_id: Joi.string().hex().required()
    }
  },

  //GET /api/booking/userId/app-id/:appId
  getBookingByAppId: {
    params: {
      appId: Joi.string().required()
    }
  },

  //POST /api/bookingslot
  postCreateBookingSlot: {
    body: {
      start_time: Joi.string().required(),
      end_time: Joi.string().required(),
      time_of_day: Joi.string().required(),
      date: Joi.string().required(),
      booking_type: Joi.array().required()
    }
  },

  //PUT /api/bookingslot/:bookingSlotDate
  getSlotsValidate: {
    body: {
      user_id: Joi.string().hex().required()
    },
    params:{
       bookingSlotDate: Joi.string().required()
    }
  },

  //PUT /api/bookingslot/counsellor/:slotDateTime
  getCounsellorSlot:{
    params: {
      slotDateTime: Joi.string().required()
    }
  },

  // POST /api/bookingtype
  bookingTypeCreate:{
    body: {
      type: Joi.string().required()
    }
  },

  //GET /api/bookingtype/:bookingTypeID
  getBookingTypeValidate: {
    params: {
      bookingTypeID: Joi.string().hex().required()
    }
  },

  //GET /api/bookingType/web-app/:type
  getBookingTypeByTypeValidate: {
    params: {
      type: Joi.string().required()
    }
  },

  //POST /api/concern
  concernCreate:{
    body: {
      concern: Joi.string().required()
    }
  },

  //GET /api/concern/:concernID
  getConcernValidate: {
    params: {
      concernID: Joi.string().hex().required()
    }
  },

  //POST /api/concern/contextDetails
  getConcernAndContext: {
    body: {
      services: Joi.array().required()
    }
  },

  //POST /api/context
  contextCreate:{
    body: {
      context: Joi.string().required()
    }
  },

  //GET /api/context/:contextID
  getContextValidate:{
    params: {
      contextID: Joi.string().hex().required()
    }
  },

  //POST /api/counsellor
  counsellorCreate: {
    body: {
      mode: Joi.array().required(),
      concerns: Joi.array().required(),
      contexts: Joi.array().required(),
      language: Joi.array().required()
    }
  },

  //GET /api/counsellor/:counsellor_Id
  getCounsellorValidate: {
    params: {
      counsellor_Id: Joi.string().hex().required()
    }
  },

  //POST /api/domain
  domainCreateValidate: {
    body: {
      domain: Joi.string().required(),
      services: Joi.array().required(),
      booking_type: Joi.array().required()
    }
  },

  //GET /api/domain/:domain
  getDomainByID: {
    params: {
      domainID: Joi.string().hex().required()
    }
  },

  //GET /api/domain/:domain/type/:type
  getDomainByNameAndAppId:{
    params: {
      domainID: Joi.string().required(),
      type: Joi.string().required()
    }
  },

  //GET /api/domain/roche/:uuid
  getRocheDomainValidate: {
    params: {
      uuid: Joi.string().required()
    }
  },

  //GET /api/domain/web-app/:id
  getDomainByIdValidate: {
    params: {
      id: Joi.string().hex().required()
    }
  },

  //GET /api/mydiary/:user_id
  getMydiaryByUserId: {
    params: {
      user_id: Joi.string().hex().required()
    }
  },

  //PUT /api/mydiary/delete/:Id
  deleteMydiary: {
    params: {
      Id: Joi.string().hex().required()
    },
    body: {
      status: Joi.string().required()
    }
  },

  //POST /api/feedback
  CreateFeedBackValidate: {
    body: {
      feedback: Joi.array().required(),
      booking_objId: Joi.string().hex().required()
    }
  },

  //GET /api/feedback
  getFeedbackValidate: {
    params: {
      booking_Id: Joi.string().hex().required()
    }
  },

  //POST /api/mydiary


  //POST /api/feature
  createFeatureValidate: {
    body: {
      featureName: Joi.string().required(),
      featureId : Joi.string().required(),
      type : Joi.string().required()
    }
  },

  //GET /api/service/:id
  getServiceByIdValidate: {
    params: {
      id: Joi.string().hex().required()
    }
  },

  //POST /api/setting
  createSettingValidate: {
    body: {
      screen: Joi.string().required()
    }
  },

  //GET /api/setting/:screen
  getSettingByScreenValidate: {
    params: {
      screen: Joi.string().required()
    }
  },

  //PUT /api/setting/:screen
  updateSettingValidate: {
    params: {
      screen: Joi.string().required()
    }
  },

  //GET /api/setting/appId/:appId
  getAllSettingByAppIdValidate: {
    params: {
      appId: Joi.string().required()
    }
  },

  //GET /api/setting/:screen/appId/:appId
  getEachSettingByAppIdValidate: {
    params: {
      screen: Joi.string().required(),
      appId: Joi.string().required()
    }
  },

  //PUT /api/setting/updateFAQ/:screen
  updateFAQValidate: {
    params: {
      screen: Joi.string().required()
    },
    body: {
      status: Joi.string().required(),
      option_type: Joi.string().required(),
      data_name: Joi.string().required(),
      user_id: Joi.string().required()
    }
  },

  //POST /api/tags
  createTagsValidate: {
    body: {
      name: Joi.string().required()
    }
  },

  //GET /api/tags/:tagsID
  getTagsbyTabsIdValidate: {
    params: {
      tagsID: Joi.string().required()
    }
  },

  //GET /api/tags/filtertags/:searchstring
  getSearchFilterTags: {
    params: {
      searchstring: Joi.string().required()
    }
  },

  cutoffTimeCreateValidate: {
    body: {
      cutoff_time: Joi.string().required(),
      company_id: Joi.string().hex().required()
    }
  },

  feelingTodayCreateValidate: {
    params: {
      userId: Joi.string().hex().required()
    }
  },

  getFeelingByUserIdValidate: {
    params: {
      userId: Joi.string().hex().required()
    }
  },

  createEmployee :{
    body: Joi.object().keys({
      email: Joi.string(),
      phone: Joi.number(),
      employee_code: Joi.string(),
      entityId : Joi.string().required(),
      isActive : Joi.boolean().required()
    }).or('email', 'employee_code', 'phone')
  }

};
