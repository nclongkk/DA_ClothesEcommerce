const Joi = require('joi');
const CoreValidator = require('./CoreValidator');
class CreateOrder extends CoreValidator {
  constructor() {
    const schema = {
      body: Joi.object({
        addressId: Joi.number().integer().required(),
        shopId: Joi.number().integer().required(),
        promotionId: Joi.number().integer(),
        shippingUnitId: Joi.number().integer().required(),
        isPurchased: Joi.boolean().default(true),
        orderItems: Joi.array().items(
          Joi.object({
            productVersionId: Joi.number().integer().required(),
            quantity: Joi.number().integer().required(),
          })
        ),
        senderPayPalMail: Joi.string().email(),
      }),
    };
    super(schema);
  }
}

module.exports = new CreateOrder();
