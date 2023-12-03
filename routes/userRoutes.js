const express = require('express');

const userController = require('../controller/userController');
const authController = require('../controller/authController');

const router = express.Router();

router.get('/verify', authController.verify);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/accept-send-email', authController.acceptSendEmail);
router.post('/reset-password', authController.resetPassword);
router.get('/reset-password', authController.resetPassword);
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

router.get('/:id', userController.getUser);
router.patch('/:id', userController.updateUser);

module.exports = router;
