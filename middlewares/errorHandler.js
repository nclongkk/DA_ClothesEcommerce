const httpStatus = require('http-status');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error.message = 'error.not_found';
    error.statusCode = httpStatus.NOT_FOUND;
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    error.message = 'error.foreign_key_constrain_error';
    error.statusCode = httpStatus.NOT_FOUND;
  }
  const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const messageCode = error.message || 'error.server_error';
  res.status(statusCode).json({
    error: { code: messageCode, message: res.t(messageCode) },
  });
};

module.exports = errorHandler;
