const express = require('express');
const {
  addProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getBestSellingProducts,
  getPurchasedProducts,
} = require('../controllers/products');
const { authenticate, authorize } = require('../middlewares/auth');
const paginate = require('../validators/paginate.validator');
const searchProducts = require('../validators/searchProducts.validator');
const feedbackRoutes = require('./feedbacks');
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(searchProducts.validate(), getProducts)
  .post(authenticate, authorize('shopOwner'), addProduct);
router.route('/best-sellings').get(paginate.validate(), getBestSellingProducts);
router.route('/purchased').get(authenticate, getPurchasedProducts);
router
  .route('/:productId')
  .get(getProduct)
  .put(authenticate, authorize('shopOwner'), updateProduct)
  .delete(authenticate, authorize('shopOwner', 'admin'), deleteProduct);

router.use('/:productId/feedbacks', feedbackRoutes);

module.exports = router;
