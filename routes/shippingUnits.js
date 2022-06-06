const express = require('express');
const {
  addNewShippingUnit,
  getShippingUnits,
  updateShippingUnit,
  deleteShippingUnit,
} = require('../controllers/shippingUnits');
const { authenticate } = require('../middlewares/auth');
const shippingUnitsDetail = require('../validators/shippingUnitDetail.validator');

const router = express.Router();

router.use(authenticate);
router
  .route('/')
  .post(shippingUnitsDetail.validate(), addNewShippingUnit)
  .get(getShippingUnits);
router
  .route('/:shippingUnitId')
  .put(shippingUnitsDetail.validate(), updateShippingUnit)
  .delete(deleteShippingUnit);

module.exports = router;
