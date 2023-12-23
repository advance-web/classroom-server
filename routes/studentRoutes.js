const express = require('express');

const authController = require('../controller/authController');
const studentGradeController = require('../controller/studentGradeController');

const router = express.Router();

router.use(authController.protect, authController.restrictTo('student'));
// router.get('/classes', (req, res) => res.json({ message: 'list class' }));
router.get(
  '/grade/:classroomId',
  studentGradeController.getStudentGradeInClassroom
);

module.exports = router;
