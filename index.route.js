const express = require('express');
const featureRoutes = require('./server/feature/feature.route');
const concernRoute = require('./server/concern/concern.route');
const contextRoute = require('./server/context/context.route');
const contextMappingRoute = require('./server/context Mapping/contextMapping.route');
const tagMappingRoute = require('./server/masterTags/masterTags.route');
const testimonyRoute = require('./server/testimony/testimony.route');


const domainRoutes = require('./server/domain/domain.route');
const userRoutes = require('./server/user/user.route');
const bookingRoutes = require('./server/booking/booking.route');
const bookingTypeRoute = require('./server/bookingType/bookingType.route');

const bookingSlotRoute = require('./server/bookingSlot/bookingSlot.route');
const audioRoute = require('./server/audio/audio.route');
const settingRoute = require('./server/setting/setting.route');
const feedbackRoute = require('./server/feedback/feedback.route');
const adminRoute = require('./server/admin/admin.route');
const onesignalRoute = require('./server/oneSignal/oneSignal.route');
const notificationRoute = require('./server/notification/notification.route');
const blogRoute = require('./server/blog/blog.route');
const npsRoute = require('./server/npsFeedback/nps.route');
const feelingTodayRoute = require('./server/feelingToday/feelingToday.route');
const employeeRoute = require('./server/employee/employee.route');

// const templateRoutes = require('./server/template/template.route');
const tagsRoutes = require('./server/tags/tags.route');
const myDiaryRoutes = require('./server/myDiary/myDiary.route');


const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /
router.use('/feature', featureRoutes);
router.use('/concern', concernRoute);
router.use('/context', contextRoute);
router.use('/contextmapping', contextMappingRoute);
router.use('/tags',tagMappingRoute);
router.use('/testimony',testimonyRoute);


router.use('/booking', bookingRoutes);
router.use('/bookingtype', bookingTypeRoute);

router.use('/bookingslot', bookingSlotRoute);
router.use('/audio', audioRoute);
router.use('/domain', domainRoutes);

router.use('/user', userRoutes);
router.use('/setting', settingRoute);
router.use('/feedback', feedbackRoute);
router.use('/admin', adminRoute);
router.use('/onesignal', onesignalRoute);
router.use('/notification', notificationRoute);
router.use('/blog', blogRoute);

// router.use('/template', templateRoutes);
router.use('/tags', tagsRoutes);
router.use('/mydiary', myDiaryRoutes);
router.use('/npsfeedback', npsRoute);
router.use('/feelingToday', feelingTodayRoute);
router.use('/prereguser', employeeRoute);

module.exports = router;
