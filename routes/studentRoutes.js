const express = require('express');

const authController = require('../controller/authController');

const router = express.Router();

router.use(authController.protect, authController.restrictTo('student'));
router.get('/classes', (req, res) => res.json({ message: 'list class' }));

module.exports = router;
