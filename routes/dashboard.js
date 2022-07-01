const express = require('express');
const {
  getShopStatistics,
  getShopEarnings,
} = require('../controllers/dashboard');
const { authenticate, authorize } = require('../middlewares/auth');
const period = require('../validators/period.validator');
const router = express.Router();

router
  .route('/statistics')
  .get(
    authenticate,
    authorize('shopOwner'),
    period.validate(),
    getShopStatistics
  );
router
  .route('/earnings')
  .get(
    authenticate,
    authorize('shopOwner'),
    period.validate(),
    getShopEarnings
  );

module.exports = router;
