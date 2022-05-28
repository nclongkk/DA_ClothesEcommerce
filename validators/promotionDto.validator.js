const Joi = require('joi');
const CoreValidator = require('./CoreValidator');
class PromotionDto extends CoreValidator {
  constructor() {
    const schema = {
      body: Joi.object({
        standarFee: Joi.number().required(),
        discount: Joi.number().required(),
        content: Joi.string().trim().required(),
        expiredAt: Joi.date().required(),
      }),
    };
    super(schema);
  }
}

module.exports = new PromotionDto();
