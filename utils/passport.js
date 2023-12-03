const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../model/userModel');

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: 'http://localhost:3000/auth/oauth2/redirect/facebook',
      profileFields: ['id', 'emails', 'name'], //This
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(async () => {
        try {
          const { _json: data } = profile;

          const existedUser = await User.findOne({ email: data.email });
          if (existedUser) {
            return done(null, existedUser);
          }
          const newUser = await User.create({
            id: data.id,
            name: `${data.last_name} ${data.first_name}`,
            email: data.email,
          });
          done(null, newUser);
        } catch (err) {
          return done(null, false, { message: 'Error' });
        }
      });
    }
  )
);

module.exports = passport;
