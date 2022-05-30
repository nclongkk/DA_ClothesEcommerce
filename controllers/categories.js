const httpStatus = require('http-status');
const { Category, Product, sequelize } = require('../models');
const customError = require('../utils/customError');
const { response } = require('../utils/response');

/**
 * @desc    List category of website
 * @route   GET /api/v1/categories
 * @access  public
 */
exports.listCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'name', 'image'],
    });
    return response(categories, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    List category of shop
 * @route   GET /api/v1/categories/:shopId
 * @access  public
 */
exports.listCategoriesOfShop = async (req, res, next) => {
  try {
    const shopId = req.params.shopId;
    const categories = await Product.findAll({
      where: { shopId },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name', 'image'],
        },
      ],
      attributes: ['categoryId', [sequelize.fn('COUNT', '*'), 'countProducts']],
      group: ['categoryId'],
    });
    return response(categories, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};
