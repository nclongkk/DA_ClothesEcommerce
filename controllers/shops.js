const httpStatus = require('http-status');
const {
  User,
  City,
  District,
  Ward,
  Shop,
  ShopRating,
  Promotion,
  sequelize,
} = require('../models');
const { Op } = require('sequelize');
const customError = require('../utils/customError');
const { response } = require('../utils/response');

/**
 * @desc    create new shop for your own
 * @route   POST /api/v1/shops/
 */
exports.createNewShop = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, description, cityId, districtId, wardId, paypalMail } =
      req.body;

    const shop = await Shop.create({
      name,
      description,
      userId,
      cityId,
      districtId,
      wardId,
      paypalMail,
    });
    return response(shop, httpStatus.OK, res);
  } catch (error) {
    if (error.message == 'Validation error') {
      return next(
        new customError('error.already_create_a_shop', httpStatus.BAD_REQUEST)
      );
    }
    return next(error);
  }
};

/**
 * @desc    get shop information of author
 * @route   GET /api/v1/shops/my-shop
 */
exports.getShopFromAuthor = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const shop = await Shop.findOne({
      where: { userId },
      include: [
        { model: City, as: 'city', attributes: ['id', 'name', 'type'] },
        { model: District, as: 'district', attributes: ['id', 'name', 'type'] },
        { model: Ward, as: 'ward', attributes: ['id', 'name', 'type'] },
      ],
    });
    return response(shop, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    get shop information
 * @route   GET /api/v1/shops/:shopId
 */
exports.getShop = async (req, res, next) => {
  try {
    const shopId = req.params.shopId;
    const shop = await Shop.findOne({
      where: { id: shopId },
      include: [
        { model: City, as: 'city', attributes: ['id', 'name', 'type'] },
        { model: District, as: 'district', attributes: ['id', 'name', 'type'] },
        { model: Ward, as: 'ward', attributes: ['id', 'name', 'type'] },
      ],
    });
    return response(shop, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    add rating for shop
 * @route   POST /api/v1/shops/:shopId/ratings
 */
exports.addShopRating = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const shopId = req.params.shopId;
    const userId = req.user.id;
    const rating = req.body.rating;
    const result = await ShopRating.findOrCreate(
      {
        where: { shopId, userId },
        defaults: {
          shopId,
          userId,
          rating,
        },
        transaction: t,
      }
      // { transaction: t }
    );
    if (result[1]) {
      let shop = await Shop.findOne({ where: { id: shopId } });

      shop.totalRatings += 1;
      shop.avgRatings =
        (shop.avgRatings * (shop.totalRatings - 1) + rating) /
        shop.totalRatings;
      shop.changed('avgRatings', true);
      shop.changed('totalRatings', true);
      await shop.save({ transaction: t });
    }
    await t.commit();
    return response(result, httpStatus.OK, res);
  } catch (error) {
    await t.rollback();
    return next(error);
  }
};

/**
 * @desc    get all shops
 * @route   GET /api/v1/shops
 */
exports.getAllShops = async (req, res, next) => {
  try {
    //Pagination, default page 1, limit 5
    const { page, limit } = req.query;
    const startIndex = (page - 1) * limit;
    const { rows, count } = await Shop.findAndCountAll({
      limit,
      offset: startIndex,
      include: [
        {
          model: User,
          as: 'owner',
          where: { isActive: true },
          attributes: ['id', 'name', 'avatar', 'phone'],
          required: true,
        },
        { model: City, as: 'city', attributes: ['id', 'name', 'type'] },
        {
          model: District,
          as: 'district',
          attributes: ['id', 'name', 'type'],
        },
        { model: Ward, as: 'ward', attributes: ['id', 'name', 'type'] },
      ],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    return response(
      { shops: rows, totalShops: count, currentPage: page },
      httpStatus.OK,
      res
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    update shop information
 * @route   PUT /api/v1/shops/:shopId
 */
exports.updateShopInformation = async (req, res, next) => {
  try {
    const shopId = req.params.shopId;
    const authorId = req.user.id;
    await Shop.update(req.body, {
      where: { id: shopId, userId: authorId },
    });
    return response({ success: true }, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    delete shop
 * @route   DELETE /api/v1/shops/:shopId
 */
exports.deleteShop = async (req, res, next) => {
  try {
    const shopId = req.params.shopId;
    const authorId = req.user.id;
    await Shop.destroy({
      where: { id: shopId, userId: authorId },
    });
    return response({ success: true }, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Update or add new promotion
 * @route   POST /api/v1/shops/:shopId/promotions
 */
exports.addPromotion = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { shopId } = req.params;
    const { standarFee, discount, content, expiredAt } = req.body;

    // //update or create Promotion table
    // const [promotion, created] = await Promotion.findOrCreate({
    //   where: { shopId, standarFee },
    //   defaults: {
    //     shopId,
    //     standarFee,
    //     discount,
    //     content,
    //   },
    // });
    // if (!created) {
    //   await promotion.update({ standarFee, discount, content });
    // }
    const promotion = await Promotion.create({
      shopId,
      standarFee,
      discount,
      content,
      expiredAt,
    });

    return response(promotion, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    get list unexpired promotions of this shop
 * @route   GET /api/v1/shops/:shopId/promotions
 */
exports.getUnexpiredPromotions = async (req, res, next) => {
  try {
    //get list promotion of this shop
    const { shopId } = req.params;
    const promotions = await Promotion.findAll({
      where: {
        shopId,
        expiredAt: { [Op.gte]: Date.now() },
      },
    });

    return response(promotions, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    get list all promotions of shop
 * @route   GET /api/v1/shops/:shopId/promotions/all
 */
exports.getAllPromotions = async (req, res, next) => {
  try {
    //get list promotion of this shop
    const { page, limit } = req.query;
    const startIndex = (page - 1) * limit;
    const { shopId } = req.params;
    const { count, rows } = await Promotion.findAndCountAll({
      where: { shopId },
      limit,
      offset: startIndex,
      order: [['createdAt', 'DESC']],
      distinct: true,
    });
    return response(
      { promotions: rows, totalPromotions: count, currentPage: page },
      httpStatus.OK,
      res
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    get promotion of this shop
 * @route   GET /api/v1/shops/:shopId/promotions/:promotionId
 */
exports.getPromotion = async (req, res, next) => {
  try {
    const { shopId, promotionId } = req.params;

    const promotion = await Promotion.findOne({
      where: { shopId, id: promotionId },
    });

    return response(promotion, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    update promotion of this shop
 * @route   PUT /api/v1/shops/:shopId/promotions/:promotionId
 */
exports.updatePromotion = async (req, res, next) => {
  try {
    const { shopId, promotionId } = req.params;
    const { standarFee, discount, content, expiredAt } = req.body;
    const result = await Promotion.update(
      { standarFee, discount, content, expiredAt },
      { where: { shopId, id: promotionId } }
    );
    if (!result[0]) {
      throw new customError('error.not_found', httpStatus.NOT_FOUND);
    }
    return response({ success: true }, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    delete promotion of this shop
 * @route   DELETE /api/v1/shops/:shopId/promotions/:promotionId
 */
exports.deletePromotion = async (req, res, next) => {
  try {
    //delete promotion of this shop
    const { shopId, promotionId } = req.params;
    const userId = req.user.id;
    await Promotion.destroy({ where: { shopId, id: promotionId } });
    return response({ success: true }, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};
