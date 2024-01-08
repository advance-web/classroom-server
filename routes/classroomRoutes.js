const express = require('express');

const classroomController = require('../controller/classroomController');
const authController = require('../controller/authController');
const notificationController = require('../controller/notificationController');

const router = express.Router();

router.get('/:id', classroomController.getClassroomById);
router.get(
  '/invite/:id',
  authController.protect,
  classroomController.inviteToClassroom
);

router.use(authController.protect);
router.get('/:id/participants', classroomController.getParticipant);
router.get('/:id/structureGrade', classroomController.getStructureGrade);
router.get('/:id/studentGrade', classroomController.getGradeInClassroom);
router.get('/:id/status', classroomController.getClassroomStatus);
router.get(
  '/:id/gradeReview',
  classroomController.getAllGradeReviewInClassroom
);
router.get(
  '/:id/gradeReview/comments',
  classroomController.getAllGradeReviewInClassroom
);

router.post(
  '/:id/broadcast',
  authController.restrictTo('teacher'),
  notificationController.notifyAllStudentInClassroom
);
router.post('/:id/unicast', notificationController.notifyOtherUserInClassroom);

module.exports = router;
