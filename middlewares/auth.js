const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const customError = require('../utils/customError');
const { Shop } = require('../models');

// Protect routes
exports.authenticate = (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      const parserTokens = req.headers.authorization.split('Bearer ');
      token = parserTokens[1];
    }
    // Make sure token exists
    if (!token) {
      return next(
        new customError('error.not_authorize', httpStatus.UNAUTHORIZED)
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(
      new customError('error.not_authorize', httpStatus.UNAUTHORIZED)
    );
  }
};

exports.authorize = (...roles) => {
  return async (req, res, next) => {
    if (roles.includes('admin')) {
      if (req.user.id === 1) {
        return next();
      }
    }
    if (roles.includes('shopOwner')) {
      const shop = await Shop.findOne({
        where: { userId: req.user.id },
        attributes: ['id', 'userId'],
        raw: true,
      });
      if (shop) {
        req.user.shop = shop;
        return next();
      }
    }

    return next(
      new customError('error.not_authorize', httpStatus.UNAUTHORIZED)
    );
  };
};
