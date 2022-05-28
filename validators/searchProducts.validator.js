const Joi = require('joi');
const CoreValidator = require('./CoreValidator');
class SearchProductsValidator extends CoreValidator {
  constructor() {
    const schema = {
      query: Joi.object({
        page: Joi.number().integer().default(1),
        limit: Joi.number().integer().default(9),
        keyword: Joi.string().trim().allow(''),
        min: Joi.number().integer().default(0).allow(''),
        max: Joi.number().integer().default(0).allow(''),
        sort: Joi.string()
          .trim()
          .allow('')
          .valid('soldQuantity', 'createdAt', 'minPrice', 'avgRatings')
          .default('soldQuantity'),
        order: Joi.string()
          .trim()
          .allow('')
          .valid('asc', 'desc')
          .default('desc'),
      }).unknown(true),
    };
    super(schema);
  }
}

module.exports = new SearchProductsValidator();
