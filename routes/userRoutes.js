const express = require('express');

const userController = require('../controller/userController');
const authController = require('../controller/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
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
