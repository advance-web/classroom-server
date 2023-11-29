// const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { appConfig } = require('../utils/appConfig');
const Email = require('../utils/email');
// const Email = require('../utils/email');
const passportJWT = require('../lib/passport');
const passport = require('../utils/passport');
const passportGoogle = require('../utils/passportGoogle');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendUser = (user, statusCode, res) => {
  const token = signToken(user._id);
  const expiresDate = new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  );
  const cookieOptions = {
    expires: expiresDate,
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  };
  // if (process.env.DOT_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    tokenExpires: expiresDate,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword, role, phone, address } =
    req.body;

  const verifyToken = crypto.randomBytes(128).toString('hex');
  const newUser = await User.create({
    name,
    email,
    password,
    confirmPassword,
    role,
    address,
    phone,
    verifyToken,
    verify: false,
  });
  try {
    Email.sendVerificationEmail(newUser, verifyToken);
    res.send('Verification email sent. Please check your email.');
  } catch (error) {
    console.log('Lỗi: ', error);
  }
});

exports.verify = catchAsync(async (req, res, next) => {
  // eslint-disable-next-line prefer-destructuring
  const verifyToken = req.query.token;
  console.log('verify token: ', verifyToken);
  const expiresDate = new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  );
  const cookieOptions = {
    expires: expiresDate,
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  };

  if (!verifyToken) {
    return res.status(400).send('Token is missing.');
  }

  const user = await User.findOne({ verifyToken });

  if (!user) {
    return res.status(404).send('User not found.');
  }

  let tokenLocalStorage = signToken(user.id);
  if (req.cookies.jwt) {
    tokenLocalStorage = req.cookies.jwt;
  }
  res.cookie('jwt', tokenLocalStorage, cookieOptions);

  user.verify = true;
  await user.save();

  createSendUser(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //Check for email and password
  if (!email || !password) {
    return next(new AppError(400, 'Invalid email or password'));
  }
  //Check for user and pass
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError(401, 'Wrong email or password'));
  }
  //send back token
  createSendUser(user, 200, res);
});

exports.logout = (req, res) => {
  res
    .cookie('jwt', 'loggedOut', {
      expires: new Date(Date.now() + 1 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    })
    .status(200)
    .json({ status: 'success' });
};

//Kiem tra user đăng nhập hay chưa
//Neu dang nhap roi thi luu user vao req
//Chua thi tra ve loi middleware
exports.protect = catchAsync(async (req, res, next) => {
  passportJWT.authenticate('jwt', (err, user) => {
    if (err) return next(err);
    if (!user)
      return next(new AppError(401, 'Please log in to access this feature'));
    req.user = user;
    next();
  })(req, res, next);
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(403, 'You do not have permission to do this action')
      );
    }
    next();
  };

exports.faceboookLogin = (req, res, next) => {
  const expiresDate = new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  );

  const cookieOptions = {
    expires: expiresDate,
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  };
  passport.authenticate('facebook', { session: false }, (err, user) => {
    // Decide what to do on authentication
    if (err || !user) {
      return res.redirect(`${appConfig.CLIENT_URL}/sign-in`);
    }
    req.login(user, { session: false }, () => {
      const token = signToken(user.id);
      res.cookie('jwt', token, cookieOptions);
      res.redirect(`${appConfig.CLIENT_URL}/login-success/${token}`);
    });
  })(req, res, next);
};

exports.acceptSendEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  // Check for email and password
  if (!email) {
    return next(new AppError(400, 'Invalid email or password'));
  }
  //Check for user and pass
  const user = await User.findOne({ email });
  if (!user) {
    res.send('Email không tồn tại');
  } else {
    Email.acceptSendEmail(user);
  }

  // send back token
  // createSendUser(user, 200, res);
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const verifyToken = req.query.token;
  console.log('verify token: ', verifyToken);

  if (!verifyToken) {
    return res.status(400).send('Token is missing.');
  }

  const user = await User.findOne({ verifyToken });

  if (!user) {
    return res.status(404).send('User not found.');
  }

  user.password = req.body.password;
  await user.save();
});

exports.googleLogin = (req, res, next) => {
  const { user } = req;

  if (!user) {
    return res.redirect(`${appConfig.CLIENT_URL}/sign-in`);
  }

  const token = signToken(user.id);

  const expiresDate = new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  );

  const cookieOptions = {
    expires: expiresDate,
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  };

  res.cookie('jwt', token, cookieOptions);

  console.log('User id:', user.id);

  // Redirect to the success page with the token
  res.redirect(`${appConfig.CLIENT_URL}/login-success/${token}`);
};
