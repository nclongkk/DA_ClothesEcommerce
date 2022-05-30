const express = require('express');
const {
  addItem,
  getItems,
  getRecentItems,
  updateQuantity,
  deleteItem,
} = require('../controllers/cartItems');
const validateCartItem = require('../validators/cartItem.validator');
const paginate = require('../validators/paginate.validator');
const { authenticate } = require('../middlewares/auth');
const router = express.Router();
router.use(authenticate);
router.route('/').get(getItems).post(validateCartItem.validate(), addItem);
router.route('/:cartItemId').patch(updateQuantity).delete(deleteItem);
router.route('/recent').get(paginate.validate(), getRecentItems);

module.exports = router;
