const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const employeeCtrl = require('./employee.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** POST /api/concern - Create new concern */
  .post(validate(paramValidation.createEmployee),employeeCtrl.create);


module.exports = router;

