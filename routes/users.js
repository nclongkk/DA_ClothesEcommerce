const express = require('express');
const {
  getMe,
  updateDetails,
  updatePassword,
  setNewAddress,
  getListAddress,
  updateAddress,
  deleteAddress,
} = require('../controllers/users');
const { authenticate } = require('../middlewares/auth');
const checkAddress = require('../validators/checkAddress');

const router = express.Router();

router.use(authenticate);
router.route('/').get(getMe).put(updateDetails).patch(updatePassword);
router
  .route('/addresses')
  .get(getListAddress)
  .post(checkAddress.validate(), setNewAddress);
router
  .route('/addresses/:addressId')
  .patch(checkAddress.validate(), updateAddress)
  .delete(deleteAddress);

module.exports = router;
