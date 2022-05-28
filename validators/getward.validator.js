const Joi = require('joi');
const CoreValidator = require('./CoreValidator');
class District extends CoreValidator {
  constructor() {
    const schema = {
      query: Joi.object({
        districtId: Joi.string().trim().max(3).default('001'),
      }),
    };
    super(schema);
  }
}

module.exports = new District();
