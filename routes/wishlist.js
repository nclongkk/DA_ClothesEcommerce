const express = require('express');
const {
  addWishlistItem,
  getWishlist,
  deleteWishlistItem,
} = require('../controllers/wishlist');
const { authenticate } = require('../middlewares/auth');
const router = express.Router();
router.use(authenticate);
router.route('/').get(getWishlist).post(addWishlistItem);
router.route('/:wistlistItemId').delete(deleteWishlistItem);

module.exports = router;
