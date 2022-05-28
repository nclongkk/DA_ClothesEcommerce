const httpStatus = require('http-status');
const axios = require('axios').default;
const { Op } = require('sequelize');
const { User, CodeVerify, sequelize } = require('../models');
const { encrypt, isMatch } = require('../utils/passwordHandle');
const customError = require('../utils/customError');
const { sendTokenResponse, response } = require('../utils/response');
const genSecretCode = require('../utils/genSecretCode');
const sendEmail = require('../utils/sendEmail');

/**
 * @desc     Register user
 * @route    POST /api/v1/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    let { name, email, password } = req.body;

    // check if email already in use
    const user = await User.findOne({ where: { email } });
    if (user) {
      throw new customError(
        'error.email_already_registered',
        httpStatus.BAD_REQUEST
      );
    }
    // encrypt password
    password = await encrypt(password);
    let secretCode = genSecretCode(6);

    await CodeVerify.create({
      email,
      name,
      password,
      code: secretCode,
    });

    //send secretCode to email of user
    await sendEmail({
      email,
      subject: 'Email verifier',
      message: `Your secret code is: ${secretCode}, please fill it to completely create your account`,
    });

    return response({ success: true }, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc     create new account if secretCode existed in system
 * @route    POST /api/v1/auth/verify-email
 */
exports.verifyEmail = async (req, res, next) => {
  try {
    const { secretCode, email } = req.body;
    const user = await CodeVerify.findOne({
      where: {
        email,
        code: secretCode,
        createdAt: { [Op.gte]: new Date(Date.now() - 5 * 60 * 1000) },
      },
      order: [['createdAt', 'DESC']],
    });
    if (!user) {
      throw new customError(
        'error.expired_or_didnt_exist',
        httpStatus.BAD_REQUEST
      );
    }
    const newUser = await User.create({
      email: user.email,
      name: user.name,
      password: user.password,
    });
    await user.destroy();
    return sendTokenResponse(newUser, httpStatus.CREATED, res);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc     Login user
 * @route    POST /api/v1/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user)
      return next(
        new customError('error.not_registered', httpStatus.UNAUTHORIZED)
      );

    const checkPassword = await isMatch(password, user.password);
    if (!checkPassword)
      return next(
        new customError(
          'error.password_does_not_match',
          httpStatus.UNAUTHORIZED
        )
      );

    return sendTokenResponse(user, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc     Login/register via facebook
 * @route    POST /api/v1/auth/facebook
 */
exports.loginFacebook = async (req, res, next) => {
  try {
    const { userId, accessToken } = req.body;
    const url = `${process.env.API_FACEBOOK_URL}/${userId}?fields=id,name,email&access_token=${accessToken}`;
    let { data } = await axios({
      url,
      method: 'get',
    });
    const user = await User.findOne({ where: { facebookId: data.id } });
    if (user) {
      return sendTokenResponse(user, httpStatus.OK, res);
    }

    //create new user
    const newUser = await User.create({
      name: data.name,
      email: data.email,
      facebookId: data.id,
    });
    return sendTokenResponse(newUser, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc     Log out clear cookie
 * @route    GET /api/v1/auth/logout
 */
exports.logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      httpOnly: true,
    });
    return response({ success: true }, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc     forgot password
 * @route    POST /api/v1/auth/forgot-password
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new customError('error.not_registered', httpStatus.BAD_REQUEST);
    }

    const secretCode = genSecretCode(6);
    await CodeVerify.create({
      email,
      code: secretCode,
    });
    //send secretCode to email of user
    await sendEmail({
      email,
      subject: 'Email verifier',
      message: `Your secret code is: ${secretCode}, please fill it to verify your email`,
    });
    return response({ success: true }, httpStatus.OK, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc     generate new password and send it to email of user
 * @route    POST /api/v1/auth/reset-password
 */
exports.resetPassword = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { email, secretCode } = req.body;
    const savedCode = await CodeVerify.findOne({
      where: {
        email,
        createdAt: { [Op.gte]: new Date(Date.now() - 5 * 60 * 1000) },
      },
      order: [['createdAt', 'DESC']],
    });

    if (!savedCode) {
      throw new customError(
        'error.expired_or_didnt_exist',
        httpStatus.BAD_REQUEST
      );
    }
    console.log(savedCode.code);
    if (savedCode.code !== secretCode) {
      throw new customError('error.code_incorrect', httpStatus.BAD_REQUEST);
    }

    const newPassword = genSecretCode(8);
    // encrypt password
    const encryptedPassword = await encrypt(newPassword);

    await User.update(
      { password: encryptedPassword },
      { where: { email } },
      { transaction: t }
    );
    //send new password to email of user
    await sendEmail({
      email,
      subject: 'Reset password',
      message: `Your new password is: ${newPassword},to ensure safety, please login again and change it`,
    });
    await t.commit();
    return response({ success: true }, httpStatus.OK, res);
  } catch (error) {
    await t.rollback();
    return next(error);
  }
};
