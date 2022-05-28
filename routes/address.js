const express = require('express');
const { getCities, getDistricts, getWards } = require('../controllers/address');
const getDistrictValidator = require('../validators/getdistrict.validator');
const getWardValidator = require('../validators/getward.validator');

const router = express.Router();

router.route('/cities').get(getCities);
router.route('/districts').get(getDistrictValidator.validate(), getDistricts);
router.route('/wards').get(getWardValidator.validate(), getWards);

module.exports = router;
