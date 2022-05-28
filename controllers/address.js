const httpStatus = require('http-status');
const { City, District, Ward } = require('../models');
const customError = require('../utils/customError');
const { response } = require('../utils/response');

/**
 * @desc    get all cities of Viet Nam
 * @route   GET /api/v1/adress/cities
 */
exports.getCities = async (req, res, next) => {
  try {
    const cities = await City.findAll({ attributes: ['id', 'name', 'type'] });
    return response(cities, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    get all district of city
 * @route   GET /api/v1/adress/districts
 */
exports.getDistricts = async (req, res, next) => {
  try {
    const cityId = req.query.cityId;
    const districts = await District.findAll({
      attributes: ['id', 'name', 'type'],
      where: { cityId },
    });
    return response(districts, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    get all wards of district
 * @route   GET /api/v1/adress/wards
 */
exports.getWards = async (req, res, next) => {
  try {
    const districtId = req.query.districtId;
    const wards = await Ward.findAll({
      attributes: ['id', 'name', 'type'],
      where: { districtId },
    });
    return response(wards, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};
