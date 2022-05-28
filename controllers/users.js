const httpStatus = require('http-status');
const { User, Address, City, District, Ward } = require('../models');
const customError = require('../utils/customError');
const { response, sendTokenResponse } = require('../utils/response');
const { isMatch, encrypt } = require('../utils/passwordHandle');

/**
 * @desc    get user information
 * @route   GET /api/v1/users/
 */
exports.getMe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findOne({
      attributes: { exclude: ['password'] },
      where: { id: userId },
    });
    if (!user) {
      throw new customError('error.not_found', httpStatus.BAD_REQUEST);
    }
    return response(user, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Modify user detail
 * @route   PUT  /api/v1/users
 */
exports.updateDetails = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, email, avatar, phone, coverImage, gender } = req.body;
    await User.update(
      {
        name,
        email,
        avatar,
        phone,
        coverImage,
        gender,
      },
      { where: { id: userId } }
    );

    return response({ success: true }, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Modify user detail
 * @route   PATCH  /api/v1/users
 */
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });

    const matchPassword = await isMatch(
      req.body.currentPassword,
      user.password
    );
    if (!matchPassword)
      return next(
        new customError('error.password_does_not_match', httpStatus.BAD_REQUEST)
      );

    const newPassword = await encrypt(req.body.newPassword);
    user.password = newPassword;
    await user.save();

    return sendTokenResponse(user, 200, res);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Add new address for user
 * @route   POST  /api/v1/users/addresses
 */
exports.setNewAddress = async (req, res, next) => {
  try {
    const { cityId, districtId, wardId, detail, name, phone } = req.body;
    const userId = req.user.id;
    await Address.create({
      userId,
      cityId,
      districtId,
      wardId,
      detail,
      name,
      phone,
    });
    return response({ success: true }, httpStatus.CREATED, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    get list address of user
 * @route   GET  /api/v1/users/addresses
 */
exports.getListAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const addresses = await Address.findAll({
      where: { userId },
      include: [
        // { model: User, as: 'user' },
        { model: City, as: 'city', attributes: ['id', 'name', 'type'] },
        { model: District, as: 'district', attributes: ['id', 'name', 'type'] },
        { model: Ward, as: 'ward', attributes: ['id', 'name', 'type'] },
      ],
    });
    return response(addresses, httpStatus.CREATED, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    update an address
 * @route   PATCH  /api/v1/users/addresses/:addressId
 */
exports.updateAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await Address.update(req.body, {
      where: { userId, id: req.params.addressId },
    });
    return response({ success: true }, httpStatus.CREATED, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    delete an address
 * @route   DELETE  /api/v1/users/addresses/:addressId
 */
exports.deleteAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await Address.destroy({
      where: { userId, id: req.params.addressId },
    });
    return response({ success: true }, httpStatus.OK, res);
  } catch (error) {
    next(error);
  }
};
