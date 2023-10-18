const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const blogCtrl = require('./blog.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
/** GET /api/blog/:userId- Get list of blog viewed by user  */
  .get(blogCtrl.list);

router.route('/:userId')
/** GET /api/blog/:userId- Get list of blog viewed by user  */
  .get(blogCtrl.getViews)

router.route('/popular')
/** GET /api/v2/blog/popular- Get list of blog viewed by user  */
  .get(blogCtrl.getPopularBlogs)

router.route('/bytags')
/** GET /api/blog/:userId- Get list of blog viewed by user  */
  .get(blogCtrl.getByTags);

module.exports = router;
