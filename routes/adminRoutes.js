const express = require('express');

const authController = require('../controller/authController');
const adminController = require('../controller/adminController');
const classroomController = require('../controller/classroomController');

const router = express.Router();

router.post('/', adminController.createAdminAccount);
router.post('/login', authController.adminLogin);
router.get(
  '/me',
  authController.restrictToAdmin,
  adminController.getMe,
  adminController.getAdmin
);
router.get('/classrooms', classroomController.getAllClassroom);
router.get('/classrooms/:id/participants', classroomController.getParticipant);

module.exports = router;
