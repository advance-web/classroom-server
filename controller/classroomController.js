const factory = require('./factoryHandler');
const classroomModel = require('../model/classroomModel');
const classroomParticipantModel = require('../model/classroomParticipantModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

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