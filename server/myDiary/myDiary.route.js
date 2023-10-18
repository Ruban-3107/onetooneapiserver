
const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const myDiaryCtrl = require('./myDiary.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
/** GET /api/mydiary - Get list of myDiary */
  .get(myDiaryCtrl.list)

  /** POST /api/mydiary - Create new myDiary*/
  .post(myDiaryCtrl.create);

router.route('/:user_id')
/** GET /api/mydiary/:user_id - Get myDiary line on id */
  .get(validate(paramValidation.getMydiaryByUserId), myDiaryCtrl.get)

  /** PUT /api/mydiary/:Id - Update myDiary */
  // .put(myDiaryCtrl.update)
router.route('/delete/:Id')
/** PUT /api/mydiary/delete/:Id - delete diary */
  .put(validate(paramValidation.deleteMydiary), myDiaryCtrl.deleteMydiary);

/** Load user when API with screen route parameter is hit */
router.param('user_id', myDiaryCtrl.load);

module.exports = router;
