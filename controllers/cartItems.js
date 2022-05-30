const httpStatus = require('http-status');
const {
  User,
  Product,
  Shop,
  CartItem,
  ProductVersion,
  sequelize,
} = require('../models');
const customError = require('../utils/customError');
const { response } = require('../utils/response');

/**
 * @desc    add cart item
 * @route   POST /api/v1/cart-items
 */
exports.addItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productVersionId, quantity } = req.body;
    const productVersion = await ProductVersion.findByPk(productVersionId);
    if (!productVersion.quantity) {
      throw new customError('error.out_of_stock', httpStatus.BAD_REQUEST);
    }
    const result = await CartItem.findOrCreate({
      where: { userId, productVersionId },
      defaults: {
        userId,
        productVersionId,
        quantity,
      },
    });
    return response(
      { cartItem: result[0], new: result[1] },
      httpStatus.OK,
      res
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    get all cart item of user
 * @route   GET /api/v1/cart-items
 */
exports.getItems = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let result = await Shop.findAll({
      include: [
        {
          model: Product,
          as: 'products',
          include: [
            {
              model: ProductVersion,
              as: 'productVersions',
              include: [
                {
                  model: CartItem,
                  as: 'cartItems',
                  where: { userId },
                  required: true,
                },
              ],
              attributes: ['id', 'size', 'color', 'image', 'price', 'quantity'],
              required: true,
            },
          ],
          attributes: ['id', 'name'],
          required: true,
        },
      ],
      attributes: ['id', 'name'],
      required: true,
    });
    result = JSON.parse(JSON.stringify(result));
    result = result.map((shop) => {
      shop.products = shop.products.map((product) => {
        product.productVersions = product.productVersions.map(
          (productVersion) => {
            if (
              productVersion.cartItems.length &&
              productVersion.quantity < productVersion.cartItems[0].quantity
            ) {
              productVersion.isOutOfStock = true;
            } else {
              productVersion.isOutOfStock = false;
            }
            productVersion.quantity = undefined;
            return productVersion;
          }
        );
        return product;
      });
      return shop;
    });

    return response(result, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    get get recent card items
 * @route   GET /api/v1/cart-items/recent
 */
exports.getRecentItems = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const limit = req.query.limit;
    const { rows, count } = await CartItem.findAndCountAll({
      where: { userId },
      limit,
      include: [
        {
          model: ProductVersion,
          as: 'productVersion',
          attributes: [
            'id',
            'productId',
            'size',
            'color',
            'quantity',
            'price',
            'image',
          ],
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
      order: [['updatedAt', 'DESC']],
    });

    return response(
      { recentItems: rows, totalItem: count },
      httpStatus.OK,
      res
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    update cartItem quantity
 * @route   PATCH /api/v1/cartItems/:cartItemId
 */
exports.updateQuantity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cartItemId = req.params.cartItemId;
    const quantity = req.body.quantity;
    const result = await CartItem.update(
      {
        quantity,
      },
      {
        where: { userId, id: cartItemId },
      }
    );
    if (!result[0]) {
      throw new customError('error.not_found', httpStatus.BAD_REQUEST);
    }
    return response({ success: true }, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    delete cartItem
 * @route   DELETE /api/v1/cartItems/:cartItemId
 */
exports.deleteItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cartItemId = req.params.cartItemId;
    const result = await CartItem.destroy({
      where: { userId, id: cartItemId },
    });

    if (!result) {
      throw new customError('error.not_found', httpStatus.BAD_REQUEST);
    }
    return response({ success: true }, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};
