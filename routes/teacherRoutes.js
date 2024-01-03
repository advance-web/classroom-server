const express = require('express');

const authController = require('../controller/authController');
const classroomController = require('../controller/classroomController');
const teacherController = require('../controller/teacherController');
const structureGradeController = require('../controller/structureGradeController');
const studentGradeController = require('../controller/studentGradeController');
const userController = require('../controller/userController');

const router = express.Router();

router.use(authController.protect, authController.restrictTo('teacher'));

router.get('/classes', (req, res) => res.json({ message: 'list class' }));
router.post(
  '/new-classroom',
  teacherController.teacherDoingAction,
  classroomController.createClassroom
);
router.post('/classroom-invite', teacherController.inviteByEmail);
router.post(
  '/new-structureGrade/:classroomId',
  teacherController.teacherDoingAction,
  classroomController.doingClassroomAction,
  structureGradeController.createStructureGrade
);

router.post('/mark-grade', studentGradeController.markGrade);
router.patch(
  '/id-mapping/:id',
  userController.mappingId,
  userController.updateUser
);
module.exports = router;
