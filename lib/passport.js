const passport = require('passport');
const PassportJWT = require('passport-jwt');
const User = require('../model/userModel');

const JwtStrategy = PassportJWT.Strategy;
const { ExtractJwt } = PassportJWT;
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    const { id } = jwtPayload;
    //Check user
    const user = await User.findById(id);
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  })
);

module.exports = passport;
