const express = require('express');

const passport = require('../utils/passport');
const authController = require('../controller/authController');

const router = express.Router();

router.get(
  '/login/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);
router.get('/oauth2/redirect/facebook', authController.faceboookLogin);

module.exports = router;
