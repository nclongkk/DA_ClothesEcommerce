const Joi = require('joi');
const { ORDER_STATUS } = require('../constants/constants');
const CoreValidator = require('./CoreValidator');
class UpdateOrderStatus extends CoreValidator {
  constructor() {
    const schema = {
      body: Joi.object({
        status: Joi.string()
          .trim()
          .valid(
            ORDER_STATUS.PROCESSING,
            ORDER_STATUS.SHIPPED,
            ORDER_STATUS.DELIVERED
          )
          .required(),
      }),
    };
    super(schema);
  }
}

module.exports = new UpdateOrderStatus();
