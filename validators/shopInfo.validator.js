const Joi = require('joi');
const CoreValidator = require('./CoreValidator');
class ShopDetail extends CoreValidator {
  constructor() {
    const schema = {
      body: Joi.object({
        name: Joi.string().min(1).max(50).trim().required(),
        description: Joi.string().min(1).max(100).trim().allow(null, ''),
        avatar: Joi.string().trim().allow('').allow(null),
        coverImage: Joi.string().trim().allow('').allow(null),
        addressDetail: Joi.string().trim().allow('').allow(null),
        phone: Joi.string().trim().allow('').allow(null),
        cityId: Joi.string().length(2).trim().required(),
        districtId: Joi.string().length(3).trim().required(),
        wardId: Joi.string().length(5).trim().required(),
        paypalMail: Joi.string().email().lowercase().trim().required(),
      }),
    };
    super(schema);
  }
}

module.exports = new ShopDetail();
