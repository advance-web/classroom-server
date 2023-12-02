const express = require('express');

const passport = require('../utils/passport');
const passportGoogle = require('../utils/passportGoogle');
const authController = require('../controller/authController');

const router = express.Router();

router.get(
  '/login/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);
router.get('/oauth2/redirect/facebook', authController.faceboookLogin);

router.get(
  '/login/google',
  passportGoogle.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
  '/oauth2/redirect/google',
  passportGoogle.authenticate('google', {
    failureRedirect: '/',
    session: false,
  }),
  authController.googleLogin
);

module.exports = router;
