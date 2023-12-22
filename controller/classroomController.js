const factory = require('./factoryHandler');
const classroomModel = require('../model/classroomModel');
const classroomParticipantModel = require('../model/classroomParticipantModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.inviteToClassroom = catchAsync(async (req, res, next) => {
  const { id: classroom } = req.params;
  const userId = req.user.id;
  const { joinCode } = req.query;
  if (!joinCode) return next(new AppError(400, 'Invalid invitation'));
  const data = await classroomParticipantModel.create({
    classroom,
    user: userId,
  });

  return res.status(200).json({
    status: 'success',
    data,
  });
});

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

exports.checkJoinedClassroom = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { classroomId } = req.params;
  const doc = await classroomParticipantModel.find({
    user: user.id,
    classroom: classroomId,
  });
  return res.status(200).json({
    status: 'success',
    data: {
      joined: !!doc.length,
    },
  });
});

exports.joinClassroomByCode = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { joinCode } = req.params;
  const classroom = await classroomModel.findOne({ joinCode: joinCode });
  if (!classroom) {
    return next(new AppError(404, 'Invalid join code'));
  }
  await classroomParticipantModel.create({
    user: user.id,
    classroom: classroom.id,
  });

  console.log(classroom, joinCode);
  return res.status(200).json({
    status: 'success',
    data: classroom,
  });
});
