const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const npsCtrl = require('./nps.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
/** POST /api/npsfeedback- Create feedback against a userId  */
  .post(npsCtrl.create);


// router.route('/:userId')
// /** GET /api/npsfeedback/:userId- Get list of blog viewed by user  */
//   .get(npsCtrl.getFeedback);

module.exports = router;
