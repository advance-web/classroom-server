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
      select: 'name scale id isFinalize',
    })
    .select('structureGrade grade');

  if (!doc.length) return next(new AppError(400, 'Grade not found'));
  const filteredDoc = doc.filter((grade) => grade.structureGrade.isFinalize);
  const metric = filteredDoc.reduce(
    (total, grade) => {
      if (!grade.structureGrade) return total;
      return {
        sum: total.sum + grade.grade * grade.structureGrade.scale,
        scale: total.scale + grade.structureGrade.scale,
      };
    },
    { sum: 0, scale: 0 }
  );
  console.log(doc);
  return res.status(200).json({
    status: 'success',
    data: {
      grades: filteredDoc,
      total: metric.sum / metric.scale,
    },
  });
});
