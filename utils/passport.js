const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const PassportJWT = require('passport-jwt');
const crypto = require('crypto');
const User = require('../model/userModel');
const { appConfig } = require('./appConfig');

const JwtStrategy = PassportJWT.Strategy;
const { ExtractJwt } = PassportJWT;
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const JWTStrat = new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
  const { id } = jwtPayload;
  //Check user
  const user = await User.findById(id);
  if (user) {
    done(null, user);
  } else {
    done(null, false);
  }
});

const googleStrat = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: `${appConfig.SERVER_URL}/auth/oauth2/redirect/google`,
  },
  (accessToken, refreshToken, profile, done) => {
    process.nextTick(async () => {
      try {
        // Extract relevant user information from the profile
        const { id, displayName, emails } = profile;

        const existedUser = await User.findOne({ email: emails[0].value });
        if (existedUser) {
          return done(null, existedUser);
        }

        const newUser = await User.create({
          id: id,
          name: displayName,
          email: emails[0].value,
          verify: true,
          verifyToken: crypto.randomBytes(128).toString('hex'),
          provider: 'google',
        });

        done(null, newUser);
      } catch (err) {
        console.log(err);
        return done(null, false, { message: 'Error' });
      }
    });
  }
);

const facebookStrat = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: `${appConfig.SERVER_URL}/auth/oauth2/redirect/facebook`,
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
          verify: true,
          provider: 'facebook',
        });
        done(null, newUser);
      } catch (err) {
        return done(null, false, { message: 'Error' });
      }
    });
  }
);

passport.use(facebookStrat);
passport.use(googleStrat);
passport.use(JWTStrat);

module.exports = passport;
