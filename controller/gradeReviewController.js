const factory = require('./factoryHandler');
const gradeReviewModel = require('../model/gradeReviewModel');
const gradeReviewCommentModel = require('../model/gradeReviewCommentModel');
const catchAsync = require('../utils/catchAsync');
const studentGradeModel = require('../model/studentGradeModel');
const AppError = require('../utils/AppError');

exports.createGradeReview = factory.createOne(gradeReviewModel);
exports.getGradeReview = factory.getOne(gradeReviewModel, { path: 'comments' });
exports.updateGradeReview = factory.updateOne(gradeReviewModel);

exports.studentOwnGrade = catchAsync(async (req, res, next) => {
  const { student, studentGrade } = req.body;
  const doc = await studentGradeModel.find({ student, _id: studentGrade });

  if (!doc)
    return next(
      new AppError(
        404,
        'You do not have right to request a review on this grade'
      )
    );

  return next();
});

exports.setUserCreateComment = (req, res, next) => {
  // Allow nested routes
  if (!req.body.gradeReview) req.body.gradeReview = req.params.gradeReviewId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createComment = factory.createOne(gradeReviewCommentModel);

exports.getGradeReviewComment = catchAsync(async (req, res, next) => {
  const { gradeReviewId } = req.params;
  const doc = await gradeReviewCommentModel.find({
    gradeReview: gradeReviewId,
  });
  return res.status(200).json({
    status: 'success',
    data: doc,
  });
});
