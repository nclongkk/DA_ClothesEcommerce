const Joi = require('joi');
const CoreValidator = require('./CoreValidator');
class Email extends CoreValidator {
  constructor() {
    const schema = {
      body: Joi.object({
        email: Joi.string().email().lowercase().trim().required(),
      }),
    };
    super(schema);
  }
}

module.exports = new Email();
