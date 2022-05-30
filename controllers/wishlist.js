const httpStatus = require('http-status');
const {
  User,
  Product,
  ProductImage,
  Shop,
  CartItem,
  WishlistItem,
  sequelize,
} = require('../models');
const customError = require('../utils/customError');
const { response } = require('../utils/response');

/**
 * @desc    add wishlist item
 * @route   POST /api/v1/wishlist
 */
exports.addWishlistItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const result = await WishlistItem.findOrCreate({
      where: { userId, productId },
      defaults: {
        userId,
        productId,
      },
    });
    return response(
      { wishlistItem: result[0], new: result[1] },
      httpStatus.OK,
      res
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    get wishlist
 * @route   GET /api/v1/wishlist
 */
exports.getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const result = await WishlistItem.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Product,
          as: 'product',
          attributes: [
            'id',
            'name',
            'minPrice',
            'maxPrice',
            'totalRatings',
            'avgRatings',
          ],
          include: [
            {
              model: ProductImage,
              as: 'images',
              attributes: ['image'],
              limit: 1,
            },
          ],
        },
      ],
    });
    return response(result, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    remove wishlist item
 * @route   DELETE /api/v1/wishlist/:wishlistItemId
 */
exports.deleteWishlistItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const wistlistItemId = req.params.wistlistItemId;
    const result = await WishlistItem.destroy({
      where: { id: wistlistItemId, userId },
    });
    return response({ success: result === 1 }, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};
