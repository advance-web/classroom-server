const { default: mongoose } = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const NotificationModel = require('../model/notificationModel');
const classroomParticipantModel = require('../model/classroomParticipantModel');
const userModel = require('../model/userModel');
const notificationModel = require('../model/notificationModel');
const factory = require('./factoryHandler');

exports.notifyAllStudentInClassroom = catchAsync(async (req, res) => {
  const teacher = req.user.id;
  const classroom = req.params.id;
  const studentInClassroom = await classroomParticipantModel.aggregate([
    {
      $lookup: {
        from: userModel.collection.name,
        localField: 'user',
        foreignField: '_id',
        as: 'userInfo',
      },
    },
    {
      $unwind: '$userInfo',
    },
    {
      $match: {
        'userInfo.role': 'student',
        classroom: mongoose.Types.ObjectId(classroom),
      },
    },
    {
      $project: {
        student: '$userInfo._id',
      },
    },
  ]);

  const { type, redirect, content } = req.body;
  const doc = await NotificationModel.create({
    from: teacher,
    to: studentInClassroom.map((info) => info.student),
    classroom,
    type,
    redirect,
    content,
  });
  return res.status(200).json({
    status: 'success',
    data: doc,
  });
});
exports.notifyOtherUserInClassroom = catchAsync(async (req, res) => {
  const { user } = req;
  const { type, redirect, content, to } = req.body;
  const classroom = req.params.id;
  const doc = await NotificationModel.create({
    from: user.id,
    to: [to],
    classroom,
    type,
    redirect,
    content,
  });
  return res.status(200).json({
    status: 'success',
    data: doc,
  });
});

exports.getUserNotification = catchAsync(async (req, res) => {
  const doc = await notificationModel
    .find({ to: req.user.id })
    .populate({ path: 'from', select: 'email name role' })
    .populate({ path: 'classroom', select: 'name' })
    .select('-to')
    .sort('-createdAt');
  res.status(200).json({
    data: doc,
  });
});

exports.updateNotification = factory.updateOne(notificationModel);
