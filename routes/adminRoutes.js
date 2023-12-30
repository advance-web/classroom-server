const express = require('express');

const authController = require('../controller/authController');
const adminController = require('../controller/adminController');

const router = express.Router();

router.post('/', adminController.createAdminAccount);
router.post('/login', authController.adminLogin);
router.get(
  '/me',
  authController.restrictToAdmin,
  adminController.getMe,
  adminController.getAdmin
);

module.exports = router;
