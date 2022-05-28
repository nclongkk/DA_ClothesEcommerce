const express = require('express');
const {
  createNewShop,
  getAllShops,
  getShop,
  getShopFromAuthor,
  updateShopInformation,
  deleteShop,
  addShopRating,
  getUnexpiredPromotions,
  getAllPromotions,
  addPromotion,
  getPromotion,
  updatePromotion,
  deletePromotion,
} = require('../controllers/shops');
const { authenticate, authorize } = require('../middlewares/auth');
const shopDetail = require('../validators/shopInfo.validator');
const paginate = require('../validators/paginate.validator');
const promotionDto = require('../validators/promotionDto.validator');
const productRoutes = require('./products');

const router = express.Router();

router
  .route('/')
  .get(paginate.validate(), getAllShops)
  .post(authenticate, shopDetail.validate(), createNewShop);
router.route('/my-shop').get(authenticate, getShopFromAuthor);
router
  .route('/:shopId')
  .get(getShop)
  .put(authenticate, updateShopInformation)
  .delete(authenticate, deleteShop);
router.route('/:shopId/ratings').post(authenticate, addShopRating);
router.use('/:shopId/products', productRoutes);
router
  .route('/:shopId/promotions')
  .get(authenticate, getUnexpiredPromotions)
  .post(
    authenticate,
    authorize('shopOwner'),
    promotionDto.validate(),
    addPromotion
  );
router
  .route('/:shopId/promotions/all')
  .get(authenticate, paginate.validate(), getAllPromotions);
router
  .route('/:shopId/promotions/:promotionId')
  .get(authenticate, getPromotion)
  .put(
    authenticate,
    authorize('shopOwner'),
    promotionDto.validate(),
    updatePromotion
  )
  .delete(authenticate, authorize('shopOwner'), deletePromotion);

module.exports = router;
