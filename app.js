//package
const path = require('path');
const express = require('express');
const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const cors = require('cors');
//utils
const AppError = require('./utils/AppError');

const GlobalErrorHandler = require('./controller/errorController');

//router
// const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const studentRouter = require('./routes/studentRoutes');
const teacherRouter = require('./routes/teacherRoutes');
const classroomRouter = require('./routes/classroomRoutes');
const structureGradeRouter = require('./routes/structureGradeRoutes');
const gradeReviewRouter = require('./routes/gradeReviewRoutes');
const notificationRouter = require('./routes/notificationRoutes');
const adminRouter = require('./routes/adminRoutes');

const app = express();

//Serving static file
app.use(express.static(path.join(__dirname, 'public')));

//Dev log
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
if (process.env.NODE_ENV === 'production') console.log('Working in Production');

//rate limit
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many request to this ip!! Try again in an hour',
// });
//cors
const whitelist = [
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
  'http://localhost:3001',
  'http://localhost:5173',
];
const corsOrigin = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      console.log(origin);
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOrigin));

// app.use('/api', limiter);
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

//Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
//Cookie parser
app.use(cookieParser());

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());
//data sanitization against xss
app.use(xss());

//prevent parameter pollution
// app.use(
//   hpp({
//     whitelist: [
//       'duration',
//       'ratingsAverage',
//       'ratingQuantity',
//       'difficulty',
//       'price',
//     ],
//   })
// );

//Check request time middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//DEFINE API HERE
app.use('/api/users', userRouter);
app.use('/api/students', studentRouter);
app.use('/api/teachers', teacherRouter);
app.use('/api/classroom', classroomRouter);
app.use('/api/structureGrade', structureGradeRouter);
app.use('/api/gradeReview', gradeReviewRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/admin', adminRouter);

app.use('/auth', authRouter);

//Global error handler
app.all('*', (req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server`));
});

app.use(GlobalErrorHandler);

module.exports = app;
