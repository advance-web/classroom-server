const factory = require('./factoryHandler');
const classroomModel = require('../model/classroomModel');
const classroomParticipantModel = require('../model/classroomParticipantModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.inviteToClassroom = (req, res, next) => {
  if (req.query.joinCode) {
    // Create a new URL object using the original URL and base URL
    const originalUrl = new URL(
      req.originalUrl,
      `${req.protocol}://${req.get('host')}`
    );

    // Construct a redirect URL to the sign-in page with the 'continue' parameter
    const redirectUrl = `${req.protocol}://${req.get(
      'host'
    )}/sign-in?continue=${encodeURIComponent(originalUrl.toString())}`;

    // Redirect the user to the sign-in page
    return res.redirect(redirectUrl);
  }
};

exports.getClassroomById = factory.getOne(classroomModel, {
  path: 'teacher',
});
exports.createClassroom = factory.createOne(classroomModel);

exports.getParticipant = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const doc = await classroomParticipantModel
    .find({ classroom: id })
    .select('user')
    .populate({ path: 'user', select: ['id', 'email', 'name', 'role'] });
  if (!doc.length) return next(new AppError(400, 'Participant not found'));
  return res.status(200).json({
    status: 'success',
    data: doc.map((participantInfo) => participantInfo.user),
  });
});

exports.getClassroomByUserId = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const doc = await classroomParticipantModel
    .find({ user: id })
    .select('classroom')
    .populate({
      path: 'classroom',
      populate: { path: 'teacher', select: ['email', 'name'] },
    });
  return res.status(200).json({
    status: 'success',
    data: doc,
  });
});
