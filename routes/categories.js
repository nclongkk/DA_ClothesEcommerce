const express = require('express');
const router = express.Router();
const {
  listCategories,
  listCategoriesOfShop,
} = require('../controllers/categories');

router.get('/', listCategories);
router.get('/:shopId', listCategoriesOfShop);

module.exports = router;
