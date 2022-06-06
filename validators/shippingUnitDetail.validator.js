const Joi = require('joi');
const CoreValidator = require('./CoreValidator');
class ShippingUnitDetail extends CoreValidator {
  constructor() {
    const schema = {
      body: Joi.object({
        name: Joi.string().min(1).max(50).trim().required(),
        description: Joi.string().min(1).max(50).trim().required(),
        workingTime: Joi.string().min(1).max(50).trim().required(),
        fee: Joi.number().required(),
        maxOrderValue: Joi.number().required(),
      }),
    };
    super(schema);
  }
}

module.exports = new ShippingUnitDetail();
