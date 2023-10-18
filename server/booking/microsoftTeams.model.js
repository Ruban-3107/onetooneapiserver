const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Schema = mongoose.Schema;
const Config = require('../../config/config');

/**
 * admin Schema
 */
const MicrosoftTeamSchema = new mongoose.Schema({
  booking_id: {
    type: Schema.Types.ObjectId,
    ref: '_booking',
  },
  event_id: {
    type: String,
    required: true
  },
  meeting_url: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
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
MicrosoftTeamSchema.method({
});

/**
 * Statics
 */
MicrosoftTeamSchema.statics = {




};

// /**
//  * @typedef Setting
//  */
module.exports = mongoose.model('_meeting', MicrosoftTeamSchema);
