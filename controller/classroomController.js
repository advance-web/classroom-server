const { default: mongoose } = require('mongoose');
const factory = require('./factoryHandler');
const classroomModel = require('../model/classroomModel');
const classroomParticipantModel = require('../model/classroomParticipantModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const structureGradeModel = require('../model/structureGradeModel');
const studentGradeModel = require('../model/studentGradeModel');
const userModel = require('../model/userModel');
const gradeReviewModel = require('../model/gradeReviewModel');

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

  return res.status(200).json({
    status: 'success',
    data: classroom,
  });
});

exports.doingClassroomAction = (req, res, next) => {
  const { classroomId } = req.params;
  const teacher = req.user.id;
  const participant = classroomParticipantModel.findOne({
    classroom: classroomId,
    user: teacher,
  });

  if (!participant)
    return next(new AppError('Please join class before use this feature'));
  req.body.classroom = classroomId;
  next();
};

exports.getStructureGrade = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const doc = await structureGradeModel.find({ classroom: id });
  if (!doc.length) return next(new AppError(400, 'Structure Grade not found'));
  return res.status(200).json({
    status: 'success',
    data: doc,
  });
});

exports.getGradeInClassroom = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const doc = await studentGradeModel.aggregate([
    {
      $match: {
        classroom: mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: structureGradeModel.collection.name,
        localField: 'structureGrade',
        foreignField: '_id',
        as: 'structureGradeInfo',
      },
    },
    {
      $unwind: '$structureGradeInfo',
    },
    {
      $group: {
        _id: '$student',
        grades: {
          $push: {
            structureGrade: '$structureGradeInfo',
            grade: '$grade',
          },
        },
      },
    },
    {
      $lookup: {
        from: userModel.collection.name,
        localField: '_id',
        foreignField: '_id',
        as: 'studentInfo',
      },
    },
    {
      $unwind: '$studentInfo',
    },
    {
      $project: {
        studentInfo: {
          email: 1,
          name: 1,
          _id: 1,
        },
        _id: 0,
        'grades.structureGrade': {
          name: 1,
          scale: 1,
          _id: 1,
        },
        'grades.grade': 1,
      },
    },
  ]);
  if (!doc.length) return next(new AppError(400, 'Grade not found'));
  return res.status(200).json({
    status: 'success',
    data: doc.filter((d) => d.structureGrade !== null),
  });
});

exports.getAllGradeReviewInClassroom = catchAsync(async (req, res, next) => {
  const classroomId = req.params.id;
  const pipeline = [
    {
      $lookup: {
        from: studentGradeModel.collection.name,
        localField: 'studentGrade',
        foreignField: '_id',
        as: 'currentGrade',
      },
    },
    {
      $unwind: '$currentGrade',
    },
    {
      $match: {
        'currentGrade.classroom': mongoose.Types.ObjectId(classroomId),
      },
    },
    {
      $lookup: {
        from: structureGradeModel.collection.name,
        localField: 'currentGrade.structureGrade',
        foreignField: '_id',
        as: 'structureGradeInfo',
      },
    },
    {
      $unwind: '$structureGradeInfo',
    },
    {
      $project: {
        student: 1,
        expectationGrade: 1,
        reason: 1,
        createdAt: 1,
        currentGrade: '$currentGrade.grade',
        structureGrade: {
          name: '$structureGradeInfo.name',
          scale: '$structureGradeInfo.scale',
        },
        // currentGrade: 'currentGrade.grade',
        // structureGradeInfo: {
        //   name: 1,
        //   scale: 1,
        // },
      },
    },
  ];
  if (req.user.role === 'student')
    pipeline.push({
      $match: {
        student: mongoose.Types.ObjectId(req.user.id),
      },
    });
  const doc = await gradeReviewModel.aggregate(pipeline);
  return res.status(200).json({ doc });
});
