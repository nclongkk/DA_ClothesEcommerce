const express = require('express');
const {
  addFeedback,
  getFeedbacks,
  deleteFeedback,
} = require('../controllers/feedbacks');
const { authenticate, authorize } = require('../middlewares/auth');
const router = express.Router({ mergeParams: true });
const paginate = require('../validators/paginate.validator');
const addFeedbackValidator = require('../validators/addFeedback.validator');

router
  .route('/')
  .get(paginate.validate(), getFeedbacks)
  .post(authenticate, addFeedbackValidator.validate(), addFeedback);
router.route('/:feedbackId').delete(authenticate, deleteFeedback);

module.exports = router;
