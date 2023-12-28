const express = require('express');

const authController = require('../controller/authController');
const notificationController = require('../controller/notificationController');

const router = express.Router();

router.use(authController.protect);
router.patch('/:id', notificationController.updateNotification);

module.exports = router;
