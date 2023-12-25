const studentGradeModel = require('../model/studentGradeModel');
const structureGradeModel = require('../model/structureGradeModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.markGrade = catchAsync(async (req, res, next) => {
  // body: studentId, StructureGradeID, grade
  const { id: teacher } = req.user;
  const { student, grade, structureGrade } = req.body;
  const structureGradeDoc = await structureGradeModel.findById(structureGrade);
  // teacher: req.user

  const doc = await studentGradeModel.findOneAndUpdate(
    { student, structureGrade },
    {
      student,
      structureGrade,
      teacher,
      grade,
      classroom: structureGradeDoc.classroom,
    },
    { upsert: true, new: true }
  );

  return res.status(200).json({
    status: 'success',
    data: doc,
  });
});

exports.getStudentGradeInClassroom = catchAsync(async (req, res, next) => {
  const { classroomId } = req.params;
  const { id: student } = req.user;
  const doc = await studentGradeModel
    .find({ student, classroom: classroomId })
    .populate({
      path: 'structureGrade',
      match: {
        classroom: classroomId,
      },
      select: 'name scale id',
    })
    .select('structureGrade grade');
  if (!doc.length) return next(new AppError(400, 'Grade not found'));
  return res.status(200).json({
    status: 'success',
    data: {
      grades: doc,
      total: doc.reduce(
        (total, grade) => total + grade.grade * grade.structureGrade.scale,
        0
      ),
    },
  });
});
