const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Schema = mongoose.Schema;
const idvalidator = require('mongoose-id-validator');

/**
 * Audio Schema
 */
const AudioSchema = new mongoose.Schema({
  file_name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

AudioSchema.plugin(idvalidator);

/**
 * Methods
 */
AudioSchema.method({
});

/**
 * Statics
 */
AudioSchema.statics = {
  /**
   * Get audio
   * @param {ObjectId} id - The objectId of audio.
   * @returns {Promise<Audio, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((audio) => {
        if (audio) {
          return audio;
        }
        const err = new APIError('No such audio file exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List audio files in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of audio's to be skipped.
   * @param {number} limit - Limit number of audio's to be returned.
   * @returns {Promise<Audio[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef Audio
 */
module.exports = mongoose.model('Audio', AudioSchema);
