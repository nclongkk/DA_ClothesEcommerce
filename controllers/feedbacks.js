const httpStatus = require('http-status');
const {
  User,
  Product,
  Order,
  OrderItem,
  Feedback,
  FeedbackImage,
  Shop,
  sequelize,
} = require('../models');
const { ORDER_STATUS } = require('../constants/constants');
const customError = require('../utils/customError');
const { response } = require('../utils/response');

/**
 * @desc    add feedback for product
 * @route   POST /api/v1/products/:productId/feedbacks
 */
exports.addFeedback = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const productId = req.params.productId;
    let { content, rating, feedbackImages, orderItemId } = req.body;
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new customError(
        'error.product_does_not_exist',
        httpStatus.BAD_REQUEST
      );
    }
    const orderItem = await OrderItem.findOne({
      where: { id: orderItemId },
      include: [
        {
          model: Order,
          as: 'order',
          where: {
            userId,
            status: ORDER_STATUS.DELIVERED,
          },
        },
      ],
    });
    if (!orderItem) {
      throw new customError(
        'error.order_item_does_not_exist',
        httpStatus.BAD_REQUEST
      );
    }
    product.totalRatings += 1;
    product.avgRatings =
      (product.avgRatings * (product.totalRatings - 1) + rating) /
      product.totalRatings;
    await product.save({ transaction: t });
    const feedback = await Feedback.create(
      {
        userId,
        orderItemId,
        productId,
        content,
        rating,
      },
      { transaction: t }
    );
    feedbackImages = feedbackImages.map((image) => ({
      feedbackId: feedback.id,
      image,
    }));
    await FeedbackImage.bulkCreate(feedbackImages, {
      transaction: t,
    });
    await t.commit();
    return response(feedback, httpStatus.OK, res);
  } catch (error) {
    if (error.message === 'Validation error') {
      return next(
        new customError('error.duplicate_feedback', httpStatus.BAD_REQUEST)
      );
    }
    await t.rollback();
    return next(error);
  }
};

/**
 * @desc    list feedbacks of product
 * @route   GET /api/v1/products/:productId/feedbacks
 * @access  public
 */
exports.getFeedbacks = async (req, res, next) => {
  try {
    //Pagination, default page 1, limit 5
    const { page, limit } = req.query;
    const startIndex = (page - 1) * limit;
    const productId = req.params.productId;
    const { count, rows } = await Feedback.findAndCountAll({
      where: { productId },
      limit,
      offset: startIndex,
      order: [
        ['updatedAt', 'DESC'],
        ['rating', 'DESC'],
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'avatar'],
        },
        {
          model: FeedbackImage,
          as: 'feedbackImages',
          attributes: ['id', 'image'],
        },
      ],
      distinct: true,
    });
    return response(
      { feedbacks: rows, totalFeedbacks: count, currentPage: page },
      httpStatus.OK,
      res
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    delete feedback
 * @route   DELETE /api/v1/feedbacks/:feedbackId
 * @access  reviewers or shop owner
 */
exports.deleteFeedback = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const feedbackId = req.params.feedbackId;
    const feedback = await Feedback.findOne({
      where: { id: feedbackId },
      include: [
        {
          model: Product,
          as: 'product',
          include: [{ model: Shop, as: 'shop' }],
        },
      ],
    });

    if (userId !== feedback.userId && userId !== feedback.product.shop.userId) {
      throw new customError('error.not_authorize', httpStatus.UNAUTHORIZED);
    }
    await feedback.destroy();
    return response({ success: true }, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};
