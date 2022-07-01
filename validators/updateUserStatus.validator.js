const Joi = require('joi');
const CoreValidator = require('./CoreValidator');
class UpdateUserStatusValidator extends CoreValidator {
  constructor() {
    const schema = {
      body: Joi.object({
        isActive: Joi.boolean().required(),
      }),
    };
    super(schema);
  }
}

module.exports = new UpdateUserStatusValidator();
