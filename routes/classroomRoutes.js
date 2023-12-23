const express = require('express');

const classroomController = require('../controller/classroomController');
const authController = require('../controller/authController');

const router = express.Router();

router.get('/:id', classroomController.getClassroomById);
router.get(
  '/invite/:id',
  authController.protect,
  classroomController.inviteToClassroom
);
router.get('/:id/participants', classroomController.getParticipant);
router.get('/:id/structureGrade', classroomController.getStructureGrade);
router.get('/:id/studentGrade', classroomController.getGradeInClassroom);

module.exports = router;
