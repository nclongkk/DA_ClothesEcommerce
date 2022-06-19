const Joi = require('joi');
const CoreValidator = require('./CoreValidator');
class UpdateNotificationStatus extends CoreValidator {
  constructor() {
    const schema = {
      body: Joi.object({
        notificationIds: Joi.array().items(Joi.number()),
      }),
    };
    super(schema);
  }
}

module.exports = new UpdateNotificationStatus();
