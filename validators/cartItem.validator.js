const Joi = require('joi');
const CoreValidator = require('./CoreValidator');
class CartItemValidator extends CoreValidator {
  constructor() {
    const schema = {
      body: Joi.object({
        productVersionId: Joi.number().integer(),
        quantity: Joi.number().integer().default(1),
      }),
    };
    super(schema);
  }
}

module.exports = new CartItemValidator();
