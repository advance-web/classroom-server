const express = require('express');

const authController = require('../controller/authController');
const adminController = require('../controller/adminController');
const classroomController = require('../controller/classroomController');
const userController = require('../controller/userController');

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
router.patch('/classrooms/:id', classroomController.updateClassroomById);
router.get('/users', userController.getAllUser);
router.patch('/users/:id', userController.updateUser);
router.patch(
  '/id-mapping/:id',
  userController.mappingId,
  userController.updateUser
);

module.exports = router;
