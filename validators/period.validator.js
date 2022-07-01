const Joi = require('joi');
const CoreValidator = require('./CoreValidator');
class PaginateValidator extends CoreValidator {
  constructor() {
    const schema = {
      query: Joi.object({
        startDate: Joi.string()
          .isoDate()
          .default(new Date('2000-01-01').toISOString()),
        endDate: Joi.string().isoDate().default(new Date().toISOString()),
      }),
    };
    super(schema);
  }
}

module.exports = new PaginateValidator();
