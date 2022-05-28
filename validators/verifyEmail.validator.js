const Joi = require('joi');
const CoreValidator = require('./CoreValidator');
class EmailVerifier extends CoreValidator {
  constructor() {
    const schema = {
      body: Joi.object({
        secretCode: Joi.string().trim().length(6).required(),
        email: Joi.string().email().lowercase().trim().required(),
      }),
    };
    super(schema);
  }
}

module.exports = new EmailVerifier();
