const httpStatus = require('http-status');
const { User, Shop, Order, Transaction, sequelize } = require('../models');
const { Op, and, or, where } = require('sequelize');
const customError = require('../utils/customError');
const { response } = require('../utils/response');
const { ORDER_STATUS, TRANSACTION_STATUS } = require('../constants/constants');
const paypal = require('@paypal/payouts-sdk');
const feedback = require('../models/feedback');
const { getOrdersOfShop } = require('./orders');

/**
 * @desc    Get users of system
 * @route   GET /api/v1/admin/users
 */
exports.getUsers = async (req, res, next) => {
  try {
    let { page, limit } = req.query;
    limit = parseInt(limit, 10);
    const startIndex = (page - 1) * limit;
    const { rows, count } = await User.findAndCountAll({
      where: {
        role: {
          [Op.ne]: 'admin',
        },
      },
      limit,
      offset: startIndex,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'email', 'isActive', 'createdAt', 'avatar', 'name'],
    });
    return response(
      { users: rows, totalUsers: count, currentPage: page },
      httpStatus.OK,
      res
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    get report of registered users in system
 * @route   GET /api/v1/admin/users/statistics
 */
exports.statisticUserRegister = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);
    let groupBy = 'Date';
    if (countDates(start, end) > 40) {
      groupBy = 'Month';
    }
    let users = await User.findAll({
      where: {
        role: {
          [Op.ne]: 'admin',
        },
        createdAt: {
          [Op.between]: [start, end],
        },
      },
      attributes: [
        [sequelize.fn(`${groupBy}`, sequelize.col('createdAt')), `${groupBy}`],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: [sequelize.fn(`${groupBy}`, sequelize.col('createdAt'))],
      raw: true,
    });
    let chartData = [];
    if (groupBy === 'Date') {
      while (start <= end) {
        chartData.push({ name: start.toLocaleDateString(), 'Active User': 0 });
        start.setDate(start.getDate() + 1);
      }
      users.forEach((user) => {
        const index = chartData.findIndex(
          (data) =>
            data.name === new Date(user[`${groupBy}`]).toLocaleDateString()
        );
        if (index !== -1) {
          chartData[index]['Active User'] = user.count;
        }
      });
    }
    if (groupBy === 'Month') {
      while (start <= end) {
        chartData.push({ name: start.getMonth() + 1, 'Active User': 0 });
        start.setMonth(start.getMonth() + 1);
      }
      users.forEach((user) => {
        const index = chartData.findIndex(
          (data) => data.name === user[`${groupBy}`]
        );
        if (index !== -1) {
          chartData[index]['Active User'] = user.count;
        }
      });
    }

    return response(chartData, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    update user status
 * @route   PATCH /api/v1/admin/users/:userId/status
 */
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return next(customError(`error.user_not_found`, httpStatus.NOT_FOUND));
    }
    await user.update({
      isActive,
    });
    return response(user, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    list all transactions
 * @route   GET /api/v1/admin/transactions
 */
exports.getTransactions = async (req, res, next) => {
  try {
    let { page, limit } = req.query;
    limit = parseInt(limit, 10);
    const startIndex = (page - 1) * limit;
    const { rows, count } = await Transaction.findAndCountAll({
      limit,
      offset: startIndex,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'avatar', 'name'],
        },
        {
          model: Shop,
          as: 'shop',
          attributes: ['id', 'name', 'avatar'],
        },
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'status', 'serviceFeePercentage', 'amount'],
        },
      ],
    });

    return response(
      { transactions: rows, totalTransactions: count, currentPage: page },
      httpStatus.OK,
      res
    );
  } catch (error) {
    return next(error);
  }
};

const countDates = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((start - end) / oneDay));
};
