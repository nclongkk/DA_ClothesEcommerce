const httpStatus = require('http-status');
const { User, ShippingUnit } = require('../models');
const customError = require('../utils/customError');
const { response } = require('../utils/response');

/**
 * @desc    Add new shipping unit for system
 * @route   POST /api/v1/shipping-units/
 * @access  Admin
 */
exports.addNewShippingUnit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findOne({ where: { id: userId } });
    if (user.role !== 'admin') {
      return next(new customError('error.not_authorize', httpStatus.FORBIDDEN));
    }
    const { name, description, workingTime, fee, maxOrderValue } = req.body;
    const newShippingUnit = await ShippingUnit.create({
      name,
      description,
      workingTime,
      fee,
      maxOrderValue,
    });
    return response(newShippingUnit, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    update detail of shipping unit
 * @route   PUT /api/v1/shipping-units/:shippingUnitId
 * @access  Admin
 */
exports.updateShippingUnit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const shippingUnitId = req.params.shippingUnitId;
    const user = await User.findOne({ where: { id: userId } });
    if (user.role !== 'admin') {
      return next(new customError('error.not_authorize', httpStatus.FORBIDDEN));
    }
    const { name, description, workingTime, fee, maxOrderValue } = req.body;

    await ShippingUnit.update(
      { name, description, workingTime, fee, maxOrderValue },
      { where: { id: shippingUnitId } }
    );
    return response({ success: true }, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    get all shipping unit
 * @route   GET /api/v1/shipping-units/
 */
exports.getShippingUnits = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const shippingUnits = await ShippingUnit.findAll();
    return response(shippingUnits, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    delete a shipping unit
 * @route   DELETE /api/v1/shipping-units/:shippingUnitId
 * @access  Admin
 */
exports.deleteShippingUnit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const shippingUnitId = req.params.shippingUnitId;
    const user = await User.findOne({ where: { id: userId } });
    if (user.role !== 'admin') {
      return next(new customError('error.not_authorize', httpStatus.FORBIDDEN));
    }

    await ShippingUnit.destroy({ where: { id: shippingUnitId } });
    return response({ success: true }, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};
