const express = require('express');

const userController = require('../controller/userController');
const authController = require('../controller/authController');
const classroomController = require('../controller/classroomController');

const router = express.Router();

router.get('/verify', authController.verify);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/accept-send-email', authController.acceptSendEmail);
router.post('/reset-password', authController.resetPassword);
router.get('/reset-password', authController.resetPassword);

router.use(authController.protect, userController.getMe);

router.get(
  '/me/classrooms',
  authController.protect,
  classroomController.getClassroomByUserId
);

router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);
router.patch(
  '/me',
  authController.protect,
  userController.getMe,
  userController.updateUser
);

module.exports = router;
