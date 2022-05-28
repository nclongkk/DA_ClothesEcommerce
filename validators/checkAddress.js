const Joi = require('joi');
const CoreValidator = require('./CoreValidator');
class Address extends CoreValidator {
  constructor() {
    const schema = {
      body: Joi.object({
        cityId: Joi.string().trim().max(2).required().default('01'),
        districtId: Joi.string().trim().max(3).required().default('001'),
        wardId: Joi.string().trim().max(5).required().default('00001'),
        detail: Joi.string().trim().max(50),
        name: Joi.string().trim().max(50).required(),
        phone: Joi.string().trim().max(11).required().default('0123456789'),
      }),
    };
    super(schema);
  }
}

module.exports = new Address();
