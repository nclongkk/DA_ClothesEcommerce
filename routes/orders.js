const express = require('express');
const {
  addOrder,
  getOrdersOfUser,
  getOrdersOfShop,
  getOrderById,
  updateOrderStatusForShop,
  confirmReceipt,
  cancelOrder,
} = require('../controllers/orders');
const { authenticate, authorize } = require('../middlewares/auth');
const paginate = require('../validators/paginate.validator');
const updateOrderStatus = require('../validators/updateOrderStatus.validator');
const createOrder = require('../validators/createorder.validator');
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(authenticate, paginate.validate(), getOrdersOfUser)
  .post(authenticate, createOrder.validate(), addOrder);
router
  .route('/shop-owner')
  .get(
    authenticate,
    authorize('shopOwner'),
    paginate.validate(),
    getOrdersOfShop
  );
router.route('/:orderId').get(authenticate, getOrderById);
router
  .route('/:orderId/shop-owner')
  .patch(authenticate, updateOrderStatus.validate(), updateOrderStatusForShop);
router.route('/:orderId/confirm-receipt').patch(authenticate, confirmReceipt);
router.route('/:orderId/cancel').delete(authenticate, cancelOrder);
module.exports = router;
