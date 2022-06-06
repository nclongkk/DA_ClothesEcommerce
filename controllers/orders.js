const httpStatus = require('http-status');
const {
  User,
  Product,
  ProductVersion,
  CartItem,
  City,
  District,
  Ward,
  ShippingUnit,
  Shipping,
  Shop,
  Address,
  Order,
  Promotion,
  OrderItem,
  Transaction,
  //   Feedback,
  //   FeedbackImage,
  sequelize,
} = require('../models');
const { Op, and, or, where } = require('sequelize');
const customError = require('../utils/customError');
const { response } = require('../utils/response');
const { ORDER_STATUS, TRANSACTION_STATUS } = require('../constants/constants');
const paypal = require('@paypal/payouts-sdk');
// const feedback = require('../models/feedback');

/**
 * @desc    add new order
 * @route   POST /api/v1/orders
 */
exports.addOrder = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    let {
      addressId,
      shopId,
      promotionId,
      shippingUnitId,
      orderItems,
      isPurchased = false,
      senderPayPalMail,
    } = req.body;

    const add = (accumulator, a) => accumulator + a;

    let totalPayment = (
      await Promise.all(
        orderItems.map(async (orderItem) => {
          const productVersion = await ProductVersion.findOne({
            where: { id: orderItem.productVersionId },
            attributes: ['id', 'price', 'quantity'],
            raw: true,
          });
          if (!productVersion) {
            throw new customError(
              'error.product_version_not_found',
              httpStatus.NOT_FOUND
            );
          }
          if (orderItem.quantity > productVersion.quantity) {
            throw new customError(
              'error.product_version_not_enough',
              httpStatus.NOT_FOUND
            );
          }
          return productVersion.price * orderItem.quantity;
        })
      )
    ).reduce(add);

    if (promotionId) {
      //get promotion of shop
      const promotion = await Promotion.findOne({
        where: { id: promotionId, shopId },
      });
      if (!promotion) {
        throw new customError(
          'error.promotion_not_found',
          httpStatus.NOT_FOUND
        );
      }
      totalPayment = totalPayment * (1 - promotion.discount / 100);
    }
    if (shippingUnitId) {
      let shippingUnit = await ShippingUnit.findOne({
        where: { id: shippingUnitId },
      });
      shippingUnit = JSON.parse(JSON.stringify(shippingUnit));
      if (!shippingUnit) {
        throw new customError(
          'error.shipping_unit_not_found',
          httpStatus.NOT_FOUND
        );
      }
      if (
        shippingUnit.maxOrderValue &&
        totalPayment > shippingUnit.maxOrderValue
      ) {
        throw new customError(
          'error.order_value_exceeded',
          httpStatus.BAD_REQUEST
        );
      }
      // totalPayment = totalPayment + shippingUnit.fee;
    }

    const order = await Order.create(
      {
        addressId,
        userId,
        shopId,
        promotionId,
        shippingUnitId,
        serviceFeePercentage: process.env.SERVICE_FEE_PERCENTAGE,
        status: ORDER_STATUS.PENDING,
        isPurchased,
        amount: totalPayment,
      },
      { transaction: t }
    );

    // add order items to order
    orderItems.forEach((orderItem) => {
      orderItem.orderId = order.id;
    });
    await OrderItem.bulkCreate(orderItems, { transaction: t });

    await Promise.all(
      orderItems.map((orderItem) =>
        CartItem.destroy(
          { where: { userId, productVersionId: orderItem.productVersionId } },
          { transaction: t }
        )
      )
    );

    if (isPurchased) {
      // query shop to get paypal account
      const shop = await Shop.findOne({
        where: { id: shopId },
        attributes: ['paypalMail'],
      });

      //update transaction collection
      await Transaction.create(
        {
          orderId: order.id,
          userId,
          shopId,
          status: TRANSACTION_STATUS.PENDING,
          senderPayPalMail,
        },
        { transaction: t }
      );
    }

    await t.commit();
    return response(order, httpStatus.OK, res);
  } catch (error) {
    await t.rollback();
    return next(error);
  }
};

/**
 * @desc    Get orders of shop
 * @route   GET /api/v1/orders/shop-owner
 */
exports.getOrdersOfShop = async (req, res, next) => {
  try {
    const shopId = req.user.shop.id;
    const { page, limit } = req.query;
    const startIndex = (page - 1) * limit;
    const { rows, count } = await Order.findAndCountAll({
      where: { shopId },
      limit,
      offset: startIndex,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'status', 'amount', 'createdAt'],
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: ProductVersion,
              as: 'productVersion',
              include: [
                {
                  model: Product,
                  as: 'product',
                  attributes: ['id', 'name'],
                },
              ],
              attributes: ['id', 'size', 'color', 'price', 'image'],
            },
          ],
          attributes: ['id', 'quantity'],
        },
        {
          model: ShippingUnit,
          as: 'shippingUnit',
          attributes: ['id', 'name', 'fee'],
        },
      ],
      distinct: true,
    });
    return response(
      { orders: rows, totalOrders: count, currentPage: page },
      httpStatus.OK,
      res
    );
  } catch (error) {
    next(error);
  }
};
/**
 * @desc    Get orders of user
 * @route   GET /api/v1/orders
 */
