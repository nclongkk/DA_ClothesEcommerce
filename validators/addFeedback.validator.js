const Joi = require('joi');
const CoreValidator = require('./CoreValidator');
class AddFeedback extends CoreValidator {
  constructor() {
    const schema = {
      body: Joi.object({
        content: Joi.string().required(),
        rating: Joi.number().required(),
        feedbackImages: Joi.array().items(Joi.string()),
        orderItemId: Joi.number().required(),
      }),
      params: Joi.object({
        productId: Joi.number().required(),
      }),
    };

    super(schema);
  }
}

module.exports = new AddFeedback();
