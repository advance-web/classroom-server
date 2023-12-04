const express = require('express');

const passport = require('../utils/passport');
const authController = require('../controller/authController');

const router = express.Router();

router.get(
  '/login/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);
router.get(
  '/oauth2/redirect/facebook',
  passport.authenticate('facebook', {
    failureRedirect: '/',
    session: false,
  }),
  authController.faceboookLogin
);

router.get(
  '/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
  '/oauth2/redirect/google',
  passport.authenticate('google', {
    failureRedirect: '/',
    session: false,
  }),
  authController.googleLogin
);

module.exports = router;
