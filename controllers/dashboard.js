const httpStatus = require('http-status');
const { Order, Promotion, OrderItem, sequelize } = require('../models');
const { Op, and, or, where } = require('sequelize');
const customError = require('../utils/customError');
const { response } = require('../utils/response');
const { ORDER_STATUS, TRANSACTION_STATUS } = require('../constants/constants');
const paypal = require('@paypal/payouts-sdk');
const feedback = require('../models/feedback');

/**
 * @desc    Get shop statistics
 * @route   GET /api/v1/dashboard/statistics
 */
exports.getShopStatistics = async (req, res, next) => {
  try {
    const shopId = req.user.shop.id;
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);
    console.log(new Date());
    const findingQuery = {
      shopId,
      [Op.or]: [
        { status: ORDER_STATUS.DELIVERED },
        { status: ORDER_STATUS.SHIPPED },
      ],
      createdAt: {
        [Op.between]: [start, end],
      },
    };

    let [earning, sold, pendingOrder] = await Promise.all([
      Order.findOne({
        where: findingQuery,
        attributes: [
          [
            sequelize.fn(
              'SUM',
              sequelize.literal('amount * (1-serviceFeePercentage)')
            ),
            'earned',
          ],
        ],
        raw: true,
      }),
      Order.findAll({
        where: findingQuery,
        include: [
          {
            model: OrderItem,
            as: 'orderItems',
            attributes: [
              [sequelize.fn('SUM', sequelize.col('quantity')), 'Quantity'],
            ],
          },
        ],
      }),
      Order.findAll({
        where: {
          shopId,
          status: ORDER_STATUS.PENDING,
          createdAt: {
            [Op.between]: [start, end],
          },
        },
        attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        raw: true,
      }),
    ]);

    sold = JSON.parse(JSON.stringify(sold));
    let productSold = 0;
    if (sold[0].orderItems[0]) {
      productSold = sold[0].orderItems[0].Quantity;
    }
    return response(
      {
        earning: earning.earned,
        productSold,
        pendingOrders: pendingOrder[0].count,
      },
      httpStatus.OK,
      res
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Get shop earnings
 * @route   GET /api/v1/dashboard/earnings
 */
exports.getShopEarnings = async (req, res, next) => {
  try {
    const shopId = req.user.shop.id;
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);
    let groupBy = 'Date';
    if (countDates(start, end) > 40) {
      groupBy = 'Month';
    }

    let earnings = await Order.findAll({
      where: {
        shopId,
        [Op.or]: [
          { status: ORDER_STATUS.DELIVERED },
          { status: ORDER_STATUS.SHIPPED },
        ],
        createdAt: {
          [Op.between]: [start, end],
        },
      },
      attributes: [
        'serviceFeePercentage',
        [sequelize.fn('SUM', sequelize.col('amount')), 'earned'],
        [sequelize.fn('Date', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
      ],
      group: sequelize.literal(`${groupBy}(createdAt)`),
    });
    earnings = JSON.parse(JSON.stringify(earnings));
    let categories = [];
    let data = [];
    if (groupBy === 'Date') {
      while (start <= end) {
        categories.push(start.toLocaleDateString());
        data.push(0);
        start.setDate(start.getDate() + 1);
      }
      earnings.forEach((earning) => {
        const index = categories.indexOf(
          new Date(earning.date).toLocaleDateString()
        );
        data[index] = earning.earned * (1 - earning.serviceFeePercentage);
        data[index] = data[index].toFixed(2);
      });
    }

    if (groupBy === 'Month') {
      while (start <= end) {
        categories.push(start.getMonth() + 1);
        data.push(0);
        start.setMonth(start.getMonth() + 1);
      }
      earnings.forEach((earning) => {
        const index = categories.indexOf(earning.month);
        data[index] = earning.earned * (1 - earning.serviceFeePercentage);
        data[index] = data[index].toFixed(2);
      });
    }
    return response({ categories, data }, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};

//function count number of dates between two dates
function countDates(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((start - end) / oneDay));
}
