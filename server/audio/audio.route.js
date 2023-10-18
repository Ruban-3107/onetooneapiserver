const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const audioCtrl = require('./audio.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/v2/audio - Get list of audio */
  .get(audioCtrl.list)

  /** POST /api/v2/audio - Create new audio */
  .post(validate(paramValidation.CreateAudio), audioCtrl.create)
  // .post(audioCtrl.create);

router.route('/:audioID')
  /** GET /api/v2/audio/:audioID - Get audio */
  .get(validate(paramValidation.getAudioValidate), audioCtrl.get)

/** Load audio when API with audioID route parameter is hit */
router.param('audioID', audioCtrl.load);

module.exports = router;
