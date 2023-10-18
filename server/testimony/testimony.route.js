const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const testimonyCtrl = require('./testimony.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/v2/testimony - Get list of testimony */
  .get(testimonyCtrl.list)

  /** POST /api/v2/testimony - Create new testimony */
  .post(testimonyCtrl.create)

module.exports = router;
