const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../model/userModel');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/oauth2/redirect/google',
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(async () => {
        try {
          console.log('Profile: ', profile);
          // Extract relevant user information from the profile
          const { id, displayName, emails } = profile;

          console.log('Profile: ', profile);

          const existedUser = await User.findOne({ email: emails[0].value });
          if (existedUser) {
            return done(null, existedUser);
          }

          const newUser = await User.create({
            id: id,
            name: displayName,
            email: emails[0].value,
          });

          done(null, newUser);
        } catch (err) {
          console.log('Profile: ', profile);
          return done(null, false, { message: 'Error' });
        }
      });
    }
  )
);

module.exports = passport;
