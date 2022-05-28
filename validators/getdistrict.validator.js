const Joi = require('joi');
const CoreValidator = require('./CoreValidator');
class District extends CoreValidator {
  constructor() {
    const schema = {
      query: Joi.object({
        cityId: Joi.string().trim().max(2).default('01'),
      }),
    };
    super(schema);
  }
}

module.exports = new District();
