const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const tagsCtrl = require('./tags.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/tags - Get list of tags */
  .get(tagsCtrl.list)

  /** POST /api/tags - Create new tags */
  .post(validate(paramValidation.createTagsValidate), tagsCtrl.create);

router.route('/:tagsID')
  /** GET /api/tags/:tagsID - Get tags */
  .get(validate(paramValidation.getTagsbyTabsIdValidate), tagsCtrl.get)

router.route('/filtertags/:searchstring')
/** GET /api/tags/filtertags/:searchstring - Get tags in search object */
  .get(validate(paramValidation.getSearchFilterTags), tagsCtrl.search)

  /** PUT /api/booking/:bookingID - Update tags */
//   .put(validate(paramValidation.updatetags), tagsCtrl.update)

  /** DELETE /api/booking/:bookingID - Delete tags */
//   .delete(tagsCtrl.remove);

/** Load tags when API with bookingID route parameter is hit */
router.param('tagsID', tagsCtrl.load);

module.exports = router;
