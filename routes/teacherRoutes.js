const express = require('express');

const authController = require('../controller/authController');
const classroomController = require('../controller/classroomController');
const teacherController = require('../controller/teacherController');

const router = express.Router();

router.use(authController.protect, authController.restrictTo('teacher'));

router.get('/classes', (req, res) => res.json({ message: 'list class' }));
router.post(
  '/new-classroom',
  teacherController.meCreateClassroom,
  classroomController.createClassroom
);

module.exports = router;
