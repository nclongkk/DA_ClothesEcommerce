const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth');

const {
  getUsers,
  statisticUserRegister,
  updateUserStatus,
  getTransactions,
} = require('../controllers/admin');
const paginate = require('../validators/paginate.validator');
const period = require('../validators/period.validator');
const updateUserStatusValidator = require('../validators/updateUserStatus.validator');

const router = express.Router();
router.use(authenticate, authorize('admin'));
router.route('/users').get(paginate.validate(), getUsers);
router.route('/users/statistics').get(period.validate(), statisticUserRegister);
router
  .route('/users/:userId/status')
  .patch(updateUserStatusValidator.validate(), updateUserStatus);
router.route('/transactions').get(paginate.validate(), getTransactions);
module.exports = router;
