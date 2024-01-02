const express = require('express');

const authController = require('../controller/authController');
const studentController = require('../controller/studentController');
const gradeReviewController = require('../controller/gradeReviewController');

const router = express.Router();

router.post(
  '/:gradeReviewId/comments',
  authController.protect,
  gradeReviewController.setUserCreateComment,
  gradeReviewController.createComment
);
router.get(
  '/:gradeReviewId/comments',
  authController.protect,
  gradeReviewController.setUserCreateComment,
  gradeReviewController.getGradeReviewComment
);

router.get('/:id', gradeReviewController.getGradeReview);
router.patch('/:id', gradeReviewController.updateGradeReview);

router.use(authController.protect, authController.restrictTo('student'));
router.post(
  '/',
  studentController.studentDoingAction,
  gradeReviewController.createGradeReview
);

module.exports = router;
