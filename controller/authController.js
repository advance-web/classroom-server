const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');
const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { appConfig } = require('../utils/appConfig');
const Email = require('../utils/email');
const passport = require('../utils/passport');
const adminModel = require('../model/adminModel');

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
    const Sender = new Email({ email, name });
    await Sender.sendVerificationEmail(verifyToken);
    createSendUser(newUser, 201, res);
  } catch (error) {
    console.log('Lỗi: ', error);
  }
});

exports.verify = catchAsync(async (req, res, next) => {
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
  passport.authenticate('jwt', (err, user) => {
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
  const { user } = req;
  const expiresDate = new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  );

  const cookieOptions = {
    expires: expiresDate,
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  };
  if (!user) {
    return res.redirect(`${appConfig.CLIENT_URL}/sign-in`);
  }
  const token = signToken(user.id);
  res.cookie('jwt', token, cookieOptions);
  res.redirect(`${appConfig.CLIENT_URL}/login-success/${token}`);
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
    return next(new AppError(404, 'Email not exsist in our system'));
  }
  const Sender = new Email({ name: user.name, email: user.email });
  await Sender.acceptSendEmail(user.verifyToken);
  res.status(200).json({
    status: 'success',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const verifyToken = req.query.token;
  if (!verifyToken) {
    return next(new AppError(400, 'Invalid token'));
  }

  const user = await User.findOne({ verifyToken });
  if (!user) {
    return next(new AppError(400, 'User not found'));
  }

  user.password = req.body.password;
  await user.save();

  createSendUser(user, 200, res);
});

exports.googleLogin = (req, res, next) => {
  const { user } = req;
  console.log(user);

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

  // Redirect to the success page with the token
  res.redirect(`${appConfig.CLIENT_URL}/login-success/${token}`);
};

exports.sendVerificationEmail = catchAsync(async (req, res, next) => {
  const { user } = req;
  console.log(user);
  const Sender = new Email({ email: user.email, name: user.name });
  await Sender.sendVerificationEmail(user.verifyToken);
  res.status(200).json({
    status: 'success',
  });
});

exports.adminLogin = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  //Check for email and password
  if (!username || !password) {
    return next(new AppError(400, 'Invalid username or password'));
  }
  //Check for user and pass
  const user = await adminModel.findOne({ username }).select('+password');
  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError(401, 'Wrong username or password'));
  }
  //send back token
  createSendUser(user, 200, res);
});

exports.restrictToAdmin = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const admin = await adminModel.findById(decoded.id);
  if (!admin) {
    return next(new AppError('Admin not exsist', 401));
  }

  req.admin = admin;
  next();
});
