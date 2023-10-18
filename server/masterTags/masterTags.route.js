const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const tagCtrl = require('./masterTag.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
/** GET /api/v2/tags- Get list of tags  */
  .get(tagCtrl.list);

router.route('/groupbytags')
/** GET /api/v2/tags/groupbytags- Get blogs grouped by primary tags */
  .get(tagCtrl.getByTags);

router.route('/curatedblogs/:date')
/** GET /api/v2/tags/curatedblogs/:date- Get blogs grouped by primary tags */
  .get(tagCtrl.curatedBlogs);

module.exports = router;
