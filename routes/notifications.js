const express = require('express');
const {
  updateNotificationReadStatus,
  getNotifications,
  deleteNotification,
} = require('../controllers/notifications');
const { authenticate } = require('../middlewares/auth');
const paginate = require('../validators/paginate.validator');
const updateNotificatioStatusValidate = require('../validators/updateNotificationStatus.validator');
const router = express.Router();

router.use(authenticate);
router.route('/').get(paginate.validate(), getNotifications);
router
  .route('/')
  .patch(
    updateNotificatioStatusValidate.validate(),
    updateNotificationReadStatus
  );
router.route('/:notificationId').delete(deleteNotification);

module.exports = router;
