const express = require('express');
const loginValidator = require('../validators/login.validator');
const registerValidator = require('../validators/register.validator');
const emailverifer = require('../validators/verifyEmail.validator');
const emailValidator = require('../validators/validateEmail.validator');
const {
  register,
  login,
  logout,
  loginFacebook,
  forgotPassword,
  resetPassword,
  verifyEmail,
} = require('../controllers/auth');

const router = express.Router();

router.post('/register', registerValidator.validate(), register);
router.post('/verify-email', emailverifer.validate(), verifyEmail);
router.post('/login', loginValidator.validate(), login);
router.post('/facebook', loginFacebook);
router.post('/forgot-password', emailValidator.validate(), forgotPassword);
router.post('/reset-password', emailverifer.validate(), resetPassword);
router.get('/logout', logout);

module.exports = router;