exports.getOrdersOfUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page, limit } = req.query;
    const startIndex = (page - 1) * limit;
    //get orders with pagination
    const { rows, count } = await Order.findAndCountAll({
      where: { userId },
      limit,
      offset: startIndex,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'amount', 'status', 'createdAt'],
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: ProductVersion,
              as: 'productVersion',
              include: [
                {
                  model: Product,
                  as: 'product',
                  attributes: ['id', 'name'],
                },
              ],
              attributes: ['id', 'size', 'color', 'price', 'image'],
            },
          ],
          attributes: ['id', 'quantity'],
        },
        {
          model: Shop,
          as: 'shop',
          attributes: ['id', 'name'],
        },
        {
          model: ShippingUnit,
          as: 'shippingUnit',
          attributes: ['id', 'name', 'fee'],
        },
      ],
      distinct: true,
    });
    return response(
      { orders: rows, totalOrders: count, currentPage: page },
      httpStatus.OK,
      res
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Get order by id
 * @route   GET /api/v1/orders/:orderId
 */
exports.getOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findOne({
      where: { id: orderId },
      attributes: ['id', 'amount', 'status', 'isPurchased', 'createdAt'],
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: ProductVersion,
              as: 'productVersion',
              include: [
                {
                  model: Product,
                  as: 'product',
                  attributes: ['id', 'name'],
                },
              ],
              attributes: ['id', 'size', 'color', 'price', 'image'],
            },
            {
              model: Feedback,
              as: 'feedback',
              attributes: ['id', 'content', 'rating', 'createdAt'],
              include: [
                {
                  model: FeedbackImage,
                  as: 'feedbackImages',
                  attributes: ['id', 'image'],
                },
              ],
            },
          ],
          attributes: ['id', 'quantity'],
        },

        {
          model: Shop,
          as: 'shop',
          attributes: ['id', 'name'],
        },
        {
          model: Promotion,
          as: 'promotion',
          attributes: ['id', 'discount'],
        },
        {
          model: ShippingUnit,
          as: 'shippingUnit',
          attributes: ['id', 'name', 'fee'],
        },
        {
          model: Address,
          as: 'address',
          attributes: ['id', 'name', 'phone', 'detail'],
          include: [
            // { model: User, as: 'user' },
            { model: City, as: 'city', attributes: ['id', 'name', 'type'] },
            {
              model: District,
              as: 'district',
              attributes: ['id', 'name', 'type'],
            },
            { model: Ward, as: 'ward', attributes: ['id', 'name', 'type'] },
          ],
        },
      ],
    });
    if (!order) {
      return response(null, httpStatus.NOT_FOUND, res);
    }
    return response(order, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Update order status for shop owner
 * @route   PATCH /api/v1/orders/:orderId/shop-owner
 * @access  Shop owner
 */
exports.updateOrderStatusForShop = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;
    let order = await Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: Shop,
          as: 'shop',
          attributes: ['id', 'name', 'userId', 'paypalMail'],
        },
        {
          model: OrderItem,
          as: 'orderItems',
          attributes: ['id', 'quantity'],
          include: [
            {
              model: ProductVersion,
              as: 'productVersion',
              attributes: ['id', 'productId'],
            },
          ],
        },
      ],
    });
    // order = JSON.parse(JSON.stringify(order));
    if (!order) {
      return next(
        new customError('error.Order_not_found', httpStatus.NOT_FOUND)
      );
    }
    if (order.shop.userId !== req.user.id) {
      return next(
        new customError('error.Shop_not_have_order', httpStatus.NOT_FOUND)
      );
    }

    // cannot change status from processing to pending and shipped to processing
    if (
      (order.status === ORDER_STATUS.PROCESSING &&
        status === ORDER_STATUS.PENDING) ||
      (order.status === ORDER_STATUS.SHIPPED &&
        status === ORDER_STATUS.PROCESSING)
    ) {
      return next(
        new customError('error.Cannot_change_status', httpStatus.BAD_REQUEST)
      );
    }

    if (status === ORDER_STATUS.SHIPPED) {
      //update status of transaction
      await Transaction.update(
        { status: TRANSACTION_STATUS.TRANSFERRED },
        {
          where: { orderId },
        },
        { transaction: t }
      );
      order.orderItems.forEach(async (item) => {
        await ProductVersion.update(
          { quantity: sequelize.literal('quantity - ' + item.quantity) },
          {
            where: { id: item.productVersion.id },
          },
          { transaction: t }
        );
        await Product.update(
          {
            soldQuantity: sequelize.literal('soldQuantity + ' + item.quantity),
          },
          {
            where: { id: item.productVersion.productId },
          },
          { transaction: t }
        );
      });
      //creat transaction via paypal
      let environment = new paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      );
      const paypalFee = parseFloat(process.env.PAYPAL_FEE);
      let client = new paypal.core.PayPalHttpClient(environment);
      let request = new paypal.payouts.PayoutsPostRequest();
      request.requestBody({
        sender_batch_header: {
          recipient_type: 'EMAIL',
          email_message: `Customer has paid for your product, service fee: ${
            order.serviceFeePercentage * 100
          }%, paypal fee: ${paypalFee}$`,
          note: '',
          sender_batch_id: `shop-${order.id}`,
          email_subject: 'Money transferred from customer',
        },
        items: [
          {
            recipient_type: 'EMAIL',
            amount: {
              value: `${(
                order.amount * (1 - order.serviceFeePercentage) -
                paypalFee
              ).toFixed(2)}`,
              currency: 'USD',
            },
            receiver: order.shop.paypalMail,
            note: 'Thank you.',
            sender_item_id: `shop-${order.id}`,
          },
        ],
      });
      let paypalResponse = await client.execute(request);
      if (paypalResponse.statusCode >= 400) {
        throw new customError(
          'error.Paypal_send_to_shop_error',
          httpStatus.BAD_REQUEST
        );
      }
    }
    await order.update({ status });
    await t.commit();
    return response(order, httpStatus.OK, res);
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

