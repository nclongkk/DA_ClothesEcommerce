const jwt = require('jsonwebtoken');

const getSignedJwtToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

exports.sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = getSignedJwtToken(user.id);
  const options = {
    httpOnly: true,
  };
  return res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};

exports.response = (result, statusCode, res) => {
  return res.status(statusCode).json({ result });
};