/**
 * @desc    Confirm order receipt
 * @route   PATCH /api/v1/orders/:orderId/confirm-receipt
 * @access  Customer
 */
exports.confirmReceipt = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findOne({
      where: { id: orderId },
    });
    if (!order) {
      return next(
        new customError('error.Order_not_found', httpStatus.NOT_FOUND)
      );
    }
    if (order.userId !== req.user.id) {
      return next(
        new customError('error.User_not_have_order', httpStatus.NOT_FOUND)
      );
    }
    if (order.status !== ORDER_STATUS.SHIPPED) {
      return next(
        new customError('error.Order_not_shipped_yet', httpStatus.NOT_FOUND)
      );
    }
    await order.update({ status: ORDER_STATUS.DELIVERED });
    return response(order, httpStatus.OK, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel order
 * @route   DELETE /api/v1/orders/:orderId/cancel
 * @access  Customer or shop owner
 */
exports.cancelOrder = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const orderId = req.params.orderId;
    const order = await Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: Shop,
          as: 'shop',
          attributes: ['id', 'name', 'userId'],
        },
        {
          model: ShippingUnit,
          as: 'shippingUnit',
          attributes: ['id', 'name', 'fee'],
        },
      ],
    });
    if (!order) {
      return next(
        new customError('error.Order_not_found', httpStatus.NOT_FOUND)
      );
    }
    if (order.userId !== req.user.id) {
      if (order.shop.userId !== req.user.id) {
        return next(
          new customError('error.Not_found_any_order', httpStatus.NOT_FOUND)
        );
      }
    }
    if (
      order.status !== ORDER_STATUS.PENDING &&
      order.status !== ORDER_STATUS.PROCESSING
    ) {
      return next(
        new customError(
          'error.Order_not_pending_or_processing',
          httpStatus.NOT_FOUND
        )
      );
    }
    const transaction = await Transaction.findOne({ where: { orderId } });
    if (transaction) {
      //creat transaction via paypal
      let environment = new paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      );
      let client = new paypal.core.PayPalHttpClient(environment);
      let request = new paypal.payouts.PayoutsPostRequest();
      request.requestBody({
        sender_batch_header: {
          recipient_type: 'EMAIL',
          email_message: 'Your refund is completed',
          note: '',
          sender_batch_id: `REFUND-${order.id}`,
          email_subject: 'Refund for your canceled order',
        },
        items: [
          {
            recipient_type: 'EMAIL',
            amount: {
              value: `${order.amount + order.shippingUnit.fee}`,
              currency: 'USD',
            },
            receiver: transaction.senderPayPalMail,
            note: 'Thank you.',
            sender_item_id: `REFUND-${order.id}`,
          },
        ],
      });
      let paypalResponse = await client.execute(request);
      if (paypalResponse.statusCode >= 400) {
        throw new customError('error.Paypal_error', httpStatus.BAD_REQUEST);
      }
    }

    await Transaction.destroy(
      { where: { orderId: order.id } },
      { transaction: t }
    );
    await order.update({ status: ORDER_STATUS.CANCELED }, { transaction: t });
    await t.commit();
    return response(order, httpStatus.OK, res);
  } catch (error) {
    await t.rollback();
    next(error);
  }
};
